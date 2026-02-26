import { useApp } from '../context/AppContext';
import { Shield, TrendingUp, Wallet, ChevronRight, Lock, Zap, Globe } from 'lucide-react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from 'framer-motion';
import type { CSSProperties, MouseEvent } from 'react';
import { useWalletActions } from '../hooks/useWalletActions';
import { useSwitchChain } from 'wagmi';

const sectionFade: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerList: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.06,
    },
  },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  },
};

const dataPackets = [
  { left: 8, top: 24, delay: 0.3, width: 150 },
  { left: 20, top: 62, delay: 1.2, width: 200 },
  { left: 35, top: 35, delay: 2.1, width: 130 },
  { left: 54, top: 70, delay: 0.8, width: 170 },
  { left: 67, top: 28, delay: 1.8, width: 140 },
  { left: 79, top: 54, delay: 2.6, width: 180 },
];

const runningMetrics = [
  'Real-time Yield Tracking',
  'Auto Rebalance',
  'Proof-of-Reserve On-Chain',
  'Instant Deposit Route',
  'Vault Risk Monitoring',
  'YO Protocol Engine',
];

export default function LandingPage() {
  const { state, dispatch } = useApp();
  const dark = state.darkMode;
  const currentYear = new Date().getFullYear();
  const { connectWallet, isConnecting } = useWalletActions();
  const { switchChainAsync, isPending: isSwitchingChain } = useSwitchChain();
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const pointerX = useMotionValue(50);
  const pointerY = useMotionValue(50);

  const heroY = useTransform(scrollYProgress, [0, 0.35], [0, prefersReducedMotion ? 0 : 70]);
  const heroFade = useTransform(scrollYProgress, [0, 0.28], [1, 0.84]);

  const parallaxX = useTransform(pointerX, [0, 100], prefersReducedMotion ? [0, 0] : [-18, 18]);
  const parallaxY = useTransform(pointerY, [0, 100], prefersReducedMotion ? [0, 0] : [-12, 12]);
  const robotParallaxX = useTransform(pointerX, [0, 100], prefersReducedMotion ? [0, 0] : [-12, 12]);
  const robotParallaxY = useTransform(pointerY, [0, 100], prefersReducedMotion ? [0, 0] : [-10, 10]);

  const pointerGlow = useMotionTemplate`radial-gradient(460px circle at ${pointerX}% ${pointerY}%, rgba(251, 191, 36, 0.18) 0%, transparent 64%)`;

  const handleBackgroundPointerMove = (e: MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    pointerX.set(x);
    pointerY.set(y);
  };

  const resetBackgroundPointer = () => {
    pointerX.set(50);
    pointerY.set(50);
  };

  const trackPointer = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty('--mx', `${x}%`);
    e.currentTarget.style.setProperty('--my', `${y}%`);
  };

  const handleWalletConnect = () => {
    void connectWallet();
  };

  const handleTryOnBase = async () => {
    dispatch({ type: 'SET_SELECTED_VAULT', payload: 'yoUSD' });

    try {
      if (!state.connected) {
        await connectWallet();
      }
      await switchChainAsync({ chainId: 8453 });
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: `base-${Date.now()}`,
          title: 'Demo mode ready',
          message: 'Switched to Base with yoUSD selected. You can start live deposit flow now.',
          type: 'success',
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to switch to Base network.';
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: `base-failed-${Date.now()}`,
          title: 'Switch to Base failed',
          message,
          type: 'failed',
        },
      });
    }
  };

  return (
    <div
      className={`relative min-h-screen overflow-hidden ${dark ? 'bg-navy-950 text-white' : 'bg-slate-50 text-gray-900'}`}
      onMouseMove={handleBackgroundPointerMove}
      onMouseLeave={resetBackgroundPointer}
    >
      <motion.div className="web3-bg" style={{ y: heroY }}>
        <div className="web3-grid" />
        <motion.div className="web3-ambient-wave" style={{ x: parallaxX, y: parallaxY }} />
        <div className="web3-flow" />
        <motion.div className="web3-flow web3-flow--gold" style={{ x: parallaxX }} />
        <motion.div
          className={`web3-interactive-glow ${dark ? 'web3-interactive-glow--dark' : 'web3-interactive-glow--light'}`}
          style={{ backgroundImage: pointerGlow }}
        />
        <div className="web3-data-layer">
          {dataPackets.map((packet, index) => (
            <span
              key={index}
              className="web3-data-node"
              style={{
                '--packet-left': `${packet.left}%`,
                '--packet-top': `${packet.top}%`,
                '--packet-delay': `${packet.delay}s`,
                '--packet-width': `${packet.width}px`,
              } as CSSProperties}
            />
          ))}
        </div>
        <div className="web3-orb web3-orb--one" />
        <div className="web3-orb web3-orb--two" />
      </motion.div>

      <section className="relative overflow-hidden min-h-[76vh] md:min-h-[82vh] flex items-start md:items-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className={`absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-20 ${
              dark ? 'bg-gold-400' : 'bg-gold-300'
            }`}
          />
          <div
            className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-20 ${
              dark ? 'bg-neon-cyan' : 'bg-trust-400'
            }`}
          />
        </div>

        <div className="max-w-6xl mx-auto px-4 py-16 md:py-32 relative z-10 w-full">
          <div className="grid items-center gap-8 md:gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              style={{ opacity: heroFade }}
              className="text-center max-w-3xl mx-auto lg:text-left lg:mx-0"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8 backdrop-blur-xl ${
                  dark
                    ? 'bg-gold-500/12 text-gold-300 border border-gold-400/25'
                    : 'bg-gold-50 text-gold-700 border border-gold-200'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Powered by YO Protocol - Up to 12.5% APY
              </motion.div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 font-display">
                Crypto Savings,{' '}
                <span
                  className={`bg-clip-text text-transparent ${
                    dark
                      ? 'bg-gradient-to-r from-gold-300 to-gold-500'
                      : 'bg-gradient-to-r from-gold-500 to-gold-700'
                  }`}
                >
                  As Easy as Banking.
                </span>
              </h1>

              <p className={`text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 mb-10 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                Set your savings goals, deposit your funds, and let DeFi work for you.
                Transparent, secure, and real yield - straight from the blockchain.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={handleWalletConnect}
                  disabled={isConnecting}
                  className={`group click-pulse btn-sheen w-full sm:w-auto px-8 py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 transition-all transform hover:scale-105 ${
                    dark
                      ? 'bg-gradient-to-r from-gold-300 to-gold-500 text-navy-950 hover:shadow-lg hover:shadow-gold-500/35'
                      : 'bg-gradient-to-r from-gold-500 to-gold-600 text-white hover:shadow-lg hover:shadow-gold-500/30'
                  } ${isConnecting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  <Wallet className="w-5 h-5" />
                  {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => {
                    void handleTryOnBase();
                  }}
                  disabled={isConnecting || isSwitchingChain}
                  className={`click-pulse btn-sheen w-full sm:w-auto px-8 py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 transition-all border-2 ${
                    dark
                      ? 'border-neon-cyan/35 text-neon-cyan hover:bg-neon-cyan/10'
                      : 'border-trust-300 text-trust-700 hover:bg-trust-50'
                  } ${(isConnecting || isSwitchingChain) ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSwitchingChain ? 'Switching...' : 'Try on Base'}
                </button>
                <button
                  onClick={handleWalletConnect}
                  disabled={isConnecting}
                  className={`click-pulse btn-sheen w-full sm:w-auto px-8 py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 transition-all border-2 ${
                    dark
                      ? 'border-gold-300/30 text-gold-200 hover:bg-gold-500/10'
                      : 'border-gold-300 text-gold-700 hover:bg-gold-50'
                  } ${isConnecting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill={dark ? '#fff' : '#4285F4'} d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                    <path fill={dark ? '#ccc' : '#34A853'} d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill={dark ? '#aaa' : '#FBBC05'} d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill={dark ? '#888' : '#EA4335'} d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Login with Google
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="hidden xl:flex justify-end"
            >
              <motion.div className="hero-robot-scene" style={{ x: robotParallaxX, y: robotParallaxY }}>
                <div className="hero-robot-glow" />
                <div className="hero-robot-shadow" />

                <div className="hero-robot-orbit hero-robot-orbit--outer">
                  <span className="hero-robot-signal">APY</span>
                </div>
                <div className="hero-robot-orbit hero-robot-orbit--inner">
                  <span className="hero-robot-signal">SAFE</span>
                </div>

                <div className="hero-robot">
                  <div className="hero-robot-shell">
                    <div className="hero-robot-head">
                      <span className="hero-robot-eye" />
                      <span className="hero-robot-eye" />
                      <span className="hero-robot-antenna" />
                    </div>
                    <div className="hero-robot-neck" />
                    <div className="hero-robot-body">
                      <div className="hero-robot-screen">
                        <span className="hero-robot-line" />
                        <span className="hero-robot-line" />
                      </div>
                      <div className="hero-robot-core">YO</div>
                    </div>
                    <span className="hero-robot-arm hero-robot-arm--left" />
                    <span className="hero-robot-arm hero-robot-arm--right" />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          onClick={() => document.getElementById('trust-signals')?.scrollIntoView({ behavior: 'smooth' })}
          className={`hidden md:inline-flex click-pulse absolute bottom-8 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-full text-xs font-semibold tracking-wide ${
            dark
              ? 'bg-white/10 text-gold-300 border border-gold-300/25'
              : 'bg-white/90 text-gold-700 border border-gold-200'
          }`}
        >
          Scroll to Explore
        </motion.button>
      </section>

      <section
        className={`relative z-10 py-3 border-y ${
          dark ? 'bg-navy-900/40 border-gold-300/15' : 'bg-white/75 border-gold-200/70'
        }`}
      >
        <div className="running-strip-mask">
          <div className="running-strip">
            {[...runningMetrics, ...runningMetrics].map((item, index) => (
              <span
                key={`${item}-${index}`}
                className={`running-pill ${
                  dark ? 'text-gold-200 bg-gold-500/10 border-gold-300/20' : 'text-gold-700 bg-gold-50 border-gold-200'
                }`}
              >
                <span className={`running-dot ${dark ? 'bg-gold-300' : 'bg-gold-500'}`} />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <motion.section
        id="trust-signals"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionFade}
        className={`py-12 border-y ${
          dark ? 'bg-navy-900/45 border-white/5' : 'bg-white/80 border-gray-100 backdrop-blur-xl'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.div variants={staggerList} className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            <motion.div variants={staggerItem} className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  dark ? 'bg-neon-cyan/10' : 'bg-trust-100'
                }`}
              >
                <Shield className={`w-6 h-6 ${dark ? 'text-neon-cyan' : 'text-trust-600'}`} />
              </div>
              <div>
                <p className="font-bold text-sm">Audited & Secured</p>
                <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Smart Contract Verified</p>
              </div>
            </motion.div>
            <motion.div variants={staggerItem} className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  dark ? 'bg-gold-500/15' : 'bg-gold-100'
                }`}
              >
                <TrendingUp className={`w-6 h-6 ${dark ? 'text-gold-300' : 'text-gold-600'}`} />
              </div>
              <div>
                <p className="font-bold text-sm">APY 8-12.5%</p>
                <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Via YO Protocol Vaults</p>
              </div>
            </motion.div>
            <motion.div variants={staggerItem} className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  dark ? 'bg-trust-500/15' : 'bg-trust-100'
                }`}
              >
                <Globe className={`w-6 h-6 ${dark ? 'text-trust-300' : 'text-trust-600'}`} />
              </div>
              <div>
                <p className="font-bold text-sm">Multi-Chain</p>
                <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Base, Arbitrum, Ethereum</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <div className="px-4 max-w-6xl mx-auto">
        <div className="flow-divider" />
      </div>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionFade}
        className="py-20"
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.div variants={sectionFade} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why LuminaSave?</h2>
            <p className={`text-lg ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
              Combining fintech banking simplicity with the power of DeFi
            </p>
          </motion.div>

          <motion.div
            variants={staggerList}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: <Wallet className="w-7 h-7" />,
                title: 'Goal-Based Savings',
                desc: 'Create savings pockets like a digital bank. Vacation, laptop, emergency fund - organize your goals your way.',
                gradient: dark ? 'from-neon-cyan/20 to-transparent' : 'from-trust-100 to-transparent',
                iconColor: dark ? 'text-neon-cyan' : 'text-trust-600',
              },
              {
                icon: <TrendingUp className="w-7 h-7" />,
                title: 'Automatic DeFi Yield',
                desc: 'Your money works 24/7 through YO Protocol Vaults. Earn yield without needing to understand complex DeFi.',
                gradient: dark ? 'from-gold-500/20 to-transparent' : 'from-gold-100 to-transparent',
                iconColor: dark ? 'text-gold-300' : 'text-gold-600',
              },
              {
                icon: <Lock className="w-7 h-7" />,
                title: '100% Transparent On-Chain',
                desc: 'Every transaction is recorded on the blockchain. Verify it yourself on the block explorer anytime.',
                gradient: dark ? 'from-trust-500/20 to-transparent' : 'from-trust-100 to-transparent',
                iconColor: dark ? 'text-trust-300' : 'text-trust-600',
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                whileHover={{ y: -6, scale: 1.02 }}
                onMouseMove={trackPointer}
                className={`interactive-card interactive-card--gold p-6 rounded-2xl border transition-all ${
                  dark
                    ? 'bg-white/5 border-white/10 hover:border-gold-300/35'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 ${f.iconColor}`}
                >
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className={`text-sm leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <div className="px-4 max-w-6xl mx-auto">
        <div className="flow-divider" />
      </div>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionFade}
        className={`py-20 ${dark ? 'bg-navy-900/50' : 'bg-gray-50'}`}
      >
        <div className="max-w-4xl mx-auto px-4">
          <motion.div variants={sectionFade} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className={`text-lg ${dark ? 'text-gray-400' : 'text-gray-600'}`}>As easy as 1-2-3</p>
          </motion.div>

          <motion.div
            variants={staggerList}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="space-y-8"
          >
            {[
              { step: '1', title: 'Connect Your Wallet', desc: 'Connect MetaMask, WalletConnect, or login with Google. Just 1 click.' },
              { step: '2', title: 'Set a Goal & Deposit', desc: 'Name your savings target, set the amount you want to save, and start depositing USDC/ETH.' },
              { step: '3', title: 'Sit Back & Earn Yield', desc: 'YO Protocol Vault works for you. Monitor your yield in real-time, withdraw anytime.' },
            ].map((s, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                whileHover={{ x: 4 }}
                onMouseMove={trackPointer}
                className={`interactive-card interactive-card--gold flex gap-4 items-start rounded-2xl px-3 py-3 ${
                  dark ? 'hover:bg-gold-500/10' : 'hover:bg-white/70'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold shrink-0 ${
                    dark
                      ? 'bg-gradient-to-br from-gold-300 to-gold-500 text-navy-950'
                      : 'bg-gradient-to-br from-gold-500 to-gold-700 text-white'
                  }`}
                >
                  {s.step}
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">{s.title}</h3>
                  <p className={`${dark ? 'text-gray-400' : 'text-gray-600'}`}>{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={sectionFade}
        className="py-20"
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`p-10 rounded-3xl border ${
              dark
                ? 'bg-gradient-to-br from-gold-500/12 to-neon-cyan/10 border-white/10'
                : 'bg-gradient-to-br from-gold-50 to-trust-50 border-gray-200'
            }`}
          >
            <Zap className={`w-12 h-12 mx-auto mb-4 ${dark ? 'text-gold-300' : 'text-gold-500'}`} />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Saving the New Way?</h2>
            <p className={`mb-8 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
              Join now and experience the comfort of fintech + the power of DeFi.
            </p>
            <button
              onClick={handleWalletConnect}
              disabled={isConnecting}
              className={`click-pulse btn-sheen px-10 py-4 rounded-2xl text-lg font-bold transition-all transform hover:scale-105 ${
                dark
                  ? 'bg-gradient-to-r from-gold-300 to-gold-500 text-navy-950'
                  : 'bg-gradient-to-r from-gold-500 to-gold-700 text-white hover:shadow-lg'
              } ${isConnecting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isConnecting ? 'Connecting...' : "Get Started - It's Free"}
            </button>
          </motion.div>
        </div>
      </motion.section>

      <footer
        className={`py-8 border-t text-center text-sm ${
          dark ? 'border-white/10 text-gray-500' : 'border-gray-200 text-gray-400'
        }`}
      >
        <p>&copy; {currentYear} LuminaSave - Powered by YO Protocol. All rights reserved.</p>
      </footer>
    </div>
  );
}
