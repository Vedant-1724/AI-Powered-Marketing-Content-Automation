import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="glass-card w-full max-w-sm p-6 animate-bounce-in">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-rose-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm text-slate-400 mt-1">{message}</p>
          </div>
          <button onClick={onCancel} className="text-slate-500 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl bg-navy-700/50 text-slate-300 hover:bg-navy-600/50 transition font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30 transition font-semibold text-sm"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
