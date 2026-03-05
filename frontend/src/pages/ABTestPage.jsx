import { useState } from 'react';
import {
  FlaskConical, Plus, Play, Square, Trophy, X,
  BarChart3, TrendingUp, Target, Percent
} from 'lucide-react';

const DEMO_TESTS = [
  {
    id: 1, name: 'Email Subject Line Test', status: 'COMPLETED', campaignName: 'Summer Sale',
    variantASubject: '🔥 50% Off Everything — Today Only!', variantAContent: 'Urgency-based headline...',
    variantBSubject: '✨ Your Exclusive Summer Deal Awaits', variantBContent: 'Exclusivity-based headline...',
    variantAImpressions: 1200, variantAClicks: 156, variantAConversions: 18,
    variantBImpressions: 1200, variantBClicks: 108, variantBConversions: 11,
    winner: 'A', confidenceLevel: 97.2, splitPercentage: 50,
    startedAt: '2026-02-25', endedAt: '2026-03-01',
  },
  {
    id: 2, name: 'CTA Button Test', status: 'RUNNING', campaignName: 'Product Launch',
    variantASubject: null, variantAContent: 'Get Started Free →',
    variantBSubject: null, variantBContent: 'Start Your Free Trial',
    variantAImpressions: 450, variantAClicks: 52, variantAConversions: 6,
    variantBImpressions: 430, variantBClicks: 61, variantBConversions: 8,
    winner: null, confidenceLevel: 72.5, splitPercentage: 50,
    startedAt: '2026-03-02', endedAt: null,
  },
  {
    id: 3, name: 'Landing Page Headline', status: 'DRAFT', campaignName: 'Brand Awareness',
    variantASubject: null, variantAContent: 'AI Marketing Made Simple',
    variantBSubject: null, variantBContent: 'Automate Your Marketing with AI',
    variantAImpressions: 0, variantAClicks: 0, variantAConversions: 0,
    variantBImpressions: 0, variantBClicks: 0, variantBConversions: 0,
    winner: null, confidenceLevel: 0, splitPercentage: 50,
    startedAt: null, endedAt: null,
  },
];

