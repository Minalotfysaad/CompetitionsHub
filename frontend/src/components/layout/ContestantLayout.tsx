import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Trophy, LogOut, Sun, Moon } from 'lucide-react';

export default function ContestantLayout() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const initials = user?.userName?.slice(0, 2).toUpperCase() ?? 'C';

  return (
    <div className="contestant-layout">
      <header className="topbar">
        <div className="topbar-brand">
          <div style={{
            width: 32, height: 32,
            background: 'linear-gradient(135deg, var(--primary), #818cf8)',
            borderRadius: 'var(--radius)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: '0.875rem',
          }}>
            <Trophy size={16} />
          </div>
          <span style={{ color: 'var(--text)', fontWeight: 700 }}>CompetitionHub</span>
        </div>

        <div className="topbar-actions">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: 32, height: 32,
              background: 'linear-gradient(135deg, var(--primary), #818cf8)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: 700, color: '#fff',
            }}>
              {initials}
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)' }}>
              {user?.userName}
            </span>
          </div>
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
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <main className="contestant-content animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
}
