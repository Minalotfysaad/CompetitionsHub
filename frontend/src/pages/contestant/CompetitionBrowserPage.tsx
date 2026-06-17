import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Trophy, Calendar, ChevronRight } from 'lucide-react';
import { competitionsApi } from '../../api/competitions';

export default function CompetitionBrowserPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['competitions'],
    queryFn: competitionsApi.getAll,
  });
  const competitions = data?.items ?? [];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Competitions</h1>
          <p className="page-subtitle">Browse and participate in available competitions</p>
        </div>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <span className="spinner spinner-lg" />
        </div>
      ) : competitions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Trophy size={28} /></div>
          <h3>No competitions available</h3>
          <p>Check back later for upcoming competitions.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {competitions.map((c, i) => (
            <div
              key={c.id}
              className="card animate-fade-up"
              style={{ cursor: 'pointer', animationDelay: `${i * 50}ms` }}
              onClick={() => navigate(`/competitions/${c.id}/days`)}
            >
              <div style={{
                height: 80,
                background: 'linear-gradient(135deg, var(--primary-light), rgba(129,140,248,0.08))',
                borderRadius: 'var(--radius)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1rem',
              }}>
                <Trophy size={32} style={{ color: 'var(--primary)' }} />
              </div>

              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.375rem' }}>
                {c.title}
              </h3>
              {c.description && (
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  {c.description}
                </p>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                <span className="badge badge-primary"><Calendar size={11} /> View Days</span>
                <ChevronRight size={16} style={{ color: 'var(--text-subtle)' }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
