import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import CreateGoal from './components/CreateGoal';
import TransactionHistory from './components/TransactionHistory';
import RiskTransparency from './components/RiskTransparency';
import DepositModal from './components/DepositModal';
import RedeemModal from './components/RedeemModal';
import NotificationCenter from './components/NotificationCenter';
import { useEffect } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { useAccount } from 'wagmi';
import { createYoClient, VAULTS, type SupportedChainId } from '@yo-protocol/core';
import { createPublicClient, http, type Address } from 'viem';
import { arbitrum, base, mainnet } from 'viem/chains';
import { CHAIN_ID_BY_NAME } from './utils/vaults';

const readonlyClients = {
  1: createPublicClient({ chain: mainnet, transport: http() }),
  8453: createPublicClient({ chain: base, transport: http() }),
  42161: createPublicClient({ chain: arbitrum, transport: http() }),
} as Record<SupportedChainId, any>;

const pageTransition = {
  initial: { opacity: 0, y: 16, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -12, filter: 'blur(6px)' },
};

function WalletStateSync() {
  const { dispatch } = useApp();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    dispatch({
      type: 'SET_WALLET_STATE',
      payload: {
        connected: isConnected,
        walletAddress: address ?? '',
      },
    });
  }, [address, dispatch, isConnected]);

  return null;
}

function PendingRedeemSync() {
  const { state, dispatch } = useApp();
  const { connected, walletAddress, transactions } = state;

  useEffect(() => {
    if (!connected || !walletAddress) return;

    const pendingRedeems = transactions.filter((tx) => tx.type === 'withdraw' && tx.status === 'pending');
    if (pendingRedeems.length === 0) return;

    let active = true;

    const toBigInt = (value: string | number | undefined) => {
      if (value === undefined || value === null) return 0n;
      try {
        return BigInt(typeof value === 'number' ? Math.floor(value) : value);
      } catch {
        return 0n;
      }
    };

    const poll = async () => {
      for (const tx of pendingRedeems) {
        const chainId = CHAIN_ID_BY_NAME[tx.network];
        const client = createYoClient({
          chainId,
          partnerId: 9999,
          publicClients: {
            [chainId]: readonlyClients[chainId],
          },
        });

        try {
          const pending = await client.getPendingRedemptions(VAULTS[tx.vaultId].address, walletAddress as Address);
          const pendingAssets = toBigInt(pending.assets?.raw);
          const pendingShares = toBigInt(pending.shares?.raw);
          const stillQueued = pendingAssets > 0n || pendingShares > 0n;

          if (!stillQueued && active) {
            dispatch({
              type: 'UPDATE_TRANSACTION_STATUS',
              payload: { id: tx.id, status: 'success' },
            });
            dispatch({
              type: 'ADD_NOTIFICATION',
              payload: {
                id: `redeem-settled-${tx.id}-${Date.now()}`,
                title: 'Queued redeem settled',
                message: `${tx.goalName} withdrawal has been finalized on ${tx.network}.`,
                type: 'success',
              },
            });
          }
        } catch {
          // Ignore polling errors; next interval will retry.
        }
      }
    };

    void poll();
    const timer = window.setInterval(() => {
      void poll();
    }, 25000);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [connected, dispatch, transactions, walletAddress]);

  return null;
}

function AppContent() {
  const { state } = useApp();
  const { page, darkMode } = state;
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 20,
    mass: 0.2,
  });

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-navy-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <WalletStateSync />
      <PendingRedeemSync />

      <div className={`scroll-progress-track ${darkMode ? 'bg-white/10' : 'bg-gold-100/50'}`}>
        <motion.div className="scroll-progress-bar" style={{ scaleX: smoothProgress }} />
      </div>

      <Header />
      <main className="relative">
        <AnimatePresence mode="wait" initial={false}>
          {page === 'landing' && (
            <motion.section
              key="landing"
              variants={pageTransition}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.32, ease: 'easeOut' }}
            >
              <LandingPage />
            </motion.section>
          )}
          {page === 'dashboard' && (
            <motion.section
              key="dashboard"
              variants={pageTransition}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <Dashboard />
            </motion.section>
          )}
          {page === 'create-goal' && (
            <motion.section
              key="create-goal"
              variants={pageTransition}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <CreateGoal />
            </motion.section>
          )}
          {page === 'history' && (
            <motion.section
              key="history"
              variants={pageTransition}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <TransactionHistory />
            </motion.section>
          )}
          {page === 'risk' && (
            <motion.section
              key="risk"
              variants={pageTransition}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <RiskTransparency />
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Modals */}
      <DepositModal />
      <RedeemModal />
      <NotificationCenter />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