const TEST_STATUS_STYLES = {
  DRAFT: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  RUNNING: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  COMPLETED: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  CANCELLED: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

export default function ABTestPage() {
  const [tests, setTests] = useState(DEMO_TESTS);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);

  const getCtr = (clicks, impressions) =>
    impressions > 0 ? (clicks / impressions * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <FlaskConical className="w-9 h-9 text-emerald-400" />
            A/B Testing
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Test content variations and optimize performance with data</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-gradient flex items-center gap-2 text-sm px-6 py-3.5">
          <Plus className="w-4 h-4" /> New Test
        </button>
      </div>

      {/* Test Cards */}
      <div className="space-y-5">
        {tests.map((test, i) => (
          <div
            key={test.id}
            className="glass-card p-6 animate-slide-in cursor-pointer hover:border-blue-500/20 transition"
            style={{ animationDelay: `${i * 80}ms` }}
            onClick={() => setSelectedTest(test)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-white">{test.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${TEST_STATUS_STYLES[test.status]}`}>
                  {test.status}
                </span>
                {test.winner && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                    <Trophy className="w-3 h-3" /> Winner: Variant {test.winner}
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-600">{test.campaignName}</span>
            </div>

            {/* Variant Comparison */}
            <div className="grid grid-cols-2 gap-4">
              {/* Variant A */}
              <div className={`p-4 rounded-xl border ${test.winner === 'A' ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-blue-500/10 bg-navy-800/30'
                }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-400 uppercase">Variant A</span>
                  {test.winner === 'A' && <Trophy className="w-4 h-4 text-amber-400" />}
                </div>
                <p className="text-sm text-slate-300 mb-3 line-clamp-2">
                  {test.variantASubject || test.variantAContent}
                </p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-[10px] text-slate-600">Impressions</p>
                    <p className="text-sm font-bold text-white">{test.variantAImpressions.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-600">Clicks</p>
                    <p className="text-sm font-bold text-white">{test.variantAClicks}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-600">CTR</p>
                    <p className="text-sm font-bold text-emerald-400">{getCtr(test.variantAClicks, test.variantAImpressions)}%</p>
                  </div>
                </div>
              </div>

              {/* Variant B */}
              <div className={`p-4 rounded-xl border ${test.winner === 'B' ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-blue-500/10 bg-navy-800/30'
                }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-violet-400 uppercase">Variant B</span>
                  {test.winner === 'B' && <Trophy className="w-4 h-4 text-amber-400" />}
                </div>
                <p className="text-sm text-slate-300 mb-3 line-clamp-2">
                  {test.variantBSubject || test.variantBContent}
                </p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-[10px] text-slate-600">Impressions</p>
                    <p className="text-sm font-bold text-white">{test.variantBImpressions.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-600">Clicks</p>
                    <p className="text-sm font-bold text-white">{test.variantBClicks}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-600">CTR</p>
                    <p className="text-sm font-bold text-emerald-400">{getCtr(test.variantBClicks, test.variantBImpressions)}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Confidence bar */}
            {test.confidenceLevel > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500">Statistical Confidence</span>
                  <span className={`text-xs font-bold ${test.confidenceLevel >= 95 ? 'text-emerald-400' :
                    test.confidenceLevel >= 80 ? 'text-amber-400' : 'text-slate-400'
                    }`}>{test.confidenceLevel}%</span>
                </div>
                <div className="h-2 rounded-full bg-navy-800">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${test.confidenceLevel >= 95 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
                      test.confidenceLevel >= 80 ? 'bg-gradient-to-r from-amber-500 to-amber-400' :
                        'bg-gradient-to-r from-blue-500 to-blue-400'
                      }`}
                    style={{ width: `${Math.min(test.confidenceLevel, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              {test.status === 'DRAFT' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); setTests(tests.map((t) =>
                      t.id === test.id ? {
                        ...t, status: 'RUNNING', startedAt: new Date().toISOString(),
                        variantAImpressions: 450, variantAClicks: 52, variantAConversions: 6,
                        variantBImpressions: 430, variantBClicks: 61, variantBConversions: 8,
                        confidenceLevel: 72.5,
                      } : t
                    ));
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-medium hover:bg-emerald-500/20 transition"
                >
                  <Play className="w-3.5 h-3.5" /> Start Test
                </button>
              )}
              {test.status === 'RUNNING' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); setTests(tests.map((t) =>
                      t.id === test.id ? {
                        ...t, status: 'COMPLETED', endedAt: new Date().toISOString(),
                        winner: t.variantAClicks > t.variantBClicks ? 'A' : 'B',
                        confidenceLevel: 95 + Math.random() * 4,
                      } : t
                    ));
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 text-sm font-medium hover:bg-violet-500/20 transition"
                >
                  <Square className="w-3.5 h-3.5" /> End Test
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <CreateTestModal onClose={() => setShowCreate(false)} onCreate={(test) => {
          setTests([{
            id: Date.now(), ...test, status: 'DRAFT',
            variantAImpressions: 0, variantAClicks: 0, variantAConversions: 0,
            variantBImpressions: 0, variantBClicks: 0, variantBConversions: 0,
            winner: null, confidenceLevel: 0, splitPercentage: 50,
            startedAt: null, endedAt: null, campaignName: 'New Campaign',
          }, ...tests]);
          setShowCreate(false);
        }} />
      )}
    </div>
  );
}

function CreateTestModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    name: '', variantAContent: '', variantASubject: '', variantBContent: '', variantBSubject: '',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-card w-full max-w-2xl p-6 animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Create A/B Test</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Test Name *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-dark" placeholder="e.g., Email Subject Line Test" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-blue-500/10 bg-navy-800/20">
              <h3 className="text-sm font-bold text-blue-400 uppercase mb-3">Variant A</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Subject / Headline</label>
                  <input value={form.variantASubject} onChange={(e) => setForm({ ...form, variantASubject: e.target.value })} className="input-dark text-sm" placeholder="Subject line A..." />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Content *</label>
                  <textarea value={form.variantAContent} onChange={(e) => setForm({ ...form, variantAContent: e.target.value })} className="input-dark text-sm min-h-[80px] resize-y" placeholder="Content variation A..." />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-violet-500/10 bg-navy-800/20">
              <h3 className="text-sm font-bold text-violet-400 uppercase mb-3">Variant B</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Subject / Headline</label>
                  <input value={form.variantBSubject} onChange={(e) => setForm({ ...form, variantBSubject: e.target.value })} className="input-dark text-sm" placeholder="Subject line B..." />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Content *</label>
                  <textarea value={form.variantBContent} onChange={(e) => setForm({ ...form, variantBContent: e.target.value })} className="input-dark text-sm min-h-[80px] resize-y" placeholder="Content variation B..." />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-navy-700/50 text-slate-300 hover:bg-navy-600/50 transition font-medium">Cancel</button>
          <button
            onClick={() => onCreate(form)}
            disabled={!form.name || !form.variantAContent || !form.variantBContent}
            className="flex-1 btn-gradient py-3 disabled:opacity-50"
          >
            Create Test
          </button>
        </div>
      </div>
    </div>
  );
}
