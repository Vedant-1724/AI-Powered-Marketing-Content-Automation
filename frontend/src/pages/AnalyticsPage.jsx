import { useState, useEffect } from 'react';
import {
  BarChart3, TrendingUp, Eye, MousePointerClick, DollarSign, Target,
  ArrowUpRight, ArrowDownRight, Lightbulb, Clock, Zap, Award,
  Brain, ChevronDown, RefreshCw
} from 'lucide-react';

// ─── Demo Data ─────────────────────────────────────────────

function generateTrend(days, min, max) {
  const data = [];
  const seed = 42;
  let prev = (min + max) / 2;
  for (let i = days; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const val = min + Math.floor(((Math.sin(seed + i * 0.5) + 1) / 2) * (max - min));
    const change = prev > 0 ? ((val - prev) / prev * 100) : 0;
    data.push({ date: d.toISOString().split('T')[0], value: val, change: Math.round(change * 10) / 10 });
    prev = val;
  }
  return data;
}

const DEMO_DATA = {
  totalImpressions: 50700,
  totalClicks: 3799,
  totalConversions: 342,
  overallCtr: 7.49,
  conversionRate: 9.0,
  estimatedRevenue: 8379.0,
  impressionsTrend: generateTrend(30, 800, 2500),
  clicksTrend: generateTrend(30, 50, 200),
  ctrTrend: generateTrend(30, 400, 1200),
  channelBreakdown: {
    EMAIL: { channel: 'EMAIL', impressions: 15000, clicks: 1125, ctr: 7.5, campaigns: 4 },
    SOCIAL_MEDIA: { channel: 'SOCIAL_MEDIA', impressions: 22000, clicks: 1540, ctr: 7.0, campaigns: 5 },
    AD: { channel: 'AD', impressions: 8500, clicks: 510, ctr: 6.0, campaigns: 2 },
    BLOG: { channel: 'BLOG', impressions: 5200, clicks: 624, ctr: 12.0, campaigns: 3 },
  },
  topCampaigns: [
    { id: 1, name: 'SEO Blog Series', type: 'BLOG', status: 'ACTIVE', impressions: 8200, clicks: 984, ctr: 12.0, conversions: 98, score: 87.5 },
    { id: 2, name: 'Summer Sale Email', type: 'EMAIL', status: 'COMPLETED', impressions: 12400, clicks: 930, ctr: 7.5, conversions: 84, score: 78.2 },
    { id: 3, name: 'LinkedIn Brand Awareness', type: 'AD', status: 'ACTIVE', impressions: 8700, clicks: 520, ctr: 5.98, conversions: 41, score: 65.0 },
    { id: 4, name: 'Instagram Product Launch', type: 'SOCIAL_MEDIA', status: 'SCHEDULED', impressions: 6500, clicks: 455, ctr: 7.0, conversions: 32, score: 58.3 },
    { id: 5, name: 'Newsletter Q1 Recap', type: 'EMAIL', status: 'COMPLETED', impressions: 4500, clicks: 315, ctr: 7.0, conversions: 28, score: 52.1 },
  ],
  aiInsights: [
    '🎯 Your overall CTR of 7.49% exceeds the industry average of 3.17%. Keep up the strong targeting.',
    '🚀 You have 3 active campaign(s) generating 50,700 impressions. Peak engagement hours are 9-11 AM and 7-9 PM.',
    '📈 Blog content campaigns show 70% higher CTR than average. Consider increasing blog output.',
    '⏰ Posts published on Tuesday and Thursday outperform other days by 23%.',
    '💡 Campaigns with AI-generated content show 2.3x higher engagement vs manually written content.',
  ],
  recommendations: [
    'Run an A/B test on your top-performing campaign\'s CTA button — even a 2% lift can significantly impact conversions.',
    'Schedule social media posts at 10:00 AM EST on Tuesdays for maximum reach based on your audience data.',
    'Create more blog content — your blog campaigns consistently outperform other channels.',
    'Segment your email list by engagement level — re-engage inactive subscribers with a win-back campaign.',
    'Enable the AI content optimizer to automatically refine underperforming campaign copy.',
  ],
  bestSendTimes: { Monday: 10.0, Tuesday: 9.5, Wednesday: 11.0, Thursday: 10.0, Friday: 14.0, Saturday: 11.0, Sunday: 10.5 },
};

