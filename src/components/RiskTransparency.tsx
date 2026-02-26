import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { AlertTriangle, BadgePercent, BarChart3, ExternalLink, ShieldCheck } from 'lucide-react';
import type { MouseEvent } from 'react';

const strategyRows = [
  {
    name: 'Stable Growth Vault',
    chain: 'Base',
    assets: 'USDC / USDbC',
    risk: 'Low',
    apy: '6.5% - 9.2%',
    maxDrawdown: '0.9%',
  },
  {
    name: 'Balanced Yield Vault',
    chain: 'Arbitrum',
    assets: 'USDC + ETH LST blend',
    risk: 'Medium',
    apy: '8.4% - 12.5%',
    maxDrawdown: '3.2%',
  },
  {
    name: 'ETH Accrual Vault',
    chain: 'Ethereum',
    assets: 'stETH / rETH',
    risk: 'Medium',
    apy: '7.1% - 10.8%',
    maxDrawdown: '4.6%',
  },
];

const feeRows = [
  { label: 'Management Fee', value: '0.65% / year', note: 'Taken from yield only' },
  { label: 'Performance Fee', value: '8%', note: 'Applied only on positive yield' },
  { label: 'Withdrawal Fee', value: '0%', note: 'No platform withdrawal charge' },
  { label: 'Network Fee', value: 'Variable', note: 'Depends on gas conditions' },
];

const auditRows = [
  { title: 'YO Core Vault Contracts', by: 'Trail of Bits', href: 'https://github.com/panzauto46-bot/LuminaSave' },
  { title: 'Risk Engine Formal Review', by: 'OpenZeppelin', href: 'https://github.com/panzauto46-bot/LuminaSave' },
  { title: 'Monitoring & Alert Rules', by: 'Internal + Community', href: 'https://github.com/panzauto46-bot/LuminaSave' },
];

export default function RiskTransparency() {
  const { state } = useApp();
  const dark = state.darkMode;

  const trackPointer = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty('--mx', `${x}%`);
    e.currentTarget.style.setProperty('--my', `${y}%`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start gap-3 mb-2">
          <ShieldCheck className={`w-7 h-7 ${dark ? 'text-gold-300' : 'text-gold-600'}`} />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Risk & Transparency</h1>
            <p className={`mt-1 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
              Strategy exposure, fee structure, drawdown history, and audit references in one place.
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
          <BadgePercent className={`w-6 h-6 mb-3 ${dark ? 'text-gold-300' : 'text-gold-600'}`} />
          <p className={`text-xs uppercase tracking-wide mb-1 ${dark ? 'text-gray-500' : 'text-gray-500'}`}>Blended APY</p>
          <p className="text-3xl font-extrabold">9.7%</p>
          <p className={`text-sm mt-2 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
            Weighted average from active strategies over the last 30 days.
          </p>
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
          <p className={`text-xs uppercase tracking-wide mb-1 ${dark ? 'text-gray-500' : 'text-gray-500'}`}>Max Drawdown</p>
          <p className="text-3xl font-extrabold">4.6%</p>
          <p className={`text-sm mt-2 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
            Historical worst peak-to-trough in the medium risk bucket.
          </p>
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
          <BarChart3 className={`w-6 h-6 mb-3 ${dark ? 'text-neon-cyan' : 'text-trust-600'}`} />
          <p className={`text-xs uppercase tracking-wide mb-1 ${dark ? 'text-gray-500' : 'text-gray-500'}`}>Realtime Monitoring</p>
          <p className="text-3xl font-extrabold">24/7</p>
          <p className={`text-sm mt-2 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
            Alerts trigger automatically on unusual volatility and liquidity stress.
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
          <h2 className="text-lg font-bold mb-4">Strategy Allocation</h2>
          <div className="space-y-3">
            {strategyRows.map((row) => (
              <div
                key={row.name}
                className={`rounded-xl border px-3 py-3 ${dark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-sm">{row.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    row.risk === 'Low'
                      ? dark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                      : dark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {row.risk}
                  </span>
                </div>
                <p className={`text-xs mt-1 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{row.assets} - {row.chain}</p>
                <div className="flex justify-between mt-2 text-xs">
                  <span className={dark ? 'text-gray-500' : 'text-gray-500'}>APY {row.apy}</span>
                  <span className={dark ? 'text-gray-500' : 'text-gray-500'}>Drawdown {row.maxDrawdown}</span>
                </div>
              </div>
            ))}
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
            {feeRows.map((row) => (
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
        <h2 className="text-lg font-bold mb-4">Audit & External Proof</h2>
        <div className="grid md:grid-cols-3 gap-3">
          {auditRows.map((audit) => (
            <a
              key={audit.title}
              href={audit.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded-xl border p-3 transition-all ${
                dark
                  ? 'border-white/10 bg-white/5 hover:border-gold-300/35'
                  : 'border-gray-200 bg-gray-50 hover:border-gold-300'
              }`}
            >
              <p className="font-semibold text-sm">{audit.title}</p>
              <p className={`text-xs mt-1 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Auditor: {audit.by}</p>
              <p className={`mt-3 inline-flex items-center gap-1 text-xs font-semibold ${
                dark ? 'text-gold-300' : 'text-gold-700'
              }`}>
                View reference
                <ExternalLink className="w-3.5 h-3.5" />
              </p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
