import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import CreateGoal from './components/CreateGoal';
import TransactionHistory from './components/TransactionHistory';
import DepositModal from './components/DepositModal';
import RedeemModal from './components/RedeemModal';

function AppContent() {
  const { state } = useApp();
  const { page, darkMode } = state;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-navy-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Header />
      <main>
        {page === 'landing' && <LandingPage />}
        {page === 'dashboard' && <Dashboard />}
        {page === 'create-goal' && <CreateGoal />}
        {page === 'history' && <TransactionHistory />}
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
