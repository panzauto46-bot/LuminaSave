import { useEffect, useMemo, useRef } from 'react';
import { useSwitchChain } from 'wagmi';
import { useApp } from '../context/AppContext';
import { useWalletActions } from '../hooks/useWalletActions';
import { useYoRuntime } from '../hooks/useYoRuntime';
import type { SupportedVault } from '../types';
import { CHAIN_LABEL_BY_ID, VAULT_UI_CONFIG, type VaultUiConfig } from '../utils/vaults';
import { History, Home, Loader2, LogOut, Moon, ShieldCheck, Sparkles, Sun, WalletCards } from 'lucide-react';

export default function Header() {
  const { state, dispatch } = useApp();
  const { darkMode, connected, walletAddress, page, selectedVault } = state;
  const { disconnectWallet, isDisconnecting } = useWalletActions();
  const { switchChainAsync, isPending: isSwitchingChain } = useSwitchChain();
  const { preferredChainId, isSelectedVaultSupportedOnChain, supportedVaultChains } = useYoRuntime(selectedVault);
  const attemptedSwitchRef = useRef<string | null>(null);

  const formattedAddress = useMemo(
    () => (walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : ''),
    [walletAddress],
  );
  const vaultOptions = Object.values(VAULT_UI_CONFIG) as VaultUiConfig[];
  const selectedVaultMeta = VAULT_UI_CONFIG[selectedVault];

  useEffect(() => {
    if (!connected || isSelectedVaultSupportedOnChain) {
      attemptedSwitchRef.current = null;
      return;
    }

    const key = `${selectedVault}:${preferredChainId}`;
    if (attemptedSwitchRef.current === key) return;
    attemptedSwitchRef.current = key;

    void switchChainAsync({ chainId: preferredChainId }).catch((error) => {
      const message = error instanceof Error ? error.message : 'Unable to switch network automatically.';
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: `switch-${Date.now()}`,
          title: 'Network switch required',
          message,
          type: 'pending',
        },
      });
    });
  }, [
    connected,
    dispatch,
    isSelectedVaultSupportedOnChain,
    preferredChainId,
    selectedVault,
    switchChainAsync,
  ]);

  const onVaultChange = (vaultId: SupportedVault) => {
    dispatch({ type: 'SET_SELECTED_VAULT', payload: vaultId });
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b ${
        darkMode ? 'bg-navy-950/90 border-white/10 text-white' : 'bg-white/90 border-gray-200 text-gray-900'
      } glass-card`}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => dispatch({ type: 'SET_PAGE', payload: connected ? 'dashboard' : 'landing' })}
          className="click-pulse flex items-center gap-2 group"
        >
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              darkMode ? 'bg-gradient-to-br from-gold-300 to-gold-500' : 'bg-gradient-to-br from-gold-400 to-gold-600'
            }`}
          >
            <Sparkles className={`w-5 h-5 ${darkMode ? 'text-navy-950' : 'text-white'}`} />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Lumina<span className={darkMode ? 'text-gold-300' : 'text-gold-600'}>Save</span>
          </span>
        </button>

        <div className="flex items-center gap-2 min-w-0">
          {connected && (
            <div className="hidden lg:flex items-center gap-2 mr-2">
              <div
                className={`relative rounded-xl border px-2 py-1.5 ${
                  darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <label className="sr-only">Select YO Vault</label>
                <select
                  value={selectedVault}
                  onChange={(event) => onVaultChange(event.target.value as SupportedVault)}
                  className={`pr-8 pl-9 py-1 text-xs font-semibold rounded-lg appearance-none focus:outline-none ${
                    darkMode ? 'bg-transparent text-gold-200' : 'bg-transparent text-gold-700'
                  }`}
                >
                  {vaultOptions.map((vault) => (
                    <option key={vault.id} value={vault.id} className={darkMode ? 'bg-navy-950 text-white' : ''}>
                      {vault.short} ({vault.underlying})
                    </option>
                  ))}
                </select>
                <WalletCards
                  className={`w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 ${
                    darkMode ? 'text-gold-300' : 'text-gold-700'
                  }`}
                />
                <span
                  className={`absolute right-2 top-1/2 -translate-y-1/2 text-[10px] ${
                    darkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}
                >
                  ▼
                </span>
              </div>
              <div
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                  isSelectedVaultSupportedOnChain
                    ? darkMode
                      ? 'bg-green-500/15 text-green-300'
                      : 'bg-green-100 text-green-700'
                    : darkMode
                    ? 'bg-orange-500/20 text-orange-300'
                    : 'bg-orange-100 text-orange-700'
                }`}
                title={`Supported chains: ${supportedVaultChains
                  .map((chainId) => CHAIN_LABEL_BY_ID[chainId])
                  .join(', ')}`}
              >
                {isSelectedVaultSupportedOnChain
                  ? `${selectedVaultMeta.underlying} ready`
                  : `Switching to ${CHAIN_LABEL_BY_ID[preferredChainId]}...`}
              </div>
            </div>
          )}

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
              <button
                onClick={() => dispatch({ type: 'SET_PAGE', payload: 'risk' })}
                className={`click-pulse px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  page === 'risk'
                    ? darkMode
                      ? 'bg-gold-500/15 text-gold-300'
                      : 'bg-mint-100 text-mint-700'
                    : darkMode
                    ? 'text-gray-400 hover:text-gold-200'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4 inline mr-1" />
                Risk
              </button>
            </div>
          )}

          <button
            onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
            className={`click-pulse p-2 rounded-xl transition-all ${
              darkMode ? 'bg-gold-500/15 hover:bg-gold-500/25 text-gold-300' : 'bg-gold-50 hover:bg-gold-100 text-gold-700'
            }`}
            title={darkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

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

          {connected && isSwitchingChain && (
            <div
              className={`hidden md:flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${
                darkMode ? 'bg-white/10 text-gold-200' : 'bg-gold-50 text-gold-700'
              }`}
            >
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Switching
            </div>
          )}
        </div>
      </div>

      {connected && (
        <div className={`sm:hidden border-t ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
          <div className="px-4 pt-2 pb-1 flex items-center gap-2">
            <div
              className={`relative flex-1 rounded-xl border px-2 py-1.5 ${
                darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <select
                value={selectedVault}
                onChange={(event) => onVaultChange(event.target.value as SupportedVault)}
                className={`w-full pr-6 pl-7 py-1 text-xs font-semibold rounded-lg appearance-none focus:outline-none ${
                  darkMode ? 'bg-transparent text-gold-200' : 'bg-transparent text-gold-700'
                }`}
              >
                {vaultOptions.map((vault) => (
                  <option key={vault.id} value={vault.id} className={darkMode ? 'bg-navy-950 text-white' : ''}>
                    {vault.short} ({vault.underlying})
                  </option>
                ))}
              </select>
              <WalletCards
                className={`w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 ${
                  darkMode ? 'text-gold-300' : 'text-gold-700'
                }`}
              />
              <span
                className={`absolute right-2 top-1/2 -translate-y-1/2 text-[10px] ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`}
              >
                ▼
              </span>
            </div>
            {!isSelectedVaultSupportedOnChain && (
              <span
                className={`text-[10px] px-2 py-1 rounded-lg whitespace-nowrap ${
                  darkMode ? 'bg-orange-500/20 text-orange-300' : 'bg-orange-100 text-orange-700'
                }`}
              >
                {isSwitchingChain ? 'Switching...' : `Need ${CHAIN_LABEL_BY_ID[preferredChainId]}`}
              </span>
            )}
          </div>

          <div className="flex">
            <button
              onClick={() => dispatch({ type: 'SET_PAGE', payload: 'dashboard' })}
              className={`click-pulse flex-1 py-2 text-xs font-medium text-center ${
                page === 'dashboard'
                  ? darkMode
                    ? 'text-gold-300 bg-gold-500/10'
                    : 'text-mint-600 bg-mint-50'
                  : darkMode
                  ? 'text-gray-400'
                  : 'text-gray-500'
              }`}
            >
              <Home className="w-4 h-4 mx-auto mb-0.5" /> Dashboard
            </button>
            <button
              onClick={() => dispatch({ type: 'SET_PAGE', payload: 'history' })}
              className={`click-pulse flex-1 py-2 text-xs font-medium text-center ${
                page === 'history'
                  ? darkMode
                    ? 'text-gold-300 bg-gold-500/10'
                    : 'text-mint-600 bg-mint-50'
                  : darkMode
                  ? 'text-gray-400'
                  : 'text-gray-500'
              }`}
            >
              <History className="w-4 h-4 mx-auto mb-0.5" /> History
            </button>
            <button
              onClick={() => dispatch({ type: 'SET_PAGE', payload: 'risk' })}
              className={`click-pulse flex-1 py-2 text-xs font-medium text-center ${
                page === 'risk'
                  ? darkMode
                    ? 'text-gold-300 bg-gold-500/10'
                    : 'text-mint-600 bg-mint-50'
                  : darkMode
                  ? 'text-gray-400'
                  : 'text-gray-500'
              }`}
            >
              <ShieldCheck className="w-4 h-4 mx-auto mb-0.5" /> Risk
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
