import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, User, Mail, Lock, Building2 } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', companyName: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.fullName, form.email, form.password, form.companyName);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'fullName', label: 'Full Name', icon: User, type: 'text', placeholder: 'John Doe', required: true },
    { name: 'email', label: 'Email', icon: Mail, type: 'email', placeholder: 'you@company.com', required: true },
    { name: 'password', label: 'Password', icon: Lock, type: 'password', placeholder: '••••••••', required: true },
    { name: 'companyName', label: 'Company Name', icon: Building2, type: 'text', placeholder: 'Acme Inc. (optional)' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a0e1a 0%, #0f1629 50%, #151d36 100%)' }}>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 mb-4 shadow-lg shadow-violet-500/20">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">Create Your Account</h1>
          <p className="text-slate-400 mt-2">Start your 14-day free trial</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm text-center">
                {error}
              </div>
            )}

            {fields.map(({ name, label, icon: Icon, type, placeholder, required }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id={`register-${name}`}
                    name={name}
                    type={type}
                    value={form[name]}
                    onChange={handleChange}
                    className="input-dark pl-11"
                    placeholder={placeholder}
                    required={required}
                  />
                </div>
              </div>
            ))}

            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="btn-gradient w-full py-3 text-center mt-2 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating account...
                </span>
              ) : 'Start Free Trial'}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
