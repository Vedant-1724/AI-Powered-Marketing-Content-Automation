import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Sparkles, Megaphone, Calendar, Mail, FlaskConical,
  BarChart3, CreditCard, Settings, LogOut, Zap, Menu
} from 'lucide-react';

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/content-studio', icon: Sparkles, label: 'AI Content Studio' },
    { to: '/campaigns', icon: Megaphone, label: 'Campaigns' },
    { to: '/scheduler', icon: Calendar, label: 'Scheduler' },
    { to: '/email', icon: Mail, label: 'Email Campaigns' },
    { to: '/ab-testing', icon: FlaskConical, label: 'A/B Testing' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/pricing', icon: CreditCard, label: 'Pricing' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside
      className="fixed left-0 top-0 h-screen glass flex flex-col transition-all duration-300 z-50"
      style={{ width: collapsed ? '80px' : '260px' }}
    >
      {/* Logo */}
      <div className="px-5 py-7 flex items-center gap-3 border-b border-blue-500/10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <span className="text-xl font-bold gradient-text whitespace-nowrap">MarkAI</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-2 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl transition-all duration-200 group ${collapsed ? 'px-0 py-3.5 justify-center' : 'px-4 py-3.5'
              } ${isActive
                ? 'bg-gradient-to-r from-blue-500/20 to-violet-500/10 text-blue-400 border border-blue-500/20'
                : 'text-slate-400 hover:bg-navy-700/50 hover:text-slate-200'
              }`
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="font-medium">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="px-3 py-4 border-t border-blue-500/10 space-y-2">
        {/* User Info (expanded only) */}
        {!collapsed && user && (
          <div className="mb-2 px-4">
            <p className="text-sm font-semibold text-slate-200 truncate">{user.fullName}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-gradient-to-r from-blue-500/20 to-violet-500/20 text-blue-300 border border-blue-500/20">
              {user.subscriptionTier}
            </span>
          </div>
        )}

        {/* Menu Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand menu' : 'Collapse menu'}
          className={`flex items-center gap-3 w-full rounded-xl text-slate-400 hover:bg-blue-500/10 hover:text-blue-400 transition-all ${collapsed ? 'px-0 py-3.5 justify-center' : 'px-4 py-3.5'
            }`}
        >
          <Menu className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium">Menu</span>}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title={collapsed ? 'Logout' : undefined}
          className={`flex items-center gap-3 w-full rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all ${collapsed ? 'px-0 py-3.5 justify-center' : 'px-4 py-3.5'
            }`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
