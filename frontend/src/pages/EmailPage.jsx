import { useState } from 'react';
import {
  Mail, Plus, Send, Eye, Clock, CheckCircle, XCircle,
  X, Users, BarChart3, MousePointerClick, AlertCircle
} from 'lucide-react';

const DEMO_EMAILS = [
  { id: 1, name: 'Summer Sale Announcement', subjectLine: '🔥 50% Off — Summer Sale Starts Now!', status: 'SENT', recipientCount: 2450, sent: 2450, delivered: 2380, opened: 667, clicked: 80, bounced: 70, openRate: 28.01, clickRate: 11.99, sentAt: '2026-03-01T10:00:00' },
  { id: 2, name: 'Product Launch Newsletter', subjectLine: '🚀 Introducing Our New AI Features', status: 'SCHEDULED', recipientCount: 3200, sent: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0, openRate: 0, clickRate: 0, scheduledAt: '2026-03-10T09:00:00' },
  { id: 3, name: 'Weekly Tips & Tricks', subjectLine: '💡 5 Marketing Tips You Need This Week', status: 'DRAFT', recipientCount: 0, sent: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0, openRate: 0, clickRate: 0, scheduledAt: null },
];

const EMAIL_STATUS_STYLES = {
  DRAFT: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  SCHEDULED: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  SENDING: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  SENT: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  FAILED: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  CANCELLED: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

export default function EmailPage() {
  const [emails, setEmails] = useState(DEMO_EMAILS);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);

  const totalSent = emails.reduce((sum, e) => sum + e.sent, 0);
  const totalOpened = emails.reduce((sum, e) => sum + e.opened, 0);
  const totalClicked = emails.reduce((sum, e) => sum + e.clicked, 0);
  const avgOpenRate = totalSent > 0 ? (totalOpened / totalSent * 100).toFixed(1) : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <Mail className="w-9 h-9 text-violet-400" />
            Email Campaigns
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Create, schedule, and track email campaigns</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-gradient flex items-center gap-2 text-sm px-6 py-3.5">
          <Plus className="w-4 h-4" /> New Email Campaign
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Emails Sent', value: totalSent.toLocaleString(), icon: Send, color: 'stat-card-blue' },
          { label: 'Total Opens', value: totalOpened.toLocaleString(), icon: Eye, color: 'stat-card-violet' },
          { label: 'Total Clicks', value: totalClicked.toLocaleString(), icon: MousePointerClick, color: 'stat-card-emerald' },
          { label: 'Avg. Open Rate', value: `${avgOpenRate}%`, icon: BarChart3, color: 'stat-card-amber' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`glass-card p-4 ${color}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">{label}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
              </div>
              <Icon className="w-5 h-5 text-slate-500" />
            </div>
          </div>
        ))}
      </div>

      {/* Email List */}
      <div className="space-y-3">
        {emails.map((email, i) => (
          <div
            key={email.id}
            className="glass-card p-5 animate-slide-in cursor-pointer hover:border-blue-500/20"
            style={{ animationDelay: `${i * 60}ms` }}
            onClick={() => setSelectedEmail(email)}
          >
            <div className="flex items-center gap-5">
              {/* Status */}
              <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${EMAIL_STATUS_STYLES[email.status]}`}>
                {email.status}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold">{email.name}</h3>
                <p className="text-sm text-slate-500 truncate mt-0.5">
                  Subject: {email.subjectLine}
                </p>
              </div>

              {/* Analytics */}
              {email.status === 'SENT' && (
                <div className="hidden md:flex gap-6 text-center">
                  <div>
                    <p className="text-xs text-slate-500">Delivered</p>
                    <p className="text-sm font-bold text-white">{email.delivered.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Open Rate</p>
                    <p className="text-sm font-bold text-emerald-400">{email.openRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Click Rate</p>
                    <p className="text-sm font-bold text-blue-400">{email.clickRate}%</p>
                  </div>
                </div>
              )}

              {email.status === 'SCHEDULED' && (
                <div className="text-sm text-slate-500 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(email.scheduledAt).toLocaleDateString()}
                </div>
              )}

              <div className="flex gap-1">
                {email.status === 'DRAFT' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); setEmails(emails.map((em) =>
                        em.id === email.id ? { ...em, status: 'SENT', sent: 1200, delivered: 1164, opened: 326, clicked: 39, bounced: 36, openRate: 28.0, clickRate: 11.96, sentAt: new Date().toISOString() } : em
                      ));
                    }}
                    className="p-2 rounded-lg hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 transition"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedEmail && selectedEmail.status === 'SENT' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card w-full max-w-2xl p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">{selectedEmail.name}</h2>
              <button onClick={() => setSelectedEmail(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Sent', value: selectedEmail.sent, icon: Send },
                { label: 'Delivered', value: selectedEmail.delivered, icon: CheckCircle },
                { label: 'Opened', value: selectedEmail.opened, icon: Eye },
                { label: 'Clicked', value: selectedEmail.clicked, icon: MousePointerClick },
                { label: 'Bounced', value: selectedEmail.bounced, icon: AlertCircle },
                { label: 'Open Rate', value: `${selectedEmail.openRate}%`, icon: BarChart3 },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="p-4 rounded-xl bg-navy-800/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-slate-500" />
                    <p className="text-xs text-slate-500">{label}</p>
                  </div>
                  <p className="text-lg font-bold text-white">{value}</p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-navy-800/30">
              <p className="text-xs text-slate-500 mb-1">Subject Line</p>
              <p className="text-white">{selectedEmail.subjectLine}</p>
            </div>

            <button onClick={() => setSelectedEmail(null)} className="mt-4 w-full py-3 rounded-xl bg-navy-700/50 text-slate-300 hover:bg-navy-600/50 transition font-medium">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <CreateEmailModal onClose={() => setShowCreate(false)} onCreate={(email) => {
          setEmails([{ id: Date.now(), ...email, sent: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0, openRate: 0, clickRate: 0 }, ...emails]);
          setShowCreate(false);
        }} />
      )}
    </div>
  );
}

function CreateEmailModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    name: '', subjectLine: '', previewText: '', fromName: '', fromEmail: '',
    recipientCount: 0, status: 'DRAFT', scheduledAt: '',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-card w-full max-w-lg p-6 animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Create Email Campaign</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Campaign Name *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-dark" placeholder="Summer Newsletter" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Subject Line *</label>
            <input value={form.subjectLine} onChange={(e) => setForm({ ...form, subjectLine: e.target.value })} className="input-dark" placeholder="🚀 Don't miss our latest update!" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Preview Text</label>
            <input value={form.previewText} onChange={(e) => setForm({ ...form, previewText: e.target.value })} className="input-dark" placeholder="Preview text shown in inbox..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">From Name</label>
              <input value={form.fromName} onChange={(e) => setForm({ ...form, fromName: e.target.value })} className="input-dark" placeholder="MarkAI" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">From Email</label>
              <input value={form.fromEmail} onChange={(e) => setForm({ ...form, fromEmail: e.target.value })} className="input-dark" placeholder="hello@markai.com" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Schedule (optional)</label>
            <input type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} className="input-dark" />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-navy-700/50 text-slate-300 hover:bg-navy-600/50 transition font-medium">Cancel</button>
          <button
            onClick={() => onCreate({ ...form, status: form.scheduledAt ? 'SCHEDULED' : 'DRAFT' })}
            disabled={!form.name || !form.subjectLine}
            className="flex-1 btn-gradient py-3 disabled:opacity-50"
          >
            Create Campaign
          </button>
        </div>
      </div>
    </div>
  );
}
