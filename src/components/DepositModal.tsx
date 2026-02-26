import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ArrowDownCircle, Loader2, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import { useYoRuntime } from '../hooks/useYoRuntime';
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

export default function DepositModal() {
  const { state, dispatch } = useApp();
  const dark = state.darkMode;
  const { open, goalId } = state.depositModal;
  const { selectedVault } = state;
  const goal = state.goals.find((g) => g.id === goalId);
  const { address } = useAccount();
  const { client, network, vault, tokenAddress, tokenDecimals, tokenSymbol, isSelectedVaultSupportedOnChain } =
    useYoRuntime(selectedVault);

  const [amount, setAmount] = useState('');
  const [selectedGoal, setSelectedGoal] = useState(goalId || '');
  const [step, setStep] = useState<'input' | 'loading' | 'success' | 'failed'>('input');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setSelectedGoal(goalId || '');
  }, [goalId]);

  if (!open) return null;

  const activeGoal = state.goals.find((g) => g.id === (selectedGoal || goalId)) || goal;
  const amountNum = parseFloat(amount) || 0;
  const gasFee = 0.05;
  const total = amountNum + gasFee;

  const handleConfirm = async () => {
    if (amountNum <= 0 || !activeGoal) return;

    if (!state.connected || !address) {
      setStep('failed');
      setErrorMessage('Please connect wallet before making a deposit.');
      return;
    }

    if (!isSelectedVaultSupportedOnChain || !client || !vault || !tokenAddress || !network) {
      setStep('failed');
      setErrorMessage('Selected vault is not available on this chain. Switch to the suggested chain first.');
      return;
    }

    let amountAtomic: bigint;
    try {
      amountAtomic = parseUnits(amount, tokenDecimals);
    } catch {
      setStep('failed');
      setErrorMessage(`Invalid amount format. Use up to ${tokenDecimals} decimals.`);
      return;
    }

    if (amountAtomic <= 0n) {
      setStep('failed');
      setErrorMessage('Deposit amount must be greater than zero.');
      return;
    }

    const noticeId = `n-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: noticeId,
        title: 'Deposit pending',
        message: `Submitting ${selectedVault} deposit to ${activeGoal.name}...`,
        type: 'pending',
      },
    });

    setStep('loading');
    setErrorMessage('');

    try {
      const { approveHash, depositHash } = await client.depositWithApproval({
        token: tokenAddress,
        vault: vault.address,
        amount: amountAtomic,
        recipient: address,
      });

      dispatch({
        type: 'UPDATE_NOTIFICATION',
        payload: {
          id: noticeId,
          patch: {
            title: 'Deposit submitted',
            message: approveHash
              ? `Approve + deposit sent on ${network}. Tx ${shortHash(depositHash)}`
              : `Deposit sent on ${network}. Tx ${shortHash(depositHash)}`,
            type: 'pending',
          },
        },
      });

      const receipt = await client.waitForTransaction(depositHash);
      if (receipt.status !== 'success') {
        throw new Error('Deposit transaction reverted onchain.');
      }

      setStep('success');
      dispatch({
        type: 'UPDATE_NOTIFICATION',
        payload: {
          id: noticeId,
          patch: {
            title: 'Deposit success',
            message: `$${amountNum.toFixed(2)} deposited to ${activeGoal.name} on ${network}.`,
            type: 'success',
          },
        },
      });

      window.setTimeout(() => {
        dispatch({
          type: 'DEPOSIT',
          payload: {
            goalId: activeGoal.id,
            vaultId: selectedVault,
            amount: amountNum,
            txHash: depositHash,
            network,
          },
        });
        setStep('input');
        setAmount('');
        setErrorMessage('');
      }, 1300);
    } catch (error) {
      const message = formatErrorMessage(error);
      setStep('failed');
      setErrorMessage(message);
      dispatch({
        type: 'UPDATE_NOTIFICATION',
        payload: {
          id: noticeId,
          patch: {
            title: 'Deposit failed',
            message,
            type: 'failed',
          },
        },
      });
    }
  };

  const handleClose = () => {
    setStep('input');
    setAmount('');
    setErrorMessage('');
    dispatch({ type: 'CLOSE_DEPOSIT' });
  };

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
          className={`relative w-full max-w-md rounded-3xl border p-6 ${
            dark ? 'bg-navy-950 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
          }`}
        >
          <button
            onClick={handleClose}
            className={`absolute top-4 right-4 p-1 rounded-lg ${
              dark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>

          {step === 'success' ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8"
            >
              <CheckCircle2 className={`w-16 h-16 mx-auto mb-4 ${dark ? 'text-neon-green' : 'text-mint-500'}`} />
              <h3 className="text-xl font-bold mb-2">Deposit Confirmed</h3>
              <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                ${amountNum.toFixed(2)} has been deposited into {activeGoal?.name}
              </p>
            </motion.div>
          ) : step === 'failed' ? (
            <div className="text-center py-10">
              <AlertTriangle className={`w-14 h-14 mx-auto mb-3 ${dark ? 'text-red-400' : 'text-red-500'}`} />
              <h3 className="text-lg font-bold mb-2">Deposit Failed</h3>
              <p className={`text-sm mb-4 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{errorMessage}</p>
              <button
                onClick={() => setStep('input')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                  dark ? 'bg-white/10 hover:bg-white/15 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                Try Again
              </button>
            </div>
          ) : step === 'loading' ? (
            <div className="text-center py-12">
              <Loader2 className={`w-12 h-12 mx-auto mb-4 animate-spin ${dark ? 'text-neon-cyan' : 'text-mint-500'}`} />
              <h3 className="text-lg font-bold mb-2">Saving in Progress...</h3>
              <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                Transaction is being processed on the blockchain.
              </p>
              <p className={`text-xs mt-2 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                Please wait, this usually takes a few seconds.
              </p>
              <div className={`mt-4 w-full h-1.5 rounded-full overflow-hidden ${dark ? 'bg-white/10' : 'bg-gray-200'}`}>
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2.5 }}
                  className={`h-full rounded-full ${
                    dark
                      ? 'bg-gradient-to-r from-neon-cyan to-neon-green'
                      : 'bg-gradient-to-r from-mint-500 to-trust-500'
                  }`}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dark ? 'bg-neon-cyan/20' : 'bg-mint-100'}`}>
                  <ArrowDownCircle className={`w-5 h-5 ${dark ? 'text-neon-cyan' : 'text-mint-600'}`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Deposit</h3>
                  <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {VAULT_UI_CONFIG[selectedVault].short} ({tokenSymbol}) - {VAULT_UI_CONFIG[selectedVault].blurb}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm font-semibold mb-2 block">Select Pocket</label>
                <select
                  value={selectedGoal || goalId || ''}
                  onChange={(e) => setSelectedGoal(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 ${
                    dark
                      ? 'bg-white/5 border border-white/10 text-white focus:ring-neon-cyan'
                      : 'bg-gray-50 border border-gray-200 text-gray-900 focus:ring-mint-500'
                  }`}
                >
                  {state.goals.map((g) => (
                    <option key={g.id} value={g.id} className={dark ? 'bg-navy-950' : ''}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="text-sm font-semibold mb-2 block">Amount ({tokenSymbol})</label>
                <div className="relative">
                  <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold ${dark ? 'text-gray-500' : 'text-gray-400'}`}>$</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={`w-full pl-8 pr-4 py-3 rounded-xl text-lg font-bold focus:outline-none focus:ring-2 ${
                      dark
                        ? 'bg-white/5 border border-white/10 text-white focus:ring-neon-cyan placeholder-gray-600'
                        : 'bg-gray-50 border border-gray-200 text-gray-900 focus:ring-mint-500 placeholder-gray-300'
                    }`}
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  {[50, 100, 250, 500].map((v) => (
                    <button
                      key={v}
                      onClick={() => setAmount(v.toString())}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold ${
                        dark ? 'bg-white/5 hover:bg-white/10 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                      }`}
                    >
                      ${v}
                    </button>
                  ))}
                </div>
              </div>

              {amountNum > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={`rounded-xl p-4 mb-4 space-y-2 ${
                    dark ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-1 mb-2">
                    <Info className={`w-4 h-4 ${dark ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-xs font-semibold ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Fee Breakdown
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={dark ? 'text-gray-400' : 'text-gray-500'}>Deposit Amount</span>
                    <span className="font-semibold">${amountNum.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={dark ? 'text-gray-400' : 'text-gray-500'}>Network Fee</span>
                    <span className="font-semibold">~${gasFee.toFixed(2)}</span>
                  </div>
                  <div className={`border-t pt-2 flex justify-between text-sm font-bold ${dark ? 'border-white/10' : 'border-gray-200'}`}>
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </motion.div>
              )}

              <button
                onClick={handleConfirm}
                disabled={amountNum <= 0}
                className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
                  amountNum > 0
                    ? dark
                      ? 'bg-gradient-to-r from-neon-cyan to-neon-green text-navy-950 hover:shadow-lg'
                      : 'bg-gradient-to-r from-mint-500 to-trust-600 text-white hover:shadow-lg'
                    : dark
                    ? 'bg-white/10 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ArrowDownCircle className="w-5 h-5" />
                Confirm Deposit
              </button>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
