import type { MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { VAULTS } from '@yo-protocol/core';
import { AlertTriangle, BarChart3, ExternalLink, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CHAIN_LABEL_BY_ID, VAULT_UI_CONFIG, getAddressExplorerUrl } from '../utils/vaults';

export default function RiskTransparency() {
  const { state } = useApp();
  const dark = state.darkMode;
  const selectedVault = state.selectedVault;
  const selectedVaultMeta = VAULT_UI_CONFIG[selectedVault];

  const trackPointer = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty('--mx', `${x}%`);
    e.currentTarget.style.setProperty('--my', `${y}%`);
  };

  const onchainContractLinks = selectedVaultMeta.supportedChains.map((chainId) => ({
    label: `${CHAIN_LABEL_BY_ID[chainId]} vault contract`,
    href: getAddressExplorerUrl(chainId, VAULTS[selectedVault].address),
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start gap-3 mb-2">
          <ShieldCheck className={`w-7 h-7 ${dark ? 'text-gold-300' : 'text-gold-600'}`} />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Risk & Transparency</h1>
            <p className={`mt-1 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
              Active vault: <span className={dark ? 'text-gold-300' : 'text-gold-700'}>{selectedVaultMeta.label}</span>
            </p>
          </div>
        </div>
      </motion.div>

      <div className="flow-divider" />

      <section className="grid md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          onMouseMove={trackPointer}
          className={`interactive-card interactive-card--gold rounded-2xl border p-5 ${
            dark ? 'bg-navy-900 border-white/10' : 'bg-white border-gray-200'
          }`}
        >
          <ShieldCheck className={`w-6 h-6 mb-3 ${dark ? 'text-neon-cyan' : 'text-trust-600'}`} />
          <p className={`text-xs uppercase tracking-wide mb-1 ${dark ? 'text-gray-500' : 'text-gray-500'}`}>Strategy</p>
          <p className="text-xl font-extrabold">{selectedVaultMeta.short}</p>
          <p className={`text-sm mt-2 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{selectedVaultMeta.risk.strategy}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          onMouseMove={trackPointer}
          className={`interactive-card interactive-card--gold rounded-2xl border p-5 ${
            dark ? 'bg-navy-900 border-white/10' : 'bg-white border-gray-200'
          }`}
        >
          <AlertTriangle className={`w-6 h-6 mb-3 ${dark ? 'text-orange-400' : 'text-orange-500'}`} />
          <p className={`text-xs uppercase tracking-wide mb-1 ${dark ? 'text-gray-500' : 'text-gray-500'}`}>Worst Drawdown</p>
          <p className="text-xl font-extrabold">{selectedVaultMeta.risk.worstDrawdown.split(' ')[0]}</p>
          <p className={`text-sm mt-2 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{selectedVaultMeta.risk.worstDrawdown}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.19 }}
          onMouseMove={trackPointer}
          className={`interactive-card interactive-card--gold rounded-2xl border p-5 ${
            dark ? 'bg-navy-900 border-white/10' : 'bg-white border-gray-200'
          }`}
        >
          <BarChart3 className={`w-6 h-6 mb-3 ${dark ? 'text-gold-300' : 'text-gold-600'}`} />
          <p className={`text-xs uppercase tracking-wide mb-1 ${dark ? 'text-gray-500' : 'text-gray-500'}`}>Supported Chains</p>
          <p className="text-xl font-extrabold">{selectedVaultMeta.supportedChains.length}</p>
          <p className={`text-sm mt-2 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
            {selectedVaultMeta.supportedChains.map((chainId) => CHAIN_LABEL_BY_ID[chainId]).join(', ')}
          </p>
        </motion.div>
      </section>

      <section className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
          onMouseMove={trackPointer}
          className={`interactive-card interactive-card--gold rounded-2xl border p-5 ${
            dark ? 'bg-navy-900 border-white/10' : 'bg-white border-gray-200'
          }`}
        >
          <h2 className="text-lg font-bold mb-2">Vault Strategy Notes</h2>
          <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
            {selectedVaultMeta.blurb}
          </p>
          <div className={`mt-4 rounded-xl border p-3 ${dark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
            <p className={`text-xs uppercase tracking-wide mb-1 ${dark ? 'text-gray-500' : 'text-gray-500'}`}>Target user</p>
            <p className="text-sm font-medium">{selectedVaultMeta.risk.targetUsers}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onMouseMove={trackPointer}
          className={`interactive-card interactive-card--gold rounded-2xl border p-5 ${
            dark ? 'bg-navy-900 border-white/10' : 'bg-white border-gray-200'
          }`}
        >
          <h2 className="text-lg font-bold mb-4">Fee Breakdown</h2>
          <div className="space-y-2">
            {selectedVaultMeta.risk.feeBreakdown.map((row) => (
              <div
                key={row.label}
                className={`rounded-xl border px-3 py-2.5 ${dark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-sm">{row.label}</p>
                  <p className={`text-sm font-bold ${dark ? 'text-gold-300' : 'text-gold-700'}`}>{row.value}</p>
                </div>
                <p className={`text-xs mt-1 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{row.note}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section
        className={`rounded-2xl border p-5 ${
          dark ? 'bg-navy-900 border-white/10' : 'bg-white border-gray-200'
        }`}
      >
        <h2 className="text-lg font-bold mb-4">Audit & Proof Links</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {[...onchainContractLinks, ...selectedVaultMeta.risk.auditLinks].map((item) => (
            <a
              key={`${item.label}-${item.href}`}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded-xl border p-3 transition-all ${
                dark
                  ? 'border-white/10 bg-white/5 hover:border-gold-300/35'
                  : 'border-gray-200 bg-gray-50 hover:border-gold-300'
              }`}
            >
              <p className="font-semibold text-sm">{item.label}</p>
              <p
                className={`mt-3 inline-flex items-center gap-1 text-xs font-semibold ${
                  dark ? 'text-gold-300' : 'text-gold-700'
                }`}
              >
                Open link
                <ExternalLink className="w-3.5 h-3.5" />
              </p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
