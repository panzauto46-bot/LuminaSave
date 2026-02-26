import { useApp } from '../context/AppContext';
import { Sun, Moon, LogOut, History, Home, Sparkles } from 'lucide-react';
import { useWalletActions } from '../hooks/useWalletActions';

export default function Header() {
  const { state, dispatch } = useApp();
  const { darkMode, connected, walletAddress, page } = state;
  const { disconnectWallet, isDisconnecting } = useWalletActions();
  const formattedAddress = walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : '';

  return (
    <header
      className={`sticky top-0 z-50 border-b ${
        darkMode
          ? 'bg-navy-950/90 border-white/10 text-white'
          : 'bg-white/90 border-gray-200 text-gray-900'
      } glass-card`}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => dispatch({ type: 'SET_PAGE', payload: connected ? 'dashboard' : 'landing' })}
          className="click-pulse flex items-center gap-2 group"
        >
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            darkMode
              ? 'bg-gradient-to-br from-gold-300 to-gold-500'
              : 'bg-gradient-to-br from-gold-400 to-gold-600'
          }`}>
            <Sparkles className={`w-5 h-5 ${darkMode ? 'text-navy-950' : 'text-white'}`} />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Lumina<span className={darkMode ? 'text-gold-300' : 'text-gold-600'}>Save</span>
          </span>
        </button>

        <div className="flex items-center gap-2">
          {/* Nav buttons when connected */}
          {connected && (
            <div className="hidden sm:flex items-center gap-1 mr-2">
              <button
                onClick={() => dispatch({ type: 'SET_PAGE', payload: 'dashboard' })}
                className={`click-pulse px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  page === 'dashboard'
                    ? darkMode
                      ? 'bg-gold-500/15 text-gold-300'
                      : 'bg-mint-100 text-mint-700'
                    : darkMode
                    ? 'text-gray-400 hover:text-gold-200'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Home className="w-4 h-4 inline mr-1" />
                Dashboard
              </button>
              <button
                onClick={() => dispatch({ type: 'SET_PAGE', payload: 'history' })}
                className={`click-pulse px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  page === 'history'
                    ? darkMode
                      ? 'bg-gold-500/15 text-gold-300'
                      : 'bg-mint-100 text-mint-700'
                    : darkMode
                    ? 'text-gray-400 hover:text-gold-200'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <History className="w-4 h-4 inline mr-1" />
                History
              </button>
            </div>
          )}

          {/* Dark mode toggle */}
          <button
            onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
            className={`click-pulse p-2 rounded-xl transition-all ${
              darkMode
                ? 'bg-gold-500/15 hover:bg-gold-500/25 text-gold-300'
                : 'bg-gold-50 hover:bg-gold-100 text-gold-700'
            }`}
            title={darkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Wallet / Disconnect */}
          {connected && (
            <>
              <div
                className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-mono ${
                  darkMode ? 'bg-white/10 text-neon-green' : 'bg-mint-50 text-mint-700 border border-mint-200'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                {formattedAddress}
              </div>
              <button
                onClick={() => {
                  void disconnectWallet();
                }}
                disabled={isDisconnecting}
                className={`click-pulse p-2 rounded-xl transition-all ${
                  darkMode
                    ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                    : 'bg-red-50 hover:bg-red-100 text-red-500'
                } ${isDisconnecting ? 'opacity-60 cursor-not-allowed' : ''}`}
                title="Disconnect Wallet"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      {connected && (
        <div className={`sm:hidden flex border-t ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
          <button
            onClick={() => dispatch({ type: 'SET_PAGE', payload: 'dashboard' })}
            className={`click-pulse flex-1 py-2 text-xs font-medium text-center ${
              page === 'dashboard'
                ? darkMode ? 'text-gold-300 bg-gold-500/10' : 'text-mint-600 bg-mint-50'
                : darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            <Home className="w-4 h-4 mx-auto mb-0.5" /> Dashboard
          </button>
          <button
            onClick={() => dispatch({ type: 'SET_PAGE', payload: 'history' })}
            className={`click-pulse flex-1 py-2 text-xs font-medium text-center ${
              page === 'history'
                ? darkMode ? 'text-gold-300 bg-gold-500/10' : 'text-mint-600 bg-mint-50'
                : darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            <History className="w-4 h-4 mx-auto mb-0.5" /> History
          </button>
        </div>
      )}
    </header>
  );
}
