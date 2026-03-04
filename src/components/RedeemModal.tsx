import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ArrowUpCircle, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useRedeem, useUserPosition } from '@yo-protocol/react';
import { useYoRuntime } from '../hooks/useYoRuntime';
import { getGoalIconOption } from '../utils/goalIcons';
import { VAULT_UI_CONFIG } from '../utils/vaults';

function shortHash(hash: string) {
  if (!hash || hash.length < 16) return hash;
  return `${hash.slice(0, 10)}...${hash.slice(-6)}`;
}

function formatErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : 'Unknown error';
  const lower = message.toLowerCase();

  if (lower.includes('user rejected') || lower.includes('denied')) {
    return 'Transaction was rejected in wallet.';
  }
  if (lower.includes('account not connected') || lower.includes('wallet')) {
    return 'Please connect your wallet first.';
  }
  if (lower.includes('chain') || lower.includes('network')) {
    return 'Switch wallet network to Base, Arbitrum, or Ethereum.';
  }
  return message;
}

export default function RedeemModal() {
  const { state, dispatch } = useApp();
  const dark = state.darkMode;
  const { open, goalId } = state.redeemModal;
  const { selectedVault } = state;
  const goal = state.goals.find((g) => g.id === goalId);
  const { address } = useAccount();
  const { network, tokenSymbol, isSelectedVaultSupportedOnChain } =
    useYoRuntime(selectedVault);

  const { position } = useUserPosition(selectedVault);

  const [percentage, setPercentage] = useState(25);
  const [uiStep, setUiStep] = useState<'input' | 'loading' | 'success' | 'failed'>('input');
  const [errorMessage, setErrorMessage] = useState('');
  const [queuedRequestId, setQueuedRequestId] = useState<string | null>(null);

  const noticeIdRef = { current: '' };

  const { redeem, step, instant, assetsOrRequestId, reset } = useRedeem({
    vault: selectedVault,
    onSubmitted: (h) => {
      dispatch({
        type: 'UPDATE_NOTIFICATION',
        payload: {
          id: noticeIdRef.current,
          patch: {
            title: 'Withdrawal submitted',
            message: `Redeem tx sent: ${shortHash(h)}`,
            type: 'pending',
          },
        },
      });
    },
    onConfirmed: (h) => {
      const isInstant = instant !== false;
      const requestId = !isInstant && assetsOrRequestId ? assetsOrRequestId.toString() : undefined;

      setUiStep('success');
      setQueuedRequestId(requestId ?? null);
      dispatch({
        type: 'UPDATE_NOTIFICATION',
        payload: {
          id: noticeIdRef.current,
          patch: {
            title: isInstant ? 'Withdrawal success' : 'Withdrawal queued',
            message: isInstant
              ? `${tokenSymbol} redeemed from ${goal?.name ?? 'goal'} on ${network}.`
              : `Redeem request queued on ${network}. Request ID: ${requestId}.`,
            type: isInstant ? 'success' : 'pending',
          },
        },
      });

      window.setTimeout(() => {
        if (goal) {
          dispatch({
            type: 'REDEEM',
            payload: {
              goalId: goal.id,
              vaultId: selectedVault,
              percentage,
              txHash: h,
              network: network!,
              status: isInstant ? 'success' : 'pending',
              requestId,
            },
          });
        }
        setUiStep('input');
        setPercentage(25);
        setErrorMessage('');
        setQueuedRequestId(null);
        reset();
      }, 1300);
    },
    onError: (e) => {
      const message = formatErrorMessage(e);
      setUiStep('failed');
      setErrorMessage(message);
      dispatch({
        type: 'UPDATE_NOTIFICATION',
        payload: {
          id: noticeIdRef.current,
          patch: {
            title: 'Withdrawal failed',
            message,
            type: 'failed',
          },
        },
      });
    },
  });

  if (!open || !goal) return null;

  const withdrawAmount = (goal.currentAmount * percentage) / 100;
  const yieldPortion = (goal.yieldEarned * percentage) / 100;
  const totalWithdraw = withdrawAmount + yieldPortion;
  const goalIconOption = getGoalIconOption(goal.icon);
  const GoalIcon = goalIconOption?.Icon;

  const handleConfirm = async () => {
    if (percentage <= 0) return;

    if (!state.connected || !address) {
      setUiStep('failed');
      setErrorMessage('Please connect wallet before redeeming.');
      return;
    }

    if (!isSelectedVaultSupportedOnChain || !network) {
      setUiStep('failed');
      setErrorMessage('Selected vault is not available on this chain. Switch to a supported network first.');
      return;
    }

    const noticeId = `n-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    noticeIdRef.current = noticeId;
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: noticeId,
        title: 'Withdrawal pending',
        message: `Submitting ${selectedVault} redeem from ${goal.name}...`,
        type: 'pending',
      },
    });

    setUiStep('loading');
    setErrorMessage('');
    setQueuedRequestId(null);

    try {
      // Get user shares from either useUserPosition or fallback to 0n
      const userShares = position?.shares ?? 0n;

      if (userShares <= 0n) {
        throw new Error('No YO vault shares found for this wallet on current chain.');
      }

      const sharesToRedeem = (userShares * BigInt(percentage)) / 100n;
      if (sharesToRedeem <= 0n) {
        throw new Error('Redeem amount is too small. Increase percentage.');
      }

      await redeem(sharesToRedeem);
    } catch (err) {
      if (uiStep !== 'failed') {
        const message = formatErrorMessage(err);
        setUiStep('failed');
        setErrorMessage(message);
        dispatch({
          type: 'UPDATE_NOTIFICATION',
          payload: {
            id: noticeIdRef.current,
            patch: {
              title: 'Withdrawal failed',
              message,
              type: 'failed',
            },
          },
        });
      }
    }
  };

  const handleClose = () => {
    setUiStep('input');
    setPercentage(25);
    setErrorMessage('');
    setQueuedRequestId(null);
    reset();
    dispatch({ type: 'CLOSE_REDEEM' });
  };

  const stepLabel = step === 'approving' ? 'Approving shares...' : step === 'redeeming' ? 'Processing withdrawal...' : step === 'waiting' ? 'Waiting for confirmation...' : 'Processing...';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`relative w-full max-w-md rounded-3xl border p-6 ${dark ? 'bg-navy-950 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
            }`}
        >
          <button
            onClick={handleClose}
            className={`absolute top-4 right-4 p-1 rounded-lg ${dark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              }`}
          >
            <X className="w-5 h-5" />
          </button>

          {uiStep === 'success' ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8"
            >
              <CheckCircle2 className={`w-16 h-16 mx-auto mb-4 ${dark ? 'text-neon-green' : 'text-mint-500'}`} />
              <h3 className="text-xl font-bold mb-2">{queuedRequestId ? 'Withdrawal Queued' : 'Withdrawal Confirmed'}</h3>
              <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                {queuedRequestId
                  ? `Request ${queuedRequestId} queued on ${network}. We will keep monitoring until settled.`
                  : `${tokenSymbol} redeem completed from ${goal.name}.`}
              </p>
            </motion.div>
          ) : uiStep === 'failed' ? (
            <div className="text-center py-10">
              <AlertTriangle className={`w-14 h-14 mx-auto mb-3 ${dark ? 'text-red-400' : 'text-red-500'}`} />
              <h3 className="text-lg font-bold mb-2">Withdrawal Failed</h3>
              <p className={`text-sm mb-4 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{errorMessage}</p>
              <button
                onClick={() => { setUiStep('input'); reset(); }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold ${dark ? 'bg-white/10 hover:bg-white/15 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
              >
                Try Again
              </button>
            </div>
          ) : uiStep === 'loading' ? (
            <div className="text-center py-12">
              <Loader2 className={`w-12 h-12 mx-auto mb-4 animate-spin ${dark ? 'text-neon-cyan' : 'text-mint-500'}`} />
              <h3 className="text-lg font-bold mb-2">Processing Withdrawal...</h3>
              <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                {stepLabel}
              </p>
              <p className={`text-xs mt-2 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                Step: {step}
              </p>
              <div className={`mt-4 w-full h-1.5 rounded-full overflow-hidden ${dark ? 'bg-white/10' : 'bg-gray-200'}`}>
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2.5 }}
                  className={`h-full rounded-full ${dark
                    ? 'bg-gradient-to-r from-neon-cyan to-neon-green'
                    : 'bg-gradient-to-r from-mint-500 to-trust-500'
                    }`}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dark ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
                  <ArrowUpCircle className={`w-5 h-5 ${dark ? 'text-orange-400' : 'text-orange-600'}`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Withdraw / Redeem</h3>
                  <div className={`text-xs flex items-center gap-2 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {GoalIcon ? (
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center ${dark ? 'bg-gold-500/10 border border-gold-300/20' : 'bg-gold-50 border border-gold-200'
                        }`}>
                        <GoalIcon className={`w-3.5 h-3.5 ${dark ? goalIconOption?.darkClass : goalIconOption?.lightClass}`} />
                      </span>
                    ) : null}
                    <span>{goal.name} - {VAULT_UI_CONFIG[selectedVault].short}</span>
                  </div>
                </div>
              </div>

              <div className={`rounded-xl p-4 mb-6 ${dark ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
                <div className="flex justify-between text-sm mb-1">
                  <span className={dark ? 'text-gray-400' : 'text-gray-500'}>Current Balance</span>
                  <span className="font-bold">${goal.currentAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={dark ? 'text-gray-400' : 'text-gray-500'}>Accumulated Yield</span>
                  <span className={`font-bold ${dark ? 'text-neon-green' : 'text-mint-600'}`}>
                    +${goal.yieldEarned.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm font-semibold mb-3 block">
                  Withdrawal Amount: <span className={`${dark ? 'text-neon-cyan' : 'text-mint-600'}`}>{percentage}%</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={percentage}
                  onChange={(e) => setPercentage(parseInt(e.target.value, 10))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer accent-mint-500"
                  style={{
                    background: `linear-gradient(to right, ${dark ? '#00fff5' : '#22c55e'} ${percentage}%, ${dark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'} ${percentage}%)`,
                  }}
                />
                <div className="flex gap-2 mt-3">
                  {[25, 50, 75, 100].map((v) => (
                    <button
                      key={v}
                      onClick={() => setPercentage(v)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${percentage === v
                        ? dark
                          ? 'bg-neon-cyan/20 text-neon-cyan ring-1 ring-neon-cyan'
                          : 'bg-mint-100 text-mint-700 ring-1 ring-mint-400'
                        : dark
                          ? 'bg-white/5 text-gray-400 hover:bg-white/10'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                    >
                      {v}%
                    </button>
                  ))}
                </div>
              </div>

              <div className={`rounded-xl p-4 mb-6 space-y-2 ${dark ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
                <p className={`text-xs font-semibold mb-2 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                  WITHDRAWAL BREAKDOWN
                </p>
                <div className="flex justify-between text-sm">
                  <span className={dark ? 'text-gray-400' : 'text-gray-500'}>Your Principal</span>
                  <span className="font-semibold">${withdrawAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={dark ? 'text-gray-400' : 'text-gray-500'}>Yield from YO</span>
                  <span className={`font-semibold ${dark ? 'text-neon-green' : 'text-mint-600'}`}>
                    +${yieldPortion.toFixed(2)}
                  </span>
                </div>
                <div className={`border-t pt-2 flex justify-between font-bold ${dark ? 'border-white/10' : 'border-gray-200'}`}>
                  <span>Total Withdrawn</span>
                  <span className="text-lg">${totalWithdraw.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleConfirm}
                disabled={percentage <= 0}
                className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all ${percentage > 0
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg'
                  : dark
                    ? 'bg-white/10 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
              >
                <ArrowUpCircle className="w-5 h-5" />
                Confirm Withdrawal
              </button>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
