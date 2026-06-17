import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Trophy, LogOut } from 'lucide-react';

export default function ContestantLayout() {
  const { user, logout } = useAuth();
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
