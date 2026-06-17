import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Trophy, Calendar, ClipboardCheck, ArrowRight, Clock } from 'lucide-react';
import { competitionsApi } from '../../api/competitions';
import { manualGradingApi } from '../../api/manualGrading';

export default function DashboardPage() {
  const { data } = useQuery({
    queryKey: ['competitions'],
    queryFn: competitionsApi.getAll,
  });
  const competitions = data?.items ?? [];

  const { data: pendingCompetitions = [] } = useQuery({
    queryKey: ['grading', 'competitions'],
    queryFn: manualGradingApi.getCompetitions,
  });

  const totalPending = pendingCompetitions.reduce(
    (sum, c) => sum + c.pendingResponsesCount,
    0
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back — here's what needs your attention</p>
        </div>
        <Link to="/admin/competitions/new" className="btn btn-primary">
          <Trophy size={16} />
          New Competition
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="stat-card animate-fade-in" style={{ '--delay': '0ms' } as React.CSSProperties}>
          <div className="stat-icon" style={{ background: 'var(--primary-light)' }}>
            <Trophy size={22} style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <div className="stat-value">{competitions.length}</div>
            <div className="stat-label">Total Competitions</div>
          </div>
        </div>

        <div className="stat-card animate-fade-in" style={{ '--delay': '60ms' } as React.CSSProperties}>
          <div className="stat-icon" style={{ background: 'var(--info-bg)' }}>
            <Calendar size={22} style={{ color: 'var(--info)' }} />
          </div>
          <div>
            <div className="stat-value">{pendingCompetitions.length}</div>
            <div className="stat-label">Competitions with Pending Reviews</div>
          </div>
        </div>

        <div className="stat-card animate-fade-in" style={{ '--delay': '120ms' } as React.CSSProperties}>
          <div className="stat-icon" style={{ background: totalPending > 0 ? 'var(--warning-bg)' : 'var(--success-bg)' }}>
            <ClipboardCheck size={22} style={{ color: totalPending > 0 ? 'var(--warning)' : 'var(--success)' }} />
          </div>
          <div>
            <div className="stat-value">{totalPending}</div>
            <div className="stat-label">Answers Pending Grading</div>
          </div>
        </div>
      </div>

      {/* Pending Reviews Alert */}
      {totalPending > 0 && (
        <div
          className="card animate-fade-up"
          style={{ borderColor: 'var(--warning)', background: 'var(--warning-bg)', marginBottom: '2rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Clock size={20} style={{ color: 'var(--warning)', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 600, color: 'var(--warning)' }}>Grading Required</div>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                  {totalPending} paragraph answer{totalPending !== 1 ? 's' : ''} waiting for manual review.
                </p>
              </div>
            </div>
            <Link to="/admin/grading" className="btn btn-secondary btn-sm">
              Go to Grading <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}

      {/* Recent Competitions */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.125rem' }}>Competitions</h2>
          <Link to="/admin/competitions" className="btn btn-ghost btn-sm">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {competitions.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <Trophy size={40} style={{ color: 'var(--text-subtle)', margin: '0 auto 1rem' }} />
            <p style={{ marginBottom: '1rem' }}>No competitions yet</p>
            <Link to="/admin/competitions/new" className="btn btn-primary">
              Create your first competition
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {competitions.slice(0, 5).map((c) => (
              <Link
                key={c.id}
                to={`/admin/competitions/${c.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div className="card card-sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: 36, height: 36,
                      background: 'var(--primary-light)',
                      borderRadius: 'var(--radius)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Trophy size={16} style={{ color: 'var(--primary)' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text)' }}>{c.title}</div>
                      {c.description && (
                        <div className="text-sm text-muted truncate" style={{ maxWidth: 400 }}>{c.description}</div>
                      )}
                    </div>
                  </div>
                  <ArrowRight size={16} style={{ color: 'var(--text-subtle)', flexShrink: 0 }} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
