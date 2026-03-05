import { useState } from 'react';
import {
  Calendar, Clock, Send, Plus, X, Facebook, Instagram, Linkedin, Twitter,
  Mail, ChevronDown, Trash2, RefreshCw, CheckCircle, AlertCircle, Loader
} from 'lucide-react';

const PLATFORMS = [
  { id: 'FACEBOOK', label: 'Facebook', icon: Facebook, color: 'from-blue-600 to-blue-500' },
  { id: 'INSTAGRAM', label: 'Instagram', icon: Instagram, color: 'from-pink-500 to-purple-500' },
  { id: 'LINKEDIN', label: 'LinkedIn', icon: Linkedin, color: 'from-blue-700 to-blue-600' },
  { id: 'TWITTER', label: 'Twitter', icon: Twitter, color: 'from-sky-500 to-blue-400' },
];

const POST_STATUS_STYLES = {
  PENDING: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', icon: Clock },
  QUEUED: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', icon: Loader },
  PUBLISHING: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20', icon: Send },
  PUBLISHED: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', icon: CheckCircle },
  FAILED: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', icon: AlertCircle },
  CANCELLED: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20', icon: X },
};

const DEMO_QUEUE = [
  { id: 1, content: '🚀 Exciting news! Our AI-powered marketing tool just launched...', platform: 'FACEBOOK', status: 'PENDING', scheduledAt: '2026-03-05T09:00:00', likes: 0, shares: 0 },
  { id: 2, content: '✨ 5 ways AI is transforming content marketing in 2026...', platform: 'INSTAGRAM', status: 'PENDING', scheduledAt: '2026-03-05T12:00:00', likes: 0, shares: 0 },
  { id: 3, content: 'Thrilled to share our latest case study on AI marketing ROI...', platform: 'LINKEDIN', status: 'SCHEDULED', scheduledAt: '2026-03-06T10:00:00', likes: 0, shares: 0 },
  { id: 4, content: 'Our Q1 campaign drove 3x engagement with AI-generated content 📈', platform: 'TWITTER', status: 'PUBLISHED', scheduledAt: '2026-03-01T15:00:00', publishedAt: '2026-03-01T15:00:00', likes: 142, shares: 38 },
  { id: 5, content: 'Small business marketing doesn\'t have to be hard. Here\'s how AI helps...', platform: 'FACEBOOK', status: 'PUBLISHED', scheduledAt: '2026-02-28T09:00:00', publishedAt: '2026-02-28T09:01:00', likes: 89, shares: 22 },
];

const CONNECTED_ACCOUNTS = [
  { id: 1, platform: 'FACEBOOK', accountName: 'MarkAI Business', profileImageUrl: null, isActive: true },
  { id: 2, platform: 'INSTAGRAM', accountName: '@markai_official', profileImageUrl: null, isActive: true },
  { id: 3, platform: 'LINKEDIN', accountName: 'MarkAI Inc.', profileImageUrl: null, isActive: true },
];

