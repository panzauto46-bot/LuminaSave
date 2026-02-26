import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import CreateGoal from './components/CreateGoal';
import TransactionHistory from './components/TransactionHistory';
import DepositModal from './components/DepositModal';
import RedeemModal from './components/RedeemModal';
import { AnimatePresence, motion } from 'framer-motion';

const pageTransition = {
  initial: { opacity: 0, y: 16, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -12, filter: 'blur(6px)' },
};

function AppContent() {
  const { state } = useApp();
  const { page, darkMode } = state;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-navy-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
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
        </AnimatePresence>
      </main>

      {/* Modals */}
      <DepositModal />
      <RedeemModal />
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
