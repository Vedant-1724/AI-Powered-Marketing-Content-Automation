import { useState } from 'react';
import {
  Sparkles, Send, Copy, Heart, BookOpen, Mail,
  Megaphone, Instagram, Search, FileText, Package, ChevronDown
} from 'lucide-react';

const CONTENT_TYPES = [
  { id: 'blog', label: 'Blog Post', icon: BookOpen, color: 'from-blue-500 to-cyan-400' },
  { id: 'email', label: 'Email Campaign', icon: Mail, color: 'from-violet-500 to-purple-400' },
  { id: 'ad_copy', label: 'Ad Copy', icon: Megaphone, color: 'from-rose-500 to-pink-400' },
  { id: 'caption', label: 'Social Caption', icon: Instagram, color: 'from-amber-500 to-orange-400' },
  { id: 'seo_content', label: 'SEO Content', icon: Search, color: 'from-emerald-500 to-teal-400' },
  { id: 'headline', label: 'Headlines', icon: FileText, color: 'from-blue-400 to-indigo-400' },
  { id: 'product_description', label: 'Product Description', icon: Package, color: 'from-fuchsia-500 to-pink-400' },
];

const TONES = [
  { id: 'professional', label: '💼 Professional' },
  { id: 'casual', label: '😊 Casual' },
  { id: 'luxury', label: '✨ Luxury' },
  { id: 'bold', label: '🔥 Bold' },
  { id: 'friendly', label: '🤝 Friendly' },
  { id: 'urgent', label: '⚡ Urgent' },
  { id: 'inspirational', label: '🌟 Inspirational' },
];

const PLATFORMS = ['Instagram', 'Facebook', 'LinkedIn', 'Twitter', 'Email', 'Blog'];