export default function SchedulerPage() {
  const [queue, setQueue] = useState(DEMO_QUEUE);
  const [accounts] = useState(CONNECTED_ACCOUNTS);
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState('ALL');

  const filtered = filter === 'ALL'
    ? queue
    : queue.filter((p) => p.status === filter);

  const stats = {
    pending: queue.filter((p) => p.status === 'PENDING').length,
    published: queue.filter((p) => p.status === 'PUBLISHED').length,
    failed: queue.filter((p) => p.status === 'FAILED').length,
    total: queue.length,
  };

  const getPlatformInfo = (id) => PLATFORMS.find((p) => p.id === id) || PLATFORMS[0];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <Calendar className="w-9 h-9 text-blue-400" />
            Social Scheduler
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Schedule and automate posts across all platforms</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-gradient flex items-center gap-2 text-sm px-6 py-3.5">
          <Plus className="w-4 h-4" /> Schedule Post
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Queue', value: stats.total, color: 'stat-card-blue' },
          { label: 'Pending', value: stats.pending, color: 'stat-card-amber' },
          { label: 'Published', value: stats.published, color: 'stat-card-emerald' },
          { label: 'Failed', value: stats.failed, color: 'stat-card-rose' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`glass-card p-8 ${color}`}>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="text-4xl font-bold text-white mt-2">{value}</p>
          </div>
        ))}
      </div>

      {/* Connected Accounts */}
      <div className="glass-card p-5">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Connected Accounts</h2>
        <div className="flex gap-3 flex-wrap">
          {accounts.map((acc) => {
            const p = getPlatformInfo(acc.platform);
            const Icon = p.icon;
            return (
              <div key={acc.id} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-700/30 border border-blue-500/10">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${p.color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-white font-medium">{acc.accountName}</p>
                  <p className="text-xs text-emerald-400">Connected</p>
                </div>
              </div>
            );
          })}
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-slate-600 text-slate-500 hover:border-blue-500/30 hover:text-blue-400 transition text-sm">
            <Plus className="w-4 h-4" /> Connect Account
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3">
        {['ALL', 'PENDING', 'PUBLISHED', 'FAILED', 'CANCELLED'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${filter === s
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              : 'bg-navy-700/30 text-slate-500 hover:text-slate-300 border border-transparent'
              }`}
          >
            {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Post Queue */}
      <div className="space-y-4">
        {filtered.map((post, i) => {
          const pInfo = getPlatformInfo(post.platform);
          const PlatformIcon = pInfo.icon;
          const statusStyle = POST_STATUS_STYLES[post.status] || POST_STATUS_STYLES.PENDING;
          const StatusIcon = statusStyle.icon;

          return (
            <div
              key={post.id}
              className="glass-card p-5 flex items-center gap-5 animate-slide-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Platform icon */}
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${pInfo.color} flex items-center justify-center flex-shrink-0`}>
                <PlatformIcon className="w-5 h-5 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{post.content}</p>
                <p className="text-xs text-slate-500 mt-1">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {new Date(post.scheduledAt).toLocaleString()}
                  {post.publishedAt && ` • Published: ${new Date(post.publishedAt).toLocaleString()}`}
                </p>
              </div>

              {/* Status badge */}
              <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}>
                <StatusIcon className="w-3 h-3" />
                {post.status}
              </div>

              {/* Engagement */}
              {post.status === 'PUBLISHED' && (
                <div className="hidden md:flex gap-4 text-center">
                  <div>
                    <p className="text-xs text-slate-500">Likes</p>
                    <p className="text-sm font-bold text-white">{post.likes}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Shares</p>
                    <p className="text-sm font-bold text-white">{post.shares}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              {post.status === 'PENDING' && (
                <div className="flex gap-1">
                  <button
                    onClick={() => setQueue(queue.map((p) =>
                      p.id === post.id ? { ...p, status: 'CANCELLED' } : p
                    ))}
                    className="p-2 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Calendar className="w-12 h-12 mx-auto text-slate-600 mb-4" />
          <p className="text-slate-500">No posts in queue</p>
          <p className="text-slate-600 text-sm mt-1">Schedule your first post to get started</p>
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <SchedulePostModal
          onClose={() => setShowCreate(false)}
          onCreate={(post) => {
            setQueue([{ id: Date.now(), ...post, status: 'PENDING', likes: 0, shares: 0 }, ...queue]);
            setShowCreate(false);
          }}
        />
      )}
    </div>
  );
}

function SchedulePostModal({ onClose, onCreate }) {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [scheduledAt, setScheduledAt] = useState('');

  const togglePlatform = (id) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleCreate = () => {
    if (selectedPlatforms.length === 1) {
      onCreate({ content, platform: selectedPlatforms[0], scheduledAt });
    } else {
      // Bulk schedule — create one per platform
      selectedPlatforms.forEach((platform) => {
        onCreate({ content, platform, scheduledAt });
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-card w-full max-w-lg p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Schedule Post</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Content *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="input-dark min-h-[120px] resize-y"
              placeholder="Write your post content..."
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Platforms *</label>
            <div className="flex gap-2">
              {PLATFORMS.map(({ id, label, icon: Icon, color }) => (
                <button
                  key={id}
                  onClick={() => togglePlatform(id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition ${selectedPlatforms.includes(id)
                    ? `bg-gradient-to-r ${color} text-white shadow-lg`
                    : 'bg-navy-700/30 text-slate-400 hover:text-white border border-transparent'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Schedule Date & Time *</label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="input-dark"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-navy-700/50 text-slate-300 hover:bg-navy-600/50 transition font-medium">Cancel</button>
          <button
            onClick={handleCreate}
            disabled={!content || selectedPlatforms.length === 0 || !scheduledAt}
            className="flex-1 btn-gradient py-3 disabled:opacity-50"
          >
            {selectedPlatforms.length > 1 ? `Schedule to ${selectedPlatforms.length} platforms` : 'Schedule Post'}
          </button>
        </div>
      </div>
    </div>
  );
}
