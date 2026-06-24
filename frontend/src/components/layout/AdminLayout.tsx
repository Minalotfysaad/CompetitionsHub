import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
  Trophy,
  LayoutDashboard,
  ClipboardCheck,
  LogOut,
  Menu,
  Medal,
  Sun,
  Moon,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { label: 'Navigation', items: [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/competitions', label: 'Competitions', icon: Trophy },
    { to: '/admin/leaderboard', label: 'Leaderboard', icon: Medal },
    { to: '/admin/grading', label: 'Manual Grading', icon: ClipboardCheck },
  ]},
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const initials = user?.userName?.slice(0, 2).toUpperCase() ?? 'A';

  return (
    <div className="admin-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            zIndex: 99, backdropFilter: 'blur(2px)',
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">C</div>
          <div>
            <div className="sidebar-logo-text">CompetitionHub</div>
            <div className="sidebar-logo-sub">Admin Panel</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((section) => (
            <div key={section.label}>
              <div className="sidebar-section-label">{section.label}</div>
              {section.items.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `sidebar-link${isActive ? ' active' : ''}`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={18} />
                  {label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', padding: '0.25rem 0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
              <div className="sidebar-avatar">{initials}</div>
              <div style={{ minWidth: 0 }}>
                <div className="sidebar-user-name truncate">{user?.userName}</div>
                <div className="sidebar-user-role">Administrator</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <button
                onClick={toggle}
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  background: 'var(--surface-2)',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background var(--ease), border-color var(--ease), color var(--ease)',
                  boxShadow: 'var(--shadow-sm)',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--surface-3)';
                  e.currentTarget.style.borderColor = 'var(--border-hover)';
                  e.currentTarget.style.color = 'var(--text)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--surface-2)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }}
              >
                {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
              </button>

              <button
                onClick={handleLogout}
                title="Logout"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  background: 'var(--surface-2)',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background var(--ease), border-color var(--ease), color var(--ease)',
                  boxShadow: 'var(--shadow-sm)',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--surface-3)';
                  e.currentTarget.style.borderColor = 'var(--border-hover)';
                  e.currentTarget.style.color = 'var(--danger)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--surface-2)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        {/* Mobile topbar */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '1rem',
            padding: '0.75rem 1rem',
            borderBottom: '1px solid var(--border)',
            background: 'var(--surface)',
            position: 'sticky',
            top: 0,
            zIndex: 50,
          }}
          className="mobile-topbar"
        >
          <button className="btn btn-ghost btn-icon" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <span style={{ fontWeight: 700 }}>CompetitionHub</span>
        </div>

        <div className="page-content animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