const CHANNEL_COLORS = {
  EMAIL: 'from-violet-500 to-purple-400',
  SOCIAL_MEDIA: 'from-pink-500 to-rose-400',
  AD: 'from-amber-500 to-orange-400',
  BLOG: 'from-emerald-500 to-teal-400',
  MULTI_CHANNEL: 'from-blue-500 to-cyan-400',
};

const CHANNEL_LABELS = {
  EMAIL: '📧 Email', SOCIAL_MEDIA: '📱 Social Media', AD: '📣 Advertising',
  BLOG: '📝 Blog', MULTI_CHANNEL: '🔗 Multi-Channel',
};

const GRADE_COLORS = {
  'A+': 'text-emerald-400', A: 'text-emerald-400', 'B+': 'text-blue-400',
  B: 'text-blue-400', C: 'text-amber-400', D: 'text-rose-400', F: 'text-rose-500',
};

// ─── Mini Bar Chart ─────────────────────────────────────────

function MiniChart({ data, color = 'bg-blue-500', height = 48 }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map((d) => d.value), 1);
  const lastN = data.slice(-20);

  return (
    <div className="flex items-end gap-[2px]" style={{ height }}>
      {lastN.map((d, i) => (
        <div
          key={i}
          className={`flex-1 rounded-t-sm ${color} opacity-60 hover:opacity-100 transition-all`}
          style={{ height: `${(d.value / max) * 100}%`, minWidth: '3px' }}
          title={`${d.date}: ${d.value.toLocaleString()}`}
        ></div>
      ))}
    </div>
  );
}

// ─── Progress Bar ────────────────────────────────────────────

