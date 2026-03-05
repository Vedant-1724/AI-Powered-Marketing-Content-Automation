import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  BarChart3, Megaphone, Sparkles, MousePointerClick,
  Eye, TrendingUp, ArrowUpRight, Zap, Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCampaigns: 12,
    activeCampaigns: 4,
    totalContentGenerated: 87,
    totalImpressions: 24500,
    totalClicks: 1830,
    avgCtr: 7.47,
    subscriptionTier: user?.subscriptionTier || 'FREE',
  });

  const statCards = [
    { label: 'Total Campaigns', value: stats.totalCampaigns, icon: Megaphone, color: 'stat-card-blue', change: '+3' },
    { label: 'Active Campaigns', value: stats.activeCampaigns, icon: Zap, color: 'stat-card-emerald', change: '+1' },
    { label: 'Content Generated', value: stats.totalContentGenerated, icon: Sparkles, color: 'stat-card-violet', change: '+12' },
    { label: 'Total Impressions', value: stats.totalImpressions.toLocaleString(), icon: Eye, color: 'stat-card-amber', change: '+18%' },
    { label: 'Total Clicks', value: stats.totalClicks.toLocaleString(), icon: MousePointerClick, color: 'stat-card-rose', change: '+24%' },
    { label: 'Avg. CTR', value: `${stats.avgCtr}%`, icon: TrendingUp, color: 'stat-card-blue', change: '+0.8%' },
  ];

  const recentActivity = [
    { action: 'Generated blog post', detail: '"10 AI Marketing Trends in 2026"', time: '2 hours ago', type: 'content' },
    { action: 'Campaign launched', detail: 'Summer Sale Email Blast', time: '5 hours ago', type: 'campaign' },
    { action: 'Generated ad copy', detail: 'Product Launch — Facebook', time: '1 day ago', type: 'content' },
    { action: 'Campaign completed', detail: 'Q1 Newsletter Series', time: '2 days ago', type: 'campaign' },
    { action: 'Generated captions', detail: '5 Instagram captions for brand', time: '3 days ago', type: 'content' },
  ];

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Welcome back, <span className="gradient-text">{user?.fullName?.split(' ')[0] || 'there'}</span> 👋
          </h1>
          <p className="text-slate-400 mt-3 text-lg">Here's what's happening with your marketing today.</p>
        </div>
        <div className="flex gap-4">
          <Link to="/content-studio" className="btn-gradient flex items-center gap-2 text-sm px-6 py-3.5">
            <Sparkles className="w-4 h-4" /> Generate Content
          </Link>
          <Link
            to="/campaigns"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-navy-700/50 border border-blue-500/10 text-slate-300 hover:border-blue-500/30 transition text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> New Campaign
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map(({ label, value, icon: Icon, color, change }, i) => (
          <div
            key={label}
            className={`glass-card p-8 ${color} animate-fade-in`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-2">{label}</p>
                <p className="text-4xl font-bold text-white">{value}</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/10 to-violet-500/10 flex items-center justify-center">
                <Icon className="w-7 h-7 text-blue-400" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-5 text-emerald-400 text-sm">
              <ArrowUpRight className="w-3 h-3" />
              <span className="font-medium">{change}</span>
              <span className="text-slate-500">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="glass-card p-8">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { label: 'Write a Blog Post', icon: '📝', to: '/content-studio' },
              { label: 'Create Email Campaign', icon: '📧', to: '/content-studio' },
              { label: 'Generate Ad Copy', icon: '📣', to: '/content-studio' },
              { label: 'Social Media Captions', icon: '📱', to: '/content-studio' },
            ].map(({ label, icon, to }) => (
              <Link
                key={label}
                to={to}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-navy-700/50 transition group"
              >
                <span className="text-xl">{icon}</span>
                <span className="text-slate-300 group-hover:text-white transition">{label}</span>
                <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 ml-auto transition" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-8 lg:col-span-2">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map(({ action, detail, time, type }, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-3 rounded-xl hover:bg-navy-700/30 transition animate-slide-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${type === 'content' ? 'bg-violet-400' : 'bg-blue-400'
                  }`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 font-medium">{action}</p>
                  <p className="text-sm text-slate-500 truncate">{detail}</p>
                </div>
                <span className="text-xs text-slate-600 whitespace-nowrap">{time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subscription Banner */}
      {stats.subscriptionTier === 'FREE' && (
        <div className="glass-card p-8 bg-gradient-to-r from-blue-500/5 to-violet-500/5 border-blue-500/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Upgrade to Pro</h3>
              <p className="text-slate-400 text-sm mt-1">
                Unlock unlimited AI content generation, campaign automation, and advanced analytics.
              </p>
            </div>
            <button className="btn-gradient text-sm whitespace-nowrap">
              Upgrade — $29/mo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
