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
import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import { useAccount } from 'wagmi';

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

function AppContent() {
  const { state } = useApp();
  const { page, darkMode } = state;
  const { scrollY, scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 20,
    mass: 0.2,
  });
  const [showBackTop, setShowBackTop] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setShowBackTop(latest > 420);
  });

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-navy-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <WalletStateSync />

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

      <AnimatePresence>
        {showBackTop && (
          <motion.button
            initial={{ opacity: 0, y: 18, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`click-pulse btn-sheen fixed bottom-5 right-5 z-50 w-11 h-11 rounded-full border flex items-center justify-center ${
              darkMode
                ? 'bg-gradient-to-br from-gold-300 to-gold-500 text-navy-950 border-gold-200/80 shadow-lg shadow-gold-500/25'
                : 'bg-white text-gold-600 border-gold-300 shadow-lg shadow-gold-500/20'
            }`}
            title="Back to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
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
