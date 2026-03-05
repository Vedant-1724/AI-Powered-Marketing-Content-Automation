import { useState } from 'react';
import {
  Megaphone, Plus, Calendar, MoreHorizontal,
  Play, Pause, Trash2, Eye, ChevronDown, X
} from 'lucide-react';

const DEMO_CAMPAIGNS = [
  { id: 1, name: 'Summer Sale Email Blast', type: 'EMAIL', status: 'ACTIVE', platforms: 'Email', impressions: 12400, clicks: 930, ctr: 7.5, scheduledAt: '2026-03-10', createdAt: '2026-02-28' },
  { id: 2, name: 'Product Launch — Instagram', type: 'SOCIAL_MEDIA', status: 'SCHEDULED', platforms: 'Instagram,Facebook', impressions: 0, clicks: 0, ctr: 0, scheduledAt: '2026-03-15', createdAt: '2026-03-01' },
  { id: 3, name: 'Q1 Newsletter Series', type: 'EMAIL', status: 'COMPLETED', platforms: 'Email', impressions: 45000, clicks: 3200, ctr: 7.1, scheduledAt: '2026-01-15', createdAt: '2026-01-10' },
  { id: 4, name: 'Brand Awareness — LinkedIn', type: 'AD', status: 'ACTIVE', platforms: 'LinkedIn', impressions: 8700, clicks: 520, ctr: 5.98, scheduledAt: '2026-03-01', createdAt: '2026-02-25' },
  { id: 5, name: 'Blog Content Series — SEO', type: 'BLOG', status: 'DRAFT', platforms: 'Blog,LinkedIn', impressions: 0, clicks: 0, ctr: 0, scheduledAt: null, createdAt: '2026-03-02' },
];

const STATUS_STYLES = {
  DRAFT: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  SCHEDULED: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  ACTIVE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  PAUSED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  COMPLETED: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  FAILED: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState(DEMO_CAMPAIGNS);
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState('ALL');

  const filtered = filter === 'ALL'
    ? campaigns
    : campaigns.filter((c) => c.status === filter);

  const statusCounts = {
    ALL: campaigns.length,
    ACTIVE: campaigns.filter((c) => c.status === 'ACTIVE').length,
    SCHEDULED: campaigns.filter((c) => c.status === 'SCHEDULED').length,
    DRAFT: campaigns.filter((c) => c.status === 'DRAFT').length,
    COMPLETED: campaigns.filter((c) => c.status === 'COMPLETED').length,
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <Megaphone className="w-9 h-9 text-blue-400" />
            Campaigns
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Manage and track all your marketing campaigns</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="btn-gradient flex items-center gap-2 text-sm px-6 py-3.5"
        >
          <Plus className="w-4 h-4" /> New Campaign
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 flex-wrap">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition ${filter === status
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              : 'bg-navy-700/30 text-slate-500 hover:text-slate-300 border border-transparent'
              }`}
          >
            {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()} ({count})
          </button>
        ))}
      </div>

      {/* Campaign Cards */}
      <div className="space-y-4">
        {filtered.map((campaign, i) => (
          <div
            key={campaign.id}
            className="glass-card p-5 flex items-center gap-6 animate-slide-in"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {/* Status indicator */}
            <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[campaign.status]}`}>
              {campaign.status}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold truncate">{campaign.name}</h3>
              <p className="text-slate-500 text-sm mt-0.5">
                {campaign.type.replace('_', ' ')} • {campaign.platforms}
                {campaign.scheduledAt && ` • Scheduled: ${campaign.scheduledAt}`}
              </p>
            </div>

            {/* Stats */}
            <div className="hidden md:flex gap-6 text-center">
              <div>
                <p className="text-xs text-slate-500">Impressions</p>
                <p className="text-sm font-bold text-white">{campaign.impressions.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Clicks</p>
                <p className="text-sm font-bold text-white">{campaign.clicks.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">CTR</p>
                <p className="text-sm font-bold text-emerald-400">{campaign.ctr}%</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-1">
              {campaign.status === 'ACTIVE' && (
                <button className="p-2 rounded-lg hover:bg-amber-500/10 text-slate-400 hover:text-amber-400 transition">
                  <Pause className="w-4 h-4" />
                </button>
              )}
              {(campaign.status === 'DRAFT' || campaign.status === 'PAUSED') && (
                <button className="p-2 rounded-lg hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 transition">
                  <Play className="w-4 h-4" />
                </button>
              )}
              <button className="p-2 rounded-lg hover:bg-blue-500/10 text-slate-400 hover:text-blue-400 transition">
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCampaigns(campaigns.filter((c) => c.id !== campaign.id))}
                className="p-2 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Megaphone className="w-12 h-12 mx-auto text-slate-600 mb-4" />
          <p className="text-slate-500">No campaigns found</p>
          <p className="text-slate-600 text-sm mt-1">Create your first campaign to get started</p>
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <CreateCampaignModal onClose={() => setShowCreate(false)} onCreate={(c) => {
          setCampaigns([{ id: Date.now(), ...c, impressions: 0, clicks: 0, ctr: 0, createdAt: new Date().toISOString() }, ...campaigns]);
          setShowCreate(false);
        }} />
      )}
    </div>
  );
}

function CreateCampaignModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    name: '', type: 'EMAIL', status: 'DRAFT', platforms: '', scheduledAt: '',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-card w-full max-w-lg p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Create Campaign</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Campaign Name *</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-dark"
              placeholder="e.g., Summer Sale Email Blast"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="input-dark"
            >
              <option value="EMAIL">Email Campaign</option>
              <option value="SOCIAL_MEDIA">Social Media</option>
              <option value="AD">Advertising</option>
              <option value="BLOG">Blog</option>
              <option value="MULTI_CHANNEL">Multi-Channel</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Platforms</label>
            <input
              value={form.platforms}
              onChange={(e) => setForm({ ...form, platforms: e.target.value })}
              className="input-dark"
              placeholder="e.g., Instagram, Facebook, Email"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Schedule Date</label>
            <input
              type="date"
              value={form.scheduledAt}
              onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
              className="input-dark"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-navy-700/50 text-slate-300 hover:bg-navy-600/50 transition font-medium">
            Cancel
          </button>
          <button
            onClick={() => onCreate(form)}
            disabled={!form.name}
            className="flex-1 btn-gradient py-3 disabled:opacity-50"
          >
            Create Campaign
          </button>
        </div>
      </div>
    </div>
  );
}
