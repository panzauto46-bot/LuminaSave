import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Clock3, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { AppNotification } from '../types';

function NotificationItem({ note }: { note: AppNotification }) {
  const { dispatch, state } = useApp();
  const dark = state.darkMode;

  useEffect(() => {
    if (note.type === 'pending') return;

    const timer = window.setTimeout(() => {
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: note.id });
    }, 4200);

    return () => window.clearTimeout(timer);
  }, [dispatch, note.id, note.type]);

  const visual =
    note.type === 'success'
      ? {
          icon: CheckCircle2,
          accent: dark ? 'text-green-400' : 'text-green-600',
          border: dark ? 'border-green-500/30' : 'border-green-200',
          bg: dark ? 'bg-green-500/10' : 'bg-green-50',
        }
      : note.type === 'failed'
      ? {
          icon: AlertTriangle,
          accent: dark ? 'text-red-400' : 'text-red-600',
          border: dark ? 'border-red-500/30' : 'border-red-200',
          bg: dark ? 'bg-red-500/10' : 'bg-red-50',
        }
      : {
          icon: Clock3,
          accent: dark ? 'text-gold-300' : 'text-gold-700',
          border: dark ? 'border-gold-500/30' : 'border-gold-200',
          bg: dark ? 'bg-gold-500/10' : 'bg-gold-50',
        };

  const Icon = visual.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      className={`w-full rounded-2xl border p-3 shadow-lg ${visual.border} ${visual.bg} ${
        dark ? 'text-white shadow-black/30' : 'text-gray-900 shadow-gray-300/40'
      }`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${visual.accent}`} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">{note.title}</p>
          <p className={`text-xs mt-1 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>{note.message}</p>
        </div>
        <button
          onClick={() => dispatch({ type: 'REMOVE_NOTIFICATION', payload: note.id })}
          className={`p-1 rounded-md ${dark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

export default function NotificationCenter() {
  const { state } = useApp();

  return (
    <div className="fixed top-16 right-4 z-[70] w-[min(92vw,360px)] pointer-events-none">
      <div className="space-y-2 pointer-events-auto">
        <AnimatePresence initial={false}>
          {state.notifications.map((note) => (
            <NotificationItem key={note.id} note={note} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