export default function ContentStudioPage() {
  const [selectedType, setSelectedType] = useState('blog');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const [keywords, setKeywords] = useState('');
  const [audience, setAudience] = useState('');
  const [platform, setPlatform] = useState('');
  const [instructions, setInstructions] = useState('');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setGenerating(true);
    setResult(null);

    // Try to call the backend, fall back to demo
    try {
      const response = await fetch('/api/content/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('markai_token')}`,
        },
        body: JSON.stringify({
          contentType: selectedType,
          topic,
          tone,
          keywords: keywords ? keywords.split(',').map((k) => k.trim()) : [],
          targetAudience: audience || undefined,
          platform: platform || undefined,
          additionalInstructions: instructions || undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        // Demo fallback
        await new Promise((r) => setTimeout(r, 2000));
        setResult(getDemoResult(selectedType, topic, tone));
      }
    } catch {
      // Demo fallback
      await new Promise((r) => setTimeout(r, 2000));
      setResult(getDemoResult(selectedType, topic, tone));
    }

    setGenerating(false);
  };

  const copyToClipboard = () => {
    if (result?.content) {
      navigator.clipboard.writeText(result.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white flex items-center gap-3">
          <Sparkles className="w-9 h-9 text-violet-400" />
          AI Content Studio
        </h1>
        <p className="text-slate-400 mt-2 text-lg">
          Generate high-converting marketing content powered by AI
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* Left — Configuration Panel */}
        <div className="xl:col-span-2 space-y-6">
          {/* Content Type Selection */}
          <div className="glass-card p-6">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Content Type</h2>
            <div className="grid grid-cols-2 gap-2">
              {CONTENT_TYPES.map(({ id, label, icon: Icon, color }) => (
                <button
                  key={id}
                  onClick={() => setSelectedType(id)}
                  className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium transition-all ${selectedType === id
                    ? 'bg-gradient-to-r ' + color + ' text-white shadow-lg'
                    : 'bg-navy-700/30 text-slate-400 hover:bg-navy-700/50 hover:text-slate-200 border border-transparent hover:border-blue-500/10'
                    }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Topic & Settings */}
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Configuration</h2>

            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Topic / Subject *</label>
              <input
                id="content-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="input-dark"
                placeholder="e.g., AI Marketing Trends for Small Businesses"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Tone</label>
              <div className="flex flex-wrap gap-2">
                {TONES.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setTone(id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${tone === id
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-navy-700/30 text-slate-500 hover:text-slate-300 border border-transparent'
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1.5">SEO Keywords (comma separated)</label>
              <input
                id="content-keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="input-dark"
                placeholder="ai marketing, content automation, saas"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Target Audience</label>
              <input
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="input-dark"
                placeholder="Small business owners, age 25-45"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Platform</label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatform(platform === p ? '' : p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${platform === p
                      ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                      : 'bg-navy-700/30 text-slate-500 hover:text-slate-300 border border-transparent'
                      }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Additional Instructions</label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="input-dark min-h-[80px] resize-y"
                placeholder="Any specific requirements or style notes..."
              />
            </div>

            <button
              id="generate-content-btn"
              onClick={handleGenerate}
              disabled={!topic.trim() || generating}
              className="btn-gradient w-full py-3.5 flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Generating with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Content
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right — Output Panel */}
        <div className="xl:col-span-3">
          <div className="glass-card p-6 min-h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Generated Content</h2>
              {result && (
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-700/50 text-slate-400 hover:text-white text-xs transition"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-700/50 text-slate-400 hover:text-rose-400 text-xs transition">
                    <Heart className="w-3.5 h-3.5" />
                    Save
                  </button>
                </div>
              )}
            </div>

            {generating ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 animate-spin opacity-30"></div>
                    <div className="absolute inset-2 rounded-full bg-navy-800 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-violet-400 animate-pulse" />
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm">AI is crafting your content...</p>
                  <p className="text-slate-600 text-xs mt-1">This usually takes 2-5 seconds</p>
                </div>
              </div>
            ) : result ? (
              <div className="flex-1 space-y-4">
                {/* Content */}
                <div className="prose prose-invert max-w-none">
                  <div className="bg-navy-800/50 rounded-xl p-6 border border-blue-500/5 whitespace-pre-wrap text-slate-200 text-sm leading-relaxed font-mono">
                    {result.content}
                  </div>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-navy-800/30">
                    <p className="text-xs text-slate-500">Word Count</p>
                    <p className="text-lg font-bold text-white">{result.wordCount || result.word_count}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-navy-800/30">
                    <p className="text-xs text-slate-500">SEO Score</p>
                    <p className="text-lg font-bold text-emerald-400">{result.seoScore || result.seo_score || 0}/100</p>
                  </div>
                  <div className="p-3 rounded-xl bg-navy-800/30">
                    <p className="text-xs text-slate-500">Tone</p>
                    <p className="text-lg font-bold text-violet-300 capitalize">{result.tone}</p>
                  </div>
                </div>

                {/* Suggestions */}
                {result.suggestions && result.suggestions.length > 0 && (
                  <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                    <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">💡 AI Suggestions</h3>
                    <ul className="space-y-1">
                      {result.suggestions.map((s, i) => (
                        <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                          <span className="text-blue-400 mt-0.5">•</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-violet-500/10 flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-slate-600" />
                  </div>
                  <p className="text-slate-500 text-sm">Select a content type, write your topic, and click Generate</p>
                  <p className="text-slate-600 text-xs mt-1">AI will create optimized content in seconds</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Demo content generator for when backend isn't running
function getDemoResult(type, topic, tone) {
  const demoContents = {
    blog: `# ${topic}: A Complete Guide\n\n## Why This Matters in 2026\n\nIn today's digital landscape, ${topic} has become critical for businesses looking to stay competitive.\n\n## Key Strategies\n\n### 1. Start with Your Audience\nSuccessful approaches begin with deep audience understanding.\n\n### 2. Leverage AI-Powered Tools\nModern AI tools can automate tasks and generate personalized content at scale.\n\n### 3. Measure What Matters\nFocus on KPIs that directly impact your bottom line.\n\n## Conclusion\n\n${topic} isn't just a trend — it's the future. Start your journey today!\n\n*Generated by MarkAI*`,
    email: `Subject: 🚀 Unlock the Power of ${topic}\n\nHi {{first_name}},\n\nWe've discovered something game-changing about ${topic}.\n\nHere's what you'll get:\n• ✅ Increased Engagement — Up to 3x more interactions\n• ✅ Time Savings — Automate 80% of tasks\n• ✅ Better ROI — 40% improvement in performance\n\n[Start Your Free Trial Now →]\n\nBest,\nThe MarkAI Team`,
    ad_copy: `🔥 Stop wasting time on ${topic} that doesn't convert.\n\nWe built an AI that:\n→ Generates high-converting content in seconds\n→ Personalizes every campaign for YOUR audience\n→ Optimizes performance automatically\n\n🎯 Try it FREE for 14 days.\n\n[Get Started Now →]`,
    caption: `✨ Here's what top brands know about ${topic} 👇\n\nThe secret isn't working harder — it's working smarter with AI. 🚀\n\nReady to level up? Link in bio 🔗\n\n#AIMarketing #ContentAutomation #DigitalMarketing #MarketingAI #Growth`,
    seo_content: `# The Ultimate Guide to ${topic}\n\nMeta: Discover proven strategies for ${topic}. Learn how AI tools boost results by 3x.\n\n## What is ${topic}?\n\nOne of the most impactful strategies in modern digital marketing.\n\n## Why It's Essential\n\n### Increased Visibility\n50-100% organic traffic growth in 6 months.\n\n### Better Engagement\n2-3x higher engagement rates.\n\n## How to Get Started\n\n1. Audit your current approach\n2. Define clear goals\n3. Implement AI tools\n4. Monitor and optimize`,
    headline: `1. "How ${topic} is Changing the Game for Small Businesses"\n2. "7 Proven Strategies That Boost Revenue by 300%"\n3. "Is Your Business Missing Out? Here's How to Fix It"\n4. "The Ultimate Playbook: From Zero to Hero"\n5. "Why Smart Businesses are Investing Right Now"\n6. "Made Simple: A Step-by-Step Guide"\n7. "New Trends That Will Dominate 2026"\n8. "Stop Guessing: Use AI to Master This Today"\n9. "From $0 to $1M: How Brands Transformed"\n10. "The Secret No One is Talking About"`,
    product_description: `## ${topic}\n\n**Transform your marketing with AI.**\n\n### Key Features:\n• 🤖 AI Content Generator — Blog posts, emails, ads in seconds\n• 📊 Smart Analytics — Know what's working\n• 🚀 Campaign Automation — Set it and forget it\n• 🎯 Personalization Engine — Tailored messages\n\n### Why Choose Us?\n\nTrusted by 10,000+ businesses | 4.9/5 rating\n\n🎁 Try Free for 14 Days\n\n[Start Now →]`,
  };

  const content = demoContents[type] || demoContents.blog;
  return {
    content,
    contentType: type,
    tone,
    wordCount: content.split(/\s+/).length,
    seoScore: Math.floor(Math.random() * 20) + 70,
    keywordsUsed: ['ai', 'marketing', 'automation'],
    suggestions: [
      'Consider A/B testing different headlines for higher CTR',
      'Add more target keywords naturally throughout the content',
      'Post during peak engagement hours for better reach',
    ],
  };
}
