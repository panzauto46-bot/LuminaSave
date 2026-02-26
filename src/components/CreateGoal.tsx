import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Calculator, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const ICONS = ['🎯', '🗾', '💻', '🚗', '🏠', '🎓', '🛡️', '✈️', '💍', '🎮', '📱', '🏖️'];
const COLORS = [
  'from-pink-500 to-rose-500',
  'from-blue-500 to-indigo-500',
  'from-emerald-500 to-teal-500',
  'from-purple-500 to-violet-500',
  'from-orange-500 to-amber-500',
  'from-cyan-500 to-sky-500',
];

export default function CreateGoal() {
  const { state, dispatch } = useApp();
  const dark = state.darkMode;

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🎯');
  const [target, setTarget] = useState('');
  const [monthly, setMonthly] = useState('');
  const [risk, setRisk] = useState<'low' | 'medium'>('low');
  const [color, setColor] = useState(COLORS[0]);

  const apyRate = risk === 'low' ? 0.085 : 0.125;
  const targetNum = parseFloat(target) || 0;
  const monthlyNum = parseFloat(monthly) || 0;

  // Simple estimation: compound monthly
  let months = 0;
  if (monthlyNum > 0 && targetNum > 0) {
    let total = 0;
    const monthlyRate = apyRate / 12;
    while (total < targetNum && months < 600) {
      total = total * (1 + monthlyRate) + monthlyNum;
      months++;
    }
  }

  const handleSubmit = () => {
    if (!name || !target) return;
    const newGoal = {
      id: `g${Date.now()}`,
      name,
      icon,
      targetAmount: targetNum,
      currentAmount: 0,
      yieldEarned: 0,
      riskProfile: risk,
      monthlyDeposit: monthlyNum,
      createdAt: new Date().toISOString().split('T')[0],
      color,
    };
    dispatch({ type: 'ADD_GOAL', payload: newGoal });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {/* Back */}
        <button
          onClick={() => dispatch({ type: 'SET_PAGE', payload: 'dashboard' })}
          className={`flex items-center gap-2 mb-6 text-sm font-medium ${
            dark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <h1 className="text-2xl md:text-3xl font-bold mb-2">Create New Savings Goal</h1>
        <p className={`mb-8 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
          Define your target and let DeFi work for you.
        </p>

        <div className={`rounded-2xl border p-6 space-y-6 ${
          dark ? 'bg-navy-900 border-white/10' : 'bg-white border-gray-200 shadow-sm'
        }`}>
          {/* Icon selection */}
          <div>
            <label className="text-sm font-semibold mb-2 block">Choose Icon</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map((ic) => (
                <button
                  key={ic}
                  onClick={() => setIcon(ic)}
                  className={`w-11 h-11 rounded-xl text-xl flex items-center justify-center transition-all ${
                    icon === ic
                      ? dark
                        ? 'bg-neon-cyan/20 ring-2 ring-neon-cyan'
                        : 'bg-mint-100 ring-2 ring-mint-500'
                      : dark
                      ? 'bg-white/5 hover:bg-white/10'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-sm font-semibold mb-2 block">Goal Name</label>
            <input
              type="text"
              placeholder="e.g. Buy a Car"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 ${
                dark
                  ? 'bg-white/5 border border-white/10 text-white focus:ring-neon-cyan placeholder-gray-500'
                  : 'bg-gray-50 border border-gray-200 text-gray-900 focus:ring-mint-500 placeholder-gray-400'
              }`}
            />
          </div>

          {/* Target amount */}
          <div>
            <label className="text-sm font-semibold mb-2 block">Target Amount (USD)</label>
            <div className="relative">
              <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold ${
                dark ? 'text-gray-500' : 'text-gray-400'
              }`}>$</span>
              <input
                type="number"
                placeholder="2,000"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className={`w-full pl-8 pr-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 ${
                  dark
                    ? 'bg-white/5 border border-white/10 text-white focus:ring-neon-cyan placeholder-gray-500'
                    : 'bg-gray-50 border border-gray-200 text-gray-900 focus:ring-mint-500 placeholder-gray-400'
                }`}
              />
            </div>
          </div>

          {/* Monthly deposit */}
          <div>
            <label className="text-sm font-semibold mb-2 block">Monthly Savings Plan (USD)</label>
            <div className="relative">
              <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold ${
                dark ? 'text-gray-500' : 'text-gray-400'
              }`}>$</span>
              <input
                type="number"
                placeholder="100"
                value={monthly}
                onChange={(e) => setMonthly(e.target.value)}
                className={`w-full pl-8 pr-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 ${
                  dark
                    ? 'bg-white/5 border border-white/10 text-white focus:ring-neon-cyan placeholder-gray-500'
                    : 'bg-gray-50 border border-gray-200 text-gray-900 focus:ring-mint-500 placeholder-gray-400'
                }`}
              />
            </div>
          </div>

          {/* Risk profile */}
          <div>
            <label className="text-sm font-semibold mb-2 block">YO Protocol Strategy (Risk Profile)</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setRisk('low')}
                className={`p-4 rounded-xl text-left border-2 transition-all ${
                  risk === 'low'
                    ? dark
                      ? 'border-neon-green bg-neon-green/10'
                      : 'border-mint-500 bg-mint-50'
                    : dark
                    ? 'border-white/10 bg-white/5'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="text-lg mb-1">🛡️</div>
                <p className="font-bold text-sm">Low Risk</p>
                <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Stablecoin Vault
                </p>
                <p className={`text-xs font-semibold mt-1 ${dark ? 'text-neon-green' : 'text-mint-600'}`}>
                  APY ~8.5%
                </p>
              </button>
              <button
                onClick={() => setRisk('medium')}
                className={`p-4 rounded-xl text-left border-2 transition-all ${
                  risk === 'medium'
                    ? dark
                      ? 'border-orange-400 bg-orange-500/10'
                      : 'border-orange-400 bg-orange-50'
                    : dark
                    ? 'border-white/10 bg-white/5'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="text-lg mb-1">⚡</div>
                <p className="font-bold text-sm">Medium Risk</p>
                <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                  ETH/LST Vault
                </p>
                <p className={`text-xs font-semibold mt-1 ${dark ? 'text-orange-400' : 'text-orange-600'}`}>
                  APY ~12.5%
                </p>
              </button>
            </div>
          </div>

          {/* Color selection */}
          <div>
            <label className="text-sm font-semibold mb-2 block">Card Color</label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full bg-gradient-to-r ${c} transition-all ${
                    color === c ? 'ring-2 ring-offset-2 scale-110' : ''
                  } ${color === c && dark ? 'ring-white ring-offset-navy-900' : ''}`}
                />
              ))}
            </div>
          </div>

          {/* Calculator */}
          {monthlyNum > 0 && targetNum > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={`rounded-xl p-4 ${
                dark ? 'bg-neon-cyan/10 border border-neon-cyan/20' : 'bg-mint-50 border border-mint-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Calculator className={`w-4 h-4 ${dark ? 'text-neon-cyan' : 'text-mint-600'}`} />
                <span className="text-sm font-bold">Estimation Calculator</span>
              </div>
              <p className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                If you save <strong>${monthlyNum}/month</strong> with YO yield at{' '}
                <strong>{(apyRate * 100).toFixed(1)}%</strong>, your target of{' '}
                <strong>${targetNum.toLocaleString()}</strong> will be reached in{' '}
                <span className={`font-extrabold text-lg ${dark ? 'text-neon-cyan' : 'text-mint-600'}`}>
                  {months < 600 ? `${months} months` : '> 50 years'}
                </span>
                {months < 600 && months >= 12 && (
                  <span className={`${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {' '}({(months / 12).toFixed(1)} years)
                  </span>
                )}
              </p>
            </motion.div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!name || !target}
            className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
              name && target
                ? dark
                  ? 'bg-gradient-to-r from-neon-cyan to-neon-green text-navy-950 hover:shadow-lg hover:shadow-neon-cyan/30 hover:scale-[1.02]'
                  : 'bg-gradient-to-r from-mint-500 to-trust-600 text-white hover:shadow-lg hover:scale-[1.02]'
                : dark
                ? 'bg-white/10 text-gray-500 cursor-not-allowed'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            Create Savings Goal
          </button>
        </div>
      </motion.div>
    </div>
  );
}
