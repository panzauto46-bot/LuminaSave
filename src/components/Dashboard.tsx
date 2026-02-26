import { useApp } from '../context/AppContext';
import { Plus, ArrowDownCircle, ArrowUpCircle, TrendingUp, Wallet, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import type { MouseEvent } from 'react';

export default function Dashboard() {
  const { state, dispatch } = useApp();
  const dark = state.darkMode;
  const trackPointer = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty('--mx', `${x}%`);
    e.currentTarget.style.setProperty('--my', `${y}%`);
  };

  const totalBalance = state.goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalYield = state.goals.reduce((sum, g) => sum + g.yieldEarned, 0);
  const totalTarget = state.goals.reduce((sum, g) => sum + g.targetAmount, 0);

  return (
    <div className="relative max-w-6xl mx-auto px-4 py-6 space-y-6 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
        <div className={`absolute -top-28 right-8 w-80 h-80 rounded-full blur-3xl ${dark ? 'bg-neon-cyan/15' : 'bg-trust-200/40'}`} />
        <div className={`absolute bottom-0 -left-24 w-72 h-72 rounded-full blur-3xl ${dark ? 'bg-neon-green/10' : 'bg-mint-200/45'}`} />
      </div>

      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold">Welcome back! 👋</h1>
        <p className={`mt-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
          Track your savings and yield earnings here.
        </p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -4 }}
          transition={{ delay: 0.1 }}
          onMouseMove={trackPointer}
          className={`interactive-card p-5 rounded-2xl border ${
            dark
              ? 'bg-gradient-to-br from-navy-900 to-navy-950 border-white/10'
              : 'bg-white border-gray-200 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              dark ? 'bg-trust-500/20' : 'bg-trust-100'
            }`}>
              <Wallet className={`w-5 h-5 ${dark ? 'text-trust-400' : 'text-trust-600'}`} />
            </div>
            <span className={`text-sm font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              Total Balance
            </span>
          </div>
          <p className="text-3xl font-extrabold">
            ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className={`text-xs mt-1 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            USDC across all pockets
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -4 }}
          transition={{ delay: 0.2 }}
          onMouseMove={trackPointer}
          className={`interactive-card p-5 rounded-2xl border ${
            dark
              ? 'bg-gradient-to-br from-navy-900 to-navy-950 border-white/10'
              : 'bg-white border-gray-200 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              dark ? 'bg-neon-green/20' : 'bg-mint-100'
            }`}>
              <TrendingUp className={`w-5 h-5 ${dark ? 'text-neon-green' : 'text-mint-600'}`} />
            </div>
            <span className={`text-sm font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              Total Yield Earned
            </span>
          </div>
          <p className={`text-3xl font-extrabold ${dark ? 'text-neon-green' : 'text-mint-600'}`}>
            +${totalYield.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className={`text-xs mt-1 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            From YO Protocol Vaults
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -4 }}
          transition={{ delay: 0.3 }}
          onMouseMove={trackPointer}
          className={`interactive-card p-5 rounded-2xl border ${
            dark
              ? 'bg-gradient-to-br from-navy-900 to-navy-950 border-white/10'
              : 'bg-white border-gray-200 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              dark ? 'bg-purple-500/20' : 'bg-purple-100'
            }`}>
              <Target className={`w-5 h-5 ${dark ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <span className={`text-sm font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              Goal Progress
            </span>
          </div>
          <p className="text-3xl font-extrabold">
            {Math.round((totalBalance / totalTarget) * 100)}%
          </p>
          <div className={`w-full h-2 rounded-full mt-2 ${dark ? 'bg-white/10' : 'bg-gray-200'}`}>
            <div
              className={`h-full rounded-full ${
                dark
                  ? 'bg-gradient-to-r from-neon-cyan to-neon-green'
                  : 'bg-gradient-to-r from-mint-500 to-trust-500'
              }`}
              style={{ width: `${Math.min(100, Math.round((totalBalance / totalTarget) * 100))}%` }}
            />
          </div>
          <p className={`text-xs mt-1 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            ${totalBalance.toLocaleString()} of ${totalTarget.toLocaleString()} target
          </p>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="flex gap-3"
      >
        <button
          onClick={() => {
            if (state.goals.length > 0) {
              dispatch({ type: 'OPEN_DEPOSIT', payload: state.goals[0].id });
            }
          }}
          className={`btn-sheen flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm transition-all hover:scale-105 ${
            dark
              ? 'bg-gradient-to-r from-neon-cyan to-neon-green text-navy-950'
              : 'bg-gradient-to-r from-mint-500 to-trust-600 text-white shadow-md'
          }`}
        >
          <ArrowDownCircle className="w-5 h-5" />
          + Deposit
        </button>
        <button
          onClick={() => {
            if (state.goals.length > 0) {
              dispatch({ type: 'OPEN_REDEEM', payload: state.goals[0].id });
            }
          }}
          className={`btn-sheen flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm transition-all border-2 hover:scale-105 ${
            dark
              ? 'border-white/20 text-white hover:bg-white/10'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <ArrowUpCircle className="w-5 h-5" />
          - Withdraw / Redeem
        </button>
      </motion.div>

      {/* Savings Goals */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Savings Pockets</h2>
          <button
            onClick={() => dispatch({ type: 'SET_PAGE', payload: 'create-goal' })}
            className={`flex items-center gap-1 text-sm font-semibold px-4 py-2 rounded-xl transition-all ${
              dark
                ? 'bg-white/10 hover:bg-white/15 text-neon-cyan'
                : 'bg-mint-50 hover:bg-mint-100 text-mint-700'
            }`}
          >
            <Plus className="w-4 h-4" />
            Create New Pocket
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.goals.map((goal, i) => {
            const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                transition={{ delay: 0.1 * i }}
                onMouseMove={trackPointer}
                className={`interactive-card rounded-2xl border overflow-hidden transition-all hover:scale-[1.02] ${
                  dark
                    ? 'bg-navy-900 border-white/10 hover:border-white/20'
                    : 'bg-white border-gray-200 hover:shadow-lg'
                }`}
              >
                {/* Card header with gradient */}
                <div className={`h-2 bg-gradient-to-r ${goal.color}`} />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{goal.icon}</span>
                      <div>
                        <h3 className="font-bold text-base">{goal.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          goal.riskProfile === 'low'
                            ? dark
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-green-100 text-green-700'
                            : dark
                            ? 'bg-orange-500/20 text-orange-400'
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {goal.riskProfile === 'low' ? '🛡️ Low Risk' : '⚡ Medium Risk'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="mb-3">
                    <p className="text-2xl font-extrabold">
                      ${goal.currentAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                    <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                      of ${goal.targetAmount.toLocaleString()} target
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className={`w-full h-2.5 rounded-full mb-2 ${dark ? 'bg-white/10' : 'bg-gray-200'}`}>
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${goal.color} transition-all duration-500`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs mb-4">
                    <span className={dark ? 'text-gray-400' : 'text-gray-500'}>{progress}% reached</span>
                    <span className={`font-semibold ${dark ? 'text-neon-green' : 'text-mint-600'}`}>
                      +${goal.yieldEarned.toFixed(2)} yield
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => dispatch({ type: 'OPEN_DEPOSIT', payload: goal.id })}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                        dark
                          ? 'bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/30'
                          : 'bg-mint-100 text-mint-700 hover:bg-mint-200'
                      }`}
                    >
                      <ArrowDownCircle className="w-3.5 h-3.5" />
                      Deposit
                    </button>
                    <button
                      onClick={() => dispatch({ type: 'OPEN_REDEEM', payload: goal.id })}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                        dark
                          ? 'bg-white/10 text-gray-300 hover:bg-white/15'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <ArrowUpCircle className="w-3.5 h-3.5" />
                      Withdraw
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Add new card */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * state.goals.length }}
            onClick={() => dispatch({ type: 'SET_PAGE', payload: 'create-goal' })}
            className={`rounded-2xl border-2 border-dashed p-8 flex flex-col items-center justify-center gap-3 transition-all hover:scale-[1.02] min-h-[250px] ${
              dark
                ? 'border-white/10 hover:border-neon-cyan/50 text-gray-500 hover:text-neon-cyan'
                : 'border-gray-300 hover:border-mint-400 text-gray-400 hover:text-mint-600'
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              dark ? 'bg-white/5' : 'bg-gray-100'
            }`}>
              <Plus className="w-7 h-7" />
            </div>
            <span className="font-semibold">Create New Goal</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
