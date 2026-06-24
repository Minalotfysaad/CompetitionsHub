import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { competitionDaysApi } from '../../api/competitionDays';
import { competitionsApi } from '../../api/competitions';
import { Calendar, Clock, Award, ArrowRight, BookOpen, ArrowLeft, Lock } from 'lucide-react';
import { format, isPast } from 'date-fns';
import toast from 'react-hot-toast';

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
          <p>Competition days will appear here once they start. Check back soon.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {days.sort((a, b) => a.dayNum - b.dayNum).map((day, i) => {
            const end = new Date(day.endDate);
            const start = new Date(day.startDate);
            const isActive = day.isActive;
            const isPastDay = isPast(end);
            const isUpcoming = start > new Date();

            return (
              <div
                key={day.id}
                className="day-card animate-fade-in"
                style={{
                  animationDelay: `${i * 50}ms`,
                  cursor: isUpcoming ? 'not-allowed' : 'pointer',
                  opacity: isUpcoming ? 0.8 : 1,
                }}
                onClick={() => {
                  if (isUpcoming) {
                    toast.error('This competition day has not started yet.');
                    return;
                  }
                  navigate(`/competitions/${compId}/days/${day.id}/submit`);
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
                  <div className="day-num" style={{
                    background: isActive ? 'var(--success-bg)' : (isPastDay || isUpcoming) ? 'var(--surface-2)' : 'var(--primary-light)',
                    color: isActive ? 'var(--success)' : (isPastDay || isUpcoming) ? 'var(--text-subtle)' : 'var(--primary)',
                  }}>
                    {day.dayNum}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text)' }}>{day.title}</span>
                      {isActive   && <span className="badge badge-success">Live Now</span>}
                      {isPastDay  && <span className="badge badge-muted">Ended — Review Available</span>}
                      {isUpcoming && (
                        <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                          Upcoming
                        </span>
                      )}
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
                  {isPastDay && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--primary)' }}>
                      <BookOpen size={13} />
                      View with Answers
                    </div>
                  )}
                  {isUpcoming ? (
                    <Lock size={18} style={{ color: 'var(--text-subtle)' }} />
                  ) : (
                    <ArrowRight size={18} style={{ color: 'var(--text-subtle)' }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
