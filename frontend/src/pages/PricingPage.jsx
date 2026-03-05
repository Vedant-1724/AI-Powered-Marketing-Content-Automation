import { useState, useEffect, useMemo } from 'react';
import {
  Sparkles, Check, X, Crown, Zap, Star, ArrowRight,
  Globe, Shield, ChevronDown, Rocket, CreditCard
} from 'lucide-react';

// ─── Currency & Country Maps ────────────────────────────────

const COUNTRY_CURRENCY = {
  US: 'USD', GB: 'GBP', IN: 'INR', CA: 'CAD', AU: 'AUD', JP: 'JPY',
  CN: 'CNY', BR: 'BRL', MX: 'MXN', SG: 'SGD', AE: 'AED', ZA: 'ZAR',
  KR: 'KRW', TH: 'THB', ID: 'IDR', PH: 'PHP', MY: 'MYR', SA: 'SAR',
  NG: 'NGN', DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR',
};

const CURRENCY_SYMBOLS = {
  USD: '$', EUR: '€', GBP: '£', INR: '₹', CAD: 'C$', AUD: 'A$',
  JPY: '¥', CNY: '¥', BRL: 'R$', MXN: 'MX$', SGD: 'S$', AED: 'د.إ',
  ZAR: 'R', KRW: '₩', THB: '฿', IDR: 'Rp', PHP: '₱', MYR: 'RM',
  SAR: '﷼', NGN: '₦',
};

const CURRENCY_RATES = {
  USD: 1, EUR: 0.92, GBP: 0.79, INR: 83.5, CAD: 1.36, AUD: 1.53,
  JPY: 149.5, CNY: 7.24, BRL: 4.97, MXN: 17.15, SGD: 1.34, AED: 3.67,
  ZAR: 18.6, KRW: 1320, THB: 35.5, IDR: 15600, PHP: 56.2, MYR: 4.72,
  SAR: 3.75, NGN: 1550,
};

const COUNTRY_NAMES = {
  US: 'United States', GB: 'United Kingdom', IN: 'India', CA: 'Canada',
  AU: 'Australia', JP: 'Japan', CN: 'China', BR: 'Brazil', MX: 'Mexico',
  SG: 'Singapore', AE: 'UAE', ZA: 'South Africa', KR: 'South Korea',
  TH: 'Thailand', ID: 'Indonesia', PH: 'Philippines', MY: 'Malaysia',
  SA: 'Saudi Arabia', NG: 'Nigeria', DE: 'Germany', FR: 'France',
  IT: 'Italy', ES: 'Spain', NL: 'Netherlands',
};

const PLAN_BASE_USD = {
  FREE: { monthly: 0, yearly: 0 },
  STARTER: { monthly: 19, yearly: 190 },
  PROFESSIONAL: { monthly: 49, yearly: 490 },
  ENTERPRISE: { monthly: 129, yearly: 1290 },
};

const PLANS = [
  {
    id: 'FREE', name: 'Free', description: 'Get started with basic features',
    icon: Zap, color: 'from-slate-500 to-slate-400', borderColor: 'border-slate-500/20',
    features: ['10 AI content generations/mo', '3 campaigns', '100 emails/mo', '10 scheduled posts', 'Basic analytics', 'Community support'],
    limits: '10 AI generations',
  },
  {
    id: 'STARTER', name: 'Starter', description: 'Perfect for small businesses',
    icon: Rocket, color: 'from-blue-500 to-cyan-400', borderColor: 'border-blue-500/20',
    features: ['100 AI content generations/mo', '15 campaigns', '1,000 emails/mo', '50 scheduled posts', 'Advanced analytics', 'A/B testing', 'Social media integration', 'Email support'],
    limits: '100 AI generations',
  },
  {
    id: 'PROFESSIONAL', name: 'Professional', description: 'For growing teams', popular: true,
    icon: Crown, color: 'from-violet-500 to-purple-400', borderColor: 'border-violet-500/30',
    features: ['Unlimited AI content', 'Unlimited campaigns', '10,000 emails/mo', 'Unlimited scheduled posts', 'AI optimizer & CTR prediction', 'Smart send-time optimization', 'Custom brand voice (RAG)', 'Priority support', 'API access'],
    limits: 'Unlimited',
  },
  {
    id: 'ENTERPRISE', name: 'Enterprise', description: 'Full-scale marketing ops',
    icon: Shield, color: 'from-amber-500 to-orange-400', borderColor: 'border-amber-500/20',
    features: ['Everything in Professional', '50,000 emails/mo', 'Dedicated account manager', 'Custom AI model training', 'White-label options', 'SSO & SAML', 'SLA guarantee', '24/7 phone support', 'Custom integrations'],
    limits: 'Full custom',
  },
];

