import { useApp } from '../context/AppContext';
import { Shield, TrendingUp, Wallet, ChevronRight, Lock, Zap, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import type { MouseEvent } from 'react';

export default function LandingPage() {
  const { state, dispatch } = useApp();
  const dark = state.darkMode;
  const trackPointer = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty('--mx', `${x}%`);
    e.currentTarget.style.setProperty('--my', `${y}%`);
  };

  return (
    <div className={`relative min-h-screen overflow-hidden ${dark ? 'bg-navy-950 text-white' : 'bg-slate-50 text-gray-900'}`}>
      <div className="web3-bg">
        <div className="web3-grid" />
        <div className="web3-flow" />
        <div className="web3-orb web3-orb--one" />
        <div className="web3-orb web3-orb--two" />
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-20 ${
            dark ? 'bg-neon-cyan' : 'bg-mint-400'
          }`} />
          <div className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-20 ${
            dark ? 'bg-neon-green' : 'bg-trust-400'
          }`} />
        </div>

        <div className="max-w-6xl mx-auto px-4 py-20 md:py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8 backdrop-blur-xl ${
              dark
                ? 'bg-neon-green/10 text-neon-green border border-neon-green/20'
                : 'bg-mint-50 text-mint-700 border border-mint-200'
            }`}
            >
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Powered by YO Protocol — Up to 12.5% APY
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 font-display">
              Crypto Savings,{' '}
              <span className={`bg-clip-text text-transparent ${
                dark
                  ? 'bg-gradient-to-r from-neon-cyan to-neon-green'
                  : 'bg-gradient-to-r from-mint-500 to-trust-600'
              }`}>
                As Easy as Banking.
              </span>
            </h1>

            <p className={`text-lg md:text-xl max-w-2xl mx-auto mb-10 ${
              dark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Set your savings goals, deposit your funds, and let DeFi work for you.
              Transparent, secure, and real yield — straight from the blockchain.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => dispatch({ type: 'CONNECT_WALLET' })}
                className={`group btn-sheen px-8 py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 transition-all transform hover:scale-105 ${
                  dark
                    ? 'bg-gradient-to-r from-neon-cyan to-neon-green text-navy-950 hover:shadow-lg hover:shadow-neon-cyan/30'
                    : 'bg-gradient-to-r from-mint-500 to-trust-600 text-white hover:shadow-lg hover:shadow-mint-500/30'
                }`}
              >
                <Wallet className="w-5 h-5" />
                Connect Wallet
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => dispatch({ type: 'CONNECT_WALLET' })}
                className={`btn-sheen px-8 py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 transition-all border-2 ${
                  dark
                    ? 'border-white/20 text-white hover:bg-white/10'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill={dark?'#fff':'#4285F4'} d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill={dark?'#ccc':'#34A853'} d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill={dark?'#aaa':'#FBBC05'} d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill={dark?'#888':'#EA4335'} d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Login with Google
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust signals */}
      <section className={`py-12 border-y ${
        dark ? 'bg-navy-900/45 border-white/5' : 'bg-white/80 border-gray-100 backdrop-blur-xl'
      }`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                dark ? 'bg-neon-cyan/10' : 'bg-trust-100'
              }`}>
                <Shield className={`w-6 h-6 ${dark ? 'text-neon-cyan' : 'text-trust-600'}`} />
              </div>
              <div>
                <p className="font-bold text-sm">Audited & Secured</p>
                <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Smart Contract Verified</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                dark ? 'bg-neon-green/10' : 'bg-mint-100'
              }`}>
                <TrendingUp className={`w-6 h-6 ${dark ? 'text-neon-green' : 'text-mint-600'}`} />
              </div>
              <div>
                <p className="font-bold text-sm">APY 8-12.5%</p>
                <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Via YO Protocol Vaults</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                dark ? 'bg-purple-500/10' : 'bg-purple-100'
              }`}>
                <Globe className={`w-6 h-6 ${dark ? 'text-purple-400' : 'text-purple-600'}`} />
              </div>
              <div>
                <p className="font-bold text-sm">Multi-Chain</p>
                <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Base, Arbitrum, Ethereum</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why LuminaSave?</h2>
            <p className={`text-lg ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
              Combining fintech banking simplicity with the power of DeFi
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Wallet className="w-7 h-7" />,
                title: 'Goal-Based Savings',
                desc: 'Create savings "pockets" just like a digital bank. Vacation, laptop, emergency fund — organize your goals your way.',
                gradient: dark ? 'from-neon-cyan/20 to-transparent' : 'from-trust-100 to-transparent',
                iconColor: dark ? 'text-neon-cyan' : 'text-trust-600',
              },
              {
                icon: <TrendingUp className="w-7 h-7" />,
                title: 'Automatic DeFi Yield',
                desc: 'Your money works 24/7 through YO Protocol Vaults. Earn yield without needing to understand complex DeFi.',
                gradient: dark ? 'from-neon-green/20 to-transparent' : 'from-mint-100 to-transparent',
                iconColor: dark ? 'text-neon-green' : 'text-mint-600',
              },
              {
                icon: <Lock className="w-7 h-7" />,
                title: '100% Transparent On-Chain',
                desc: 'Every transaction is recorded on the blockchain. Verify it yourself on the block explorer anytime.',
                gradient: dark ? 'from-purple-500/20 to-transparent' : 'from-purple-100 to-transparent',
                iconColor: dark ? 'text-purple-400' : 'text-purple-600',
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6, scale: 1.02 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                onMouseMove={trackPointer}
                className={`interactive-card p-6 rounded-2xl border transition-all ${
                  dark
                    ? 'bg-white/5 border-white/10 hover:border-white/20'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 ${f.iconColor}`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className={`text-sm leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className={`py-20 ${dark ? 'bg-navy-900/50' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className={`text-lg ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
              As easy as 1-2-3
            </p>
          </motion.div>

          <div className="space-y-8">
            {[
              { step: '1', title: 'Connect Your Wallet', desc: 'Connect MetaMask, WalletConnect, or login with Google. Just 1 click.' },
              { step: '2', title: 'Set a Goal & Deposit', desc: 'Name your savings target, set the amount you want to save, and start depositing USDC/ETH.' },
              { step: '3', title: 'Sit Back & Earn Yield', desc: 'YO Protocol Vault works for you. Monitor your yield in real-time, withdraw anytime.' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{ x: 4 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                onMouseMove={trackPointer}
                className={`interactive-card flex gap-4 items-start rounded-2xl px-3 py-3 ${
                  dark ? 'hover:bg-white/5' : 'hover:bg-white/70'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold shrink-0 ${
                  dark
                    ? 'bg-gradient-to-br from-neon-cyan to-neon-green text-navy-950'
                    : 'bg-gradient-to-br from-mint-500 to-trust-600 text-white'
                }`}>
                  {s.step}
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">{s.title}</h3>
                  <p className={`${dark ? 'text-gray-400' : 'text-gray-600'}`}>{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA bottom */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`p-10 rounded-3xl border ${
              dark
                ? 'bg-gradient-to-br from-neon-cyan/10 to-neon-green/10 border-white/10'
                : 'bg-gradient-to-br from-mint-50 to-trust-50 border-gray-200'
            }`}
          >
            <Zap className={`w-12 h-12 mx-auto mb-4 ${dark ? 'text-neon-cyan' : 'text-mint-500'}`} />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Start Saving the New Way?
            </h2>
            <p className={`mb-8 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
              Join now and experience the comfort of fintech + the power of DeFi.
            </p>
            <button
              onClick={() => dispatch({ type: 'CONNECT_WALLET' })}
              className={`btn-sheen px-10 py-4 rounded-2xl text-lg font-bold transition-all transform hover:scale-105 ${
                dark
                  ? 'bg-gradient-to-r from-neon-cyan to-neon-green text-navy-950'
                  : 'bg-gradient-to-r from-mint-500 to-trust-600 text-white hover:shadow-lg'
              }`}
            >
              Get Started — It's Free
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-8 border-t text-center text-sm ${
        dark ? 'border-white/10 text-gray-500' : 'border-gray-200 text-gray-400'
      }`}>
        <p>© 2024 LuminaSave — Powered by YO Protocol. All rights reserved.</p>
      </footer>
    </div>
  );
}
