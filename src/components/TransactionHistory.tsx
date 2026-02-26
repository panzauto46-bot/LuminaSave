import { useApp } from '../context/AppContext';
import { ArrowDownCircle, ArrowUpCircle, ExternalLink, Shield, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TransactionHistory() {
  const { state } = useApp();
  const dark = state.darkMode;

  const getExplorerUrl = (network: string, hash: string) => {
    const base: Record<string, string> = {
      Base: 'https://basescan.org/tx/',
      Arbitrum: 'https://arbiscan.io/tx/',
      Ethereum: 'https://etherscan.io/tx/',
    };
    return `${base[network] || ''}${hash}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <Shield className={`w-6 h-6 ${dark ? 'text-neon-cyan' : 'text-trust-600'}`} />
          <h1 className="text-2xl md:text-3xl font-bold">Transparency & History</h1>
        </div>
        <p className={`mb-8 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
          All transactions are recorded on the blockchain. Verify them yourself anytime.
        </p>

        <div
          className={`rounded-2xl p-4 mb-6 flex items-center gap-3 ${
            dark ? 'bg-neon-cyan/10 border border-neon-cyan/20' : 'bg-trust-50 border border-trust-200'
          }`}
        >
          <Shield className={`w-8 h-8 shrink-0 ${dark ? 'text-neon-cyan' : 'text-trust-600'}`} />
          <div>
            <p className="font-bold text-sm">100% On-Chain & Verified</p>
            <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              Every transaction has proof on the blockchain that you can check directly on the block explorer.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {state.transactions.map((tx, i) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-2xl border p-4 transition-all hover:scale-[1.01] ${
                dark ? 'bg-navy-900 border-white/10 hover:border-white/20' : 'bg-white border-gray-200 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      tx.type === 'deposit'
                        ? dark ? 'bg-neon-green/20' : 'bg-mint-100'
                        : dark ? 'bg-orange-500/20' : 'bg-orange-100'
                    }`}
                  >
                    {tx.type === 'deposit' ? (
                      <ArrowDownCircle className={`w-5 h-5 ${dark ? 'text-neon-green' : 'text-mint-600'}`} />
                    ) : (
                      <ArrowUpCircle className={`w-5 h-5 ${dark ? 'text-orange-400' : 'text-orange-600'}`} />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">
                        {tx.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                      </span>
                      {tx.status === 'success' ? (
                        <span
                          className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                            dark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          Success
                        </span>
                      ) : tx.status === 'failed' ? (
                        <span
                          className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                            dark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'
                          }`}
                        >
                          <AlertTriangle className="w-3 h-3" />
                          Failed
                        </span>
                      ) : (
                        <span
                          className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                            dark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                    </div>
                    <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {tx.goalName} - {tx.date}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`font-bold ${
                      tx.type === 'deposit'
                        ? dark ? 'text-neon-green' : 'text-mint-600'
                        : dark ? 'text-orange-400' : 'text-orange-600'
                    }`}
                  >
                    {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </p>
                  {tx.yieldAmount && tx.yieldAmount > 0 && (
                    <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Yield: +${tx.yieldAmount.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>

              <div
                className={`mt-3 pt-3 border-t flex flex-wrap items-center justify-between gap-2 ${
                  dark ? 'border-white/5' : 'border-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      dark ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {tx.network}
                  </span>
                  <span className={`text-xs font-mono ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {tx.txHash.length > 20 ? tx.txHash.slice(0, 10) + '...' + tx.txHash.slice(-6) : tx.txHash}
                  </span>
                </div>
                <a
                  href={getExplorerUrl(tx.network, tx.txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-lg transition-all ${
                    dark ? 'bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan/20' : 'bg-trust-50 text-trust-600 hover:bg-trust-100'
                  }`}
                >
                  <ExternalLink className="w-3 h-3" />
                  View Proof on Block Explorer
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {state.transactions.length === 0 && (
          <div className="text-center py-12">
            <p className={`text-lg font-medium ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
              No transaction history yet
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
