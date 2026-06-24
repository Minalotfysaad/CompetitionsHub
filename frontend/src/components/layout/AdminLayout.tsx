import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Trophy,
  LayoutDashboard,
  ClipboardCheck,
  LogOut,
  Menu,
  Medal,
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
          <div className="sidebar-user" onClick={handleLogout} title="Logout">
            <div className="sidebar-avatar">{initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="sidebar-user-name truncate">{user?.userName}</div>
              <div className="sidebar-user-role">Administrator</div>
            </div>
            <LogOut size={16} style={{ color: 'var(--text-subtle)', flexShrink: 0 }} />
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