function ProgressBar({ value, max = 100, color = 'from-blue-500 to-violet-500' }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="h-2 rounded-full bg-navy-800 overflow-hidden">
      <div
        className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
        style={{ width: `${pct}%` }}
      ></div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────

export default function AnalyticsPage() {
  const [data, setData] = useState(DEMO_DATA);
  const [dateRange, setDateRange] = useState(30);

  const kpis = [
    { label: 'Total Impressions', value: data.totalImpressions.toLocaleString(), icon: Eye, change: '+18.3%', up: true, color: 'stat-card-blue' },
    { label: 'Total Clicks', value: data.totalClicks.toLocaleString(), icon: MousePointerClick, change: '+24.1%', up: true, color: 'stat-card-violet' },
    { label: 'Conversion Rate', value: `${data.conversionRate}%`, icon: Target, change: '+2.1%', up: true, color: 'stat-card-emerald' },
    { label: 'CTR', value: `${data.overallCtr}%`, icon: TrendingUp, change: '+0.8%', up: true, color: 'stat-card-amber' },
    { label: 'Conversions', value: data.totalConversions.toLocaleString(), icon: Zap, change: '+31', up: true, color: 'stat-card-rose' },
    { label: 'Est. Revenue', value: `$${data.estimatedRevenue.toLocaleString()}`, icon: DollarSign, change: '+12.5%', up: true, color: 'stat-card-blue' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <BarChart3 className="w-9 h-9 text-blue-400" />
            Analytics Dashboard
          </h1>
          <p className="text-slate-400 mt-2 text-lg">AI-powered performance insights and optimization</p>
        </div>
        <div className="flex gap-2">
          {[7, 14, 30].map((d) => (
            <button
              key={d}
              onClick={() => setDateRange(d)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${dateRange === d
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'bg-navy-700/30 text-slate-500 hover:text-slate-300 border border-transparent'
                }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map(({ label, value, icon: Icon, change, up, color }, i) => (
          <div
            key={label}
            className={`glass-card p-7 ${color} animate-fade-in`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-center justify-between mb-2">
              <Icon className="w-4 h-4 text-slate-400" />
              <span className={`text-xs font-medium flex items-center gap-0.5 ${up ? 'text-emerald-400' : 'text-rose-400'}`}>
                {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {change}
              </span>
            </div>
            <p className="text-lg font-bold text-white">{value}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Trend Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Impressions Trend', data: data.impressionsTrend, color: 'bg-blue-500' },
          { label: 'Clicks Trend', data: data.clicksTrend, color: 'bg-violet-500' },
          { label: 'CTR Trend', data: data.ctrTrend, color: 'bg-emerald-500' },
        ].map(({ label, data: trendData, color }) => (
          <div key={label} className="glass-card p-5">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">{label}</h3>
            <MiniChart data={trendData} color={color} height={64} />
            <div className="flex justify-between mt-2 text-[10px] text-slate-600">
              <span>{trendData[0]?.date}</span>
              <span>{trendData[trendData.length - 1]?.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Channel Breakdown + Top Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Channel Breakdown */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" /> Channel Performance
          </h2>
          <div className="space-y-4">
            {Object.values(data.channelBreakdown).map((ch) => {
              const totalImp = data.totalImpressions || 1;
              const pct = (ch.impressions / totalImp * 100).toFixed(1);
              return (
                <div key={ch.channel}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-slate-300">{CHANNEL_LABELS[ch.channel] || ch.channel}</span>
                    <span className="text-xs text-slate-500">{pct}% of total</span>
                  </div>
                  <ProgressBar value={Number(pct)} color={CHANNEL_COLORS[ch.channel] || 'from-blue-500 to-violet-500'} />
                  <div className="flex gap-4 mt-1.5 text-[10px] text-slate-600">
                    <span>{ch.impressions.toLocaleString()} impressions</span>
                    <span>{ch.clicks.toLocaleString()} clicks</span>
                    <span className="text-emerald-400 font-medium">{ch.ctr}% CTR</span>
                    <span>{ch.campaigns} campaigns</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Campaigns */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" /> Top Performing Campaigns
          </h2>
          <div className="space-y-3">
            {data.topCampaigns.map((c, i) => {
              const grade = c.score >= 80 ? 'A' : c.score >= 70 ? 'B+' : c.score >= 60 ? 'B' : c.score >= 40 ? 'C' : 'D';
              return (
                <div key={c.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-navy-700/30 transition">
                  <span className="text-lg font-bold text-slate-600 w-6">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white truncate">{c.name}</h4>
                    <p className="text-[10px] text-slate-500">{c.type} • {c.status}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500">CTR</p>
                    <p className="text-sm font-bold text-emerald-400">{c.ctr}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Score</p>
                    <p className={`text-sm font-bold ${GRADE_COLORS[grade]}`}>{c.score}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${grade === 'A' || grade === 'A+' ? 'bg-emerald-500/10 text-emerald-400' :
                    grade === 'B+' || grade === 'B' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-amber-500/10 text-amber-400'
                    }`}>{grade}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Insights + Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Insights */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-violet-400" /> AI Insights
          </h2>
          <div className="space-y-3">
            {data.aiInsights.map((insight, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-navy-800/30 text-sm text-slate-300 animate-slide-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {insight}
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" /> AI Recommendations
          </h2>
          <div className="space-y-3">
            {data.recommendations.map((rec, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 animate-slide-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[10px] text-blue-400 font-bold">{i + 1}</span>
                </div>
                <p className="text-sm text-slate-300">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Best Send Times */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" /> Smart Send-Time Optimization
        </h2>
        <p className="text-sm text-slate-500 mb-4">AI-recommended best times to publish for maximum engagement</p>
        <div className="grid grid-cols-7 gap-2">
          {Object.entries(data.bestSendTimes).map(([day, hour]) => {
            const isHighlight = hour <= 10;
            return (
              <div
                key={day}
                className={`p-4 rounded-xl text-center transition ${isHighlight
                  ? 'bg-gradient-to-br from-blue-500/10 to-violet-500/10 border border-blue-500/20'
                  : 'bg-navy-800/30'
                  }`}
              >
                <p className="text-xs text-slate-400 font-medium">{day.slice(0, 3)}</p>
                <p className={`text-lg font-bold mt-1 ${isHighlight ? 'text-blue-400' : 'text-white'}`}>
                  {Math.floor(hour)}:{(hour % 1 * 60).toString().padStart(2, '0')}
                </p>
                <p className="text-[10px] text-slate-600 mt-0.5">
                  {hour <= 10 ? '🔥 Peak' : 'Good'}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
