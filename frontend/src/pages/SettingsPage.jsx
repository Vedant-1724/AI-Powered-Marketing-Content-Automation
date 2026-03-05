import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings, Building2, Globe, Palette, Upload, Save, Check } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [brand, setBrand] = useState({
    brandName: user?.companyName || '',
    websiteUrl: '',
    industry: '',
    brandVoice: '',
    targetAudience: '',
    description: '',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-10 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white flex items-center gap-3">
          <Settings className="w-9 h-9 text-slate-400" />
          Settings
        </h1>
        <p className="text-slate-400 mt-2 text-lg">Manage your account and brand profile</p>
      </div>

      {/* Account Info */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          Account Information
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Full Name</label>
            <input className="input-dark" value={user?.fullName || ''} readOnly />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Email</label>
            <input className="input-dark" value={user?.email || ''} readOnly />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Subscription</label>
            <div className="input-dark flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500/20 to-violet-500/20 text-blue-300 border border-blue-500/20">
                {user?.subscriptionTier || 'FREE'}
              </span>
              <span className="text-slate-500">Plan</span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Tenant ID</label>
            <input className="input-dark text-slate-600 text-xs" value={user?.tenantId || ''} readOnly />
          </div>
        </div>
      </div>

      {/* Brand Profile */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-violet-400" />
          Brand Profile
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          This powers RAG-based AI personalization. The more you fill in, the better your content.
        </p>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Brand Name</label>
              <input
                className="input-dark"
                value={brand.brandName}
                onChange={(e) => setBrand({ ...brand, brandName: e.target.value })}
                placeholder="Acme Inc."
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Website URL</label>
              <input
                className="input-dark"
                value={brand.websiteUrl}
                onChange={(e) => setBrand({ ...brand, websiteUrl: e.target.value })}
                placeholder="https://acme.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Industry</label>
            <select
              className="input-dark"
              value={brand.industry}
              onChange={(e) => setBrand({ ...brand, industry: e.target.value })}
            >
              <option value="">Select Industry...</option>
              <option value="technology">Technology</option>
              <option value="ecommerce">E-Commerce</option>
              <option value="healthcare">Healthcare</option>
              <option value="finance">Finance</option>
              <option value="education">Education</option>
              <option value="food">Food & Beverage</option>
              <option value="fashion">Fashion & Beauty</option>
              <option value="real_estate">Real Estate</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Brand Voice & Style</label>
            <textarea
              className="input-dark min-h-[80px] resize-y"
              value={brand.brandVoice}
              onChange={(e) => setBrand({ ...brand, brandVoice: e.target.value })}
              placeholder="e.g., Professional but approachable, uses data-driven insights, avoids jargon..."
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Target Audience</label>
            <input
              className="input-dark"
              value={brand.targetAudience}
              onChange={(e) => setBrand({ ...brand, targetAudience: e.target.value })}
              placeholder="Small business owners, age 25-55, tech-savvy"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Brand Description</label>
            <textarea
              className="input-dark min-h-[100px] resize-y"
              value={brand.description}
              onChange={(e) => setBrand({ ...brand, description: e.target.value })}
              placeholder="Describe your brand, products, and unique value proposition..."
            />
          </div>

          <button
            onClick={handleSave}
            className="btn-gradient flex items-center gap-2 text-sm"
          >
            {saved ? (
              <><Check className="w-4 h-4" /> Saved!</>
            ) : (
              <><Save className="w-4 h-4" /> Save Brand Profile</>
            )}
          </button>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Subscription Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[
            { name: 'Free', price: '$0', features: ['5 AI generations/day', '1 campaign', 'Basic analytics'] },
            { name: 'Pro', price: '$29', features: ['100 AI generations/day', '10 campaigns', 'Full analytics', 'Email scheduling'] },
            { name: 'Growth', price: '$79', features: ['Unlimited generations', 'Unlimited campaigns', 'A/B testing', 'Social automation'] },
            { name: 'Enterprise', price: '$199', features: ['Everything in Growth', 'API access', 'Custom AI models', 'Priority support'] },
          ].map(({ name, price, features }) => (
            <div
              key={name}
              className={`p-4 rounded-xl border transition ${user?.subscriptionTier === name.toUpperCase()
                ? 'border-blue-500/30 bg-blue-500/5'
                : 'border-blue-500/5 bg-navy-800/30 hover:border-blue-500/20'
                }`}
            >
              <h3 className="font-semibold text-white">{name}</h3>
              <p className="text-2xl font-bold gradient-text mt-1">{price}<span className="text-sm text-slate-500 font-normal">/mo</span></p>
              <ul className="mt-3 space-y-1.5">
                {features.map((f) => (
                  <li key={f} className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-emerald-400" /> {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full mt-3 py-2 rounded-lg text-xs font-medium transition ${user?.subscriptionTier === name.toUpperCase()
                ? 'bg-blue-500/20 text-blue-300 cursor-default'
                : 'bg-navy-700/50 text-slate-400 hover:text-white hover:bg-navy-600/50'
                }`}>
                {user?.subscriptionTier === name.toUpperCase() ? 'Current Plan' : 'Upgrade'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
