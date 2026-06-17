import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { competitionDaysApi } from '../../api/competitionDays';
import { competitionsApi } from '../../api/competitions';
import { Calendar, Clock, Award, ArrowRight, AlertTriangle, ArrowLeft } from 'lucide-react';
import { format, isPast, isFuture } from 'date-fns';

export default function CompetitionDayPage() {
  const { competitionId } = useParams<{ competitionId: string }>();
  const navigate = useNavigate();
  const compId = Number(competitionId);

  const { data: competition } = useQuery({
    queryKey: ['competition-public', compId],
    queryFn: () => competitionsApi.getById(compId),
  });

  const { data: days = [], isLoading } = useQuery({
    queryKey: ['contestant-days', compId],
    queryFn: () => competitionDaysApi.contestantGetByCompetition(compId),
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <button className="btn btn-ghost btn-sm" style={{ marginBottom: '0.5rem' }} onClick={() => navigate('/competitions')}>
            <ArrowLeft size={16} /> All Competitions
          </button>
          <h1 className="page-title">{competition?.title ?? 'Competition Days'}</h1>
          {competition?.description && (
            <p className="page-subtitle">{competition.description}</p>
          )}
        </div>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <span className="spinner spinner-lg" />
        </div>
      ) : days.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Calendar size={28} /></div>
          <h3>No days available yet</h3>
          <p>Competition days haven't been published yet. Check back soon.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {days.sort((a, b) => a.dayNum - b.dayNum).map((day, i) => {
            const start = new Date(day.startDate);
            const end = new Date(day.endDate);
            const isActive = day.isActive;
            const isPastDay = isPast(end);
            const isUpcoming = isFuture(start);

            return (
              <div
                key={day.id}
                className="day-card animate-fade-in"
                style={{
                  animationDelay: `${i * 50}ms`,
                  opacity: isUpcoming ? 0.65 : 1,
                  cursor: isUpcoming ? 'not-allowed' : 'pointer',
                }}
                onClick={() => {
                  if (!isUpcoming) navigate(`/competitions/${compId}/days/${day.id}/submit`);
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
                  <div className="day-num" style={{
                    background: isActive ? 'var(--success-bg)' : isPastDay ? 'var(--surface-2)' : 'var(--primary-light)',
                    color: isActive ? 'var(--success)' : isPastDay ? 'var(--text-subtle)' : 'var(--primary)',
                  }}>
                    {day.dayNum}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text)' }}>{day.title}</span>
                      {isActive   && <span className="badge badge-success">Live Now</span>}
                      {isPastDay  && <span className="badge badge-muted">Past</span>}
                      {isUpcoming && <span className="badge badge-info">Upcoming</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <span className="text-sm text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={12} />
                        {format(start, 'MMM d, HH:mm')} – {format(end, 'MMM d, HH:mm')}
                      </span>
                      <span className="badge badge-muted" style={{ fontSize: '0.7rem' }}>
                        <Award size={10} /> {day.dayTotalMark} marks
                      </span>
                      <span className="text-sm text-muted">
                        {day.questions.length} question{day.questions.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                  {isPastDay && !isUpcoming && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--warning)' }}>
                      <AlertTriangle size={13} />
                      Late — won't count in rankings
                    </div>
                  )}
                  {!isUpcoming && <ArrowRight size={18} style={{ color: 'var(--text-subtle)' }} />}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