function convertPrice(usdPrice, currency) {
  const rate = CURRENCY_RATES[currency] || 1;
  const converted = usdPrice * rate;
  if (rate > 100) return Math.round(converted / 10) * 10;
  return Math.round(converted * 100) / 100;
}

function formatPrice(amount, symbol, currency) {
  if (amount === 0) return 'Free';
  if (currency === 'JPY' || currency === 'KRW' || currency === 'IDR')
    return `${symbol}${Math.round(amount).toLocaleString()}`;
  return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

// ─── Animated Number ─────────────────────────────────────────

function AnimatedNumber({ value, symbol, currency }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (value === 0) { setDisplay(0); return; }
    let start = 0;
    const duration = 600;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = value / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(Math.round(start));
    }, stepTime);
    return () => clearInterval(timer);
  }, [value]);

  return <span>{formatPrice(display, symbol, currency)}</span>;
}

// ─── Main Page ───────────────────────────────────────────────

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const [country, setCountry] = useState('US');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [activePlan, setActivePlan] = useState('FREE');
  const [showCheckout, setShowCheckout] = useState(null);

  // Auto-detect country from timezone
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const tzMap = {
        'Asia/Kolkata': 'IN', 'Asia/Calcutta': 'IN', 'America/New_York': 'US',
        'America/Los_Angeles': 'US', 'America/Chicago': 'US', 'Europe/London': 'GB',
        'Europe/Berlin': 'DE', 'Europe/Paris': 'FR', 'Asia/Tokyo': 'JP',
        'Asia/Singapore': 'SG', 'Asia/Dubai': 'AE', 'Australia/Sydney': 'AU',
        'America/Toronto': 'CA', 'America/Sao_Paulo': 'BR', 'Asia/Seoul': 'KR',
        'Africa/Lagos': 'NG', 'Africa/Johannesburg': 'ZA', 'Asia/Bangkok': 'TH',
        'Asia/Jakarta': 'ID', 'Asia/Manila': 'PH', 'Asia/Kuala_Lumpur': 'MY',
        'Asia/Riyadh': 'SA', 'America/Mexico_City': 'MX', 'Europe/Amsterdam': 'NL',
        'Europe/Madrid': 'ES', 'Europe/Rome': 'IT',
      };
      const detected = tzMap[tz];
      if (detected) setCountry(detected);
    } catch { /* fallback to US */ }
  }, []);

  const currency = COUNTRY_CURRENCY[country] || 'USD';
  const symbol = CURRENCY_SYMBOLS[currency] || '$';

  const savings = yearly ? 17 : 0; // ~17% savings

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Hero Header */}
      <div className="text-center py-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-4 animate-bounce-in">
          <Sparkles className="w-4 h-4" /> Choose Your Plan
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white animate-slide-up">
          Supercharge Your <span className="gradient-text">Marketing</span>
        </h1>
        <p className="text-slate-400 mt-3 text-lg max-w-2xl mx-auto animate-slide-up delay-200" style={{ animationFillMode: 'both' }}>
          Unlock AI-powered content, automation, and analytics. Start free, upgrade when you're ready.
        </p>

        {/* Country + Currency */}
        <div className="flex items-center justify-center gap-4 mt-6 animate-slide-up delay-300" style={{ animationFillMode: 'both' }}>
          <div className="relative">
            <button
              onClick={() => setShowCountryPicker(!showCountryPicker)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-700/50 border border-blue-500/10 text-sm text-slate-300 hover:border-blue-500/30 transition"
            >
              <Globe className="w-4 h-4 text-blue-400" />
              {COUNTRY_NAMES[country]} ({symbol} {currency})
              <ChevronDown className="w-3 h-3" />
            </button>
            {showCountryPicker && (
              <div className="absolute top-full mt-2 left-0 w-64 max-h-64 overflow-y-auto rounded-xl glass-card p-2 z-50 animate-scale-in">
                {Object.entries(COUNTRY_NAMES).map(([code, name]) => (
                  <button
                    key={code}
                    onClick={() => { setCountry(code); setShowCountryPicker(false); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${country === code ? 'bg-blue-500/20 text-blue-300' : 'text-slate-400 hover:bg-navy-700/50 hover:text-white'
                      }`}
                  >
                    {name} <span className="text-slate-600">({CURRENCY_SYMBOLS[COUNTRY_CURRENCY[code]] || '$'})</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3 mt-5 animate-slide-up delay-400" style={{ animationFillMode: 'both' }}>
          <div className="pricing-toggle flex">
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2.5 text-sm transition-all ${!yearly ? 'pricing-toggle-active' : 'text-slate-400 hover:text-white'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2.5 text-sm transition-all flex items-center gap-1.5 ${yearly ? 'pricing-toggle-active' : 'text-slate-400 hover:text-white'}`}
            >
              Yearly
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">-17%</span>
            </button>
          </div>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PLANS.map((plan, i) => {
          const Icon = plan.icon;
          const basePrices = PLAN_BASE_USD[plan.id];
          const price = convertPrice(yearly ? basePrices.yearly / 12 : basePrices.monthly, currency);
          const totalYearly = convertPrice(basePrices.yearly, currency);
          const isActive = activePlan === plan.id;
          const isPopular = plan.popular;

          return (
            <div
              key={plan.id}
              className={`relative animate-slide-up ${isPopular ? 'popular-glow' : ''}`}
              style={{ animationDelay: `${i * 120 + 200}ms`, animationFillMode: 'both' }}
            >
              {/* Popular badge */}
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-4 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/30 flex items-center gap-1">
                    <Star className="w-3 h-3" /> MOST POPULAR
                  </span>
                </div>
              )}

              <div className={`glass-card-premium p-6 h-full flex flex-col ${isPopular ? 'border-violet-500/30' : ''
                } ${isActive ? 'ring-2 ring-blue-500/30' : ''}`}>
                {/* Plan header */}
                <div className="mb-5">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-3 animate-float`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white">
                      <AnimatedNumber value={price} symbol={symbol} currency={currency} />
                    </span>
                    {price > 0 && <span className="text-slate-500 text-sm">/mo</span>}
                  </div>
                  {yearly && price > 0 && (
                    <p className="text-xs text-slate-600 mt-1">
                      {formatPrice(totalYearly, symbol, currency)} billed annually
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="flex-1 space-y-2.5 mb-6">
                  {plan.features.map((feature, fi) => (
                    <div key={fi} className="flex items-start gap-2">
                      <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isPopular ? 'text-violet-400' : 'text-emerald-400'
                        }`} />
                      <span className="text-sm text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => {
                    if (plan.id === 'FREE') { setActivePlan('FREE'); }
                    else { setShowCheckout(plan.id); }
                  }}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${isActive
                    ? 'bg-navy-700/50 text-slate-400 cursor-default'
                    : isPopular
                      ? 'btn-gradient hover:shadow-lg hover:shadow-violet-500/20'
                      : 'btn-gradient-border hover:shadow-lg'
                    }`}
                  disabled={isActive}
                >
                  {isActive ? 'Current Plan' : plan.id === 'FREE' ? 'Get Started' : `Upgrade to ${plan.name}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Comparison Table */}
      <div className="glass-card-premium p-6 animate-slide-up delay-500" style={{ animationFillMode: 'both' }}>
        <h2 className="text-lg font-semibold text-white mb-4">Compare Plans</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-blue-500/10">
                <th className="text-left py-3 text-slate-400 font-medium">Feature</th>
                {PLANS.map((p) => (
                  <th key={p.id} className={`text-center py-3 font-semibold ${p.popular ? 'text-violet-400' : 'text-slate-300'}`}>
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['AI Content Generations', '10/mo', '100/mo', 'Unlimited', 'Unlimited'],
                ['Campaigns', '3', '15', 'Unlimited', 'Unlimited'],
                ['Email Sends', '100/mo', '1,000/mo', '10,000/mo', '50,000/mo'],
                ['Scheduled Posts', '10', '50', 'Unlimited', 'Unlimited'],
                ['A/B Testing', '—', '✓', '✓', '✓'],
                ['AI Optimizer', '—', '—', '✓', '✓'],
                ['Brand Voice (RAG)', '—', '—', '✓', '✓'],
                ['API Access', '—', '—', '✓', '✓'],
                ['Custom AI Training', '—', '—', '—', '✓'],
                ['White-Label', '—', '—', '—', '✓'],
                ['Support', 'Community', 'Email', 'Priority', '24/7 Phone'],
              ].map(([feature, ...values], ri) => (
                <tr key={ri} className="border-b border-blue-500/5">
                  <td className="py-3 text-slate-400">{feature}</td>
                  {values.map((val, ci) => (
                    <td key={ci} className={`text-center py-3 ${val === '✓' ? 'text-emerald-400' : val === '—' ? 'text-slate-700' : 'text-slate-300'
                      }`}>
                      {val === '✓' ? <Check className="w-4 h-4 mx-auto text-emerald-400" /> :
                        val === '—' ? <X className="w-4 h-4 mx-auto text-slate-700" /> : val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Razorpay Checkout Modal */}
      {showCheckout && (
        <CheckoutModal
          planId={showCheckout}
          yearly={yearly}
          country={country}
          currency={currency}
          symbol={symbol}
          onClose={() => setShowCheckout(null)}
          onSuccess={(planId) => { setActivePlan(planId); setShowCheckout(null); }}
        />
      )}
    </div>
  );
}

// ─── Checkout Modal ──────────────────────────────────────────

function CheckoutModal({ planId, yearly, country, currency, symbol, onClose, onSuccess }) {
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const plan = PLANS.find((p) => p.id === planId);
  const basePrices = PLAN_BASE_USD[planId];
  const price = convertPrice(yearly ? basePrices.yearly : basePrices.monthly, currency);

  const handlePayment = () => {
    setProcessing(true);

    // Simulate Razorpay checkout
    // In production:
    // const options = {
    //   key: 'rzp_live_xxxxxxxxx',
    //   amount: price * 100,
    //   currency: currency,
    //   name: 'MarkAI',
    //   description: `${plan.name} Plan - ${yearly ? 'Annual' : 'Monthly'}`,
    //   handler: (response) => { confirmPayment(response); },
    //   prefill: { name: user.fullName, email: user.email },
    //   theme: { color: '#3b82f6' }
    // };
    // const rzp = new Razorpay(options);
    // rzp.open();

    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      setTimeout(() => onSuccess(planId), 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="glass-card-premium w-full max-w-md p-8 animate-bounce-in">
        {success ? (
          <div className="text-center animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
            <p className="text-slate-400">Welcome to {plan.name}! Your account has been upgraded.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Complete Payment</h2>
              <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            {/* Order Summary */}
            <div className="p-4 rounded-xl bg-navy-800/50 mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                    <plan.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{plan.name} Plan</p>
                    <p className="text-xs text-slate-500">{yearly ? 'Annual' : 'Monthly'} billing</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-blue-500/10 pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="text-white">{formatPrice(price, symbol, currency)}</span>
                </div>
                {yearly && (
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-400">Yearly discount</span>
                    <span className="text-emerald-400">-17%</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold border-t border-blue-500/10 pt-2">
                  <span className="text-white">Total</span>
                  <span className="text-white text-lg">{formatPrice(price, symbol, currency)}</span>
                </div>
              </div>
            </div>

            {/* Currency notice */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 mb-6 text-xs text-slate-400">
              <Globe className="w-4 h-4 text-blue-400 flex-shrink-0" />
              Paying in {currency} ({COUNTRY_NAMES[country]}). Powered by Razorpay.
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayment}
              disabled={processing}
              className="w-full btn-gradient py-4 text-base flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {processing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Pay {formatPrice(price, symbol, currency)} with Razorpay
                </>
              )}
            </button>

            <p className="text-[10px] text-slate-600 text-center mt-3">
              Secure payment. Cancel anytime. 30-day money-back guarantee.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
