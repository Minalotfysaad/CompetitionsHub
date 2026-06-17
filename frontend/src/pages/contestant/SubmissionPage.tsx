import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { competitionDaysApi } from '../../api/competitionDays';
import { submissionsApi } from '../../api/submissions';
import { useAutosave } from '../../hooks/useAutosave';
import QuestionRenderer from '../../components/questions/QuestionRenderer';
import {
  Trophy,
  Clock,
  Award,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Info,
  Send,
  Loader2,
  Check,
} from 'lucide-react';
import { format, isPast } from 'date-fns';
import toast from 'react-hot-toast';
import {
  type QuestionContestantDto,
  SubmissionStatus,
  QuestionType,
} from '../../types';

// Question Auto-Saving Wrapper
interface QuestionWrapperProps {
  question: QuestionContestantDto;
  submissionId: number;
  initialValue: string;
  onStatusChange: (questionId: number, status: 'saving' | 'saved' | 'error', isAnswered: boolean) => void;
  disabled?: boolean;
}

function QuestionCardWrapper({
  question,
  submissionId,
  initialValue,
  onStatusChange,
  disabled,
}: QuestionWrapperProps) {
  const [val, setVal] = useState(initialValue);

  // Sync state if initialValue changes from query refresh
  useEffect(() => {
    setVal(initialValue);
  }, [initialValue]);

  useAutosave(submissionId, question.id, val, (status) => {
    const isAnswered = val.trim() !== '';
    onStatusChange(question.id, status, isAnswered);
  });

  const handleChange = (newVal: string) => {
    setVal(newVal);
    const isAnswered = newVal.trim() !== '';
    onStatusChange(question.id, 'saving', isAnswered);
  };

  return (
    <QuestionRenderer
      question={question}
      value={val}
      onChange={handleChange}
      disabled={disabled}
    />
  );
}

export default function SubmissionPage() {
  const { competitionId, dayId } = useParams<{ competitionId: string; dayId: string }>();
  const compId = Number(competitionId);
  const dId = Number(dayId);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [saveStatuses, setSaveStatuses] = useState<Record<number, 'saving' | 'saved' | 'error'>>({});
  const [answeredMap, setAnsweredMap] = useState<Record<number, boolean>>({});
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Fetch Contestant Day details (includes questions list)
  const { data: day, isLoading: isDayLoading, error: dayError } = useQuery({
    queryKey: ['contestant-day-details', dId],
    queryFn: () => competitionDaysApi.contestantGetById(dId),
    enabled: !!dId,
  });

  // Start/Get Submission on enter
  const { data: submission, isLoading: isSubmissionLoading, error: subError } = useQuery({
    queryKey: ['contestant-submission', dId, user?.id],
    queryFn: () => submissionsApi.start({ competitionDayId: dId, userId: user?.id || '' }),
    enabled: !!dId && !!user?.id,
    refetchOnWindowFocus: false, // Prevent interrupting users typing
  });

  // Map initial values of answers from started submission responses
  const initialAnswers = useMemo(() => {
    if (!submission?.responses) return {};
    const map: Record<number, string> = {};
    submission.responses.forEach((resp) => {
      map[resp.questionId] = resp.answerData ?? '';
    });
    return map;
  }, [submission]);

  // Sync answering progress map when submission loads
  useEffect(() => {
    if (day?.questions && submission?.responses) {
      const answers = initialAnswers;
      const initialAnsweredMap: Record<number, boolean> = {};
      day.questions.forEach((q) => {
        initialAnsweredMap[q.id] = !!answers[q.id]?.trim();
      });
      setAnsweredMap(initialAnsweredMap);
    }
  }, [day?.questions, submission?.responses, initialAnswers]);

  // Handle question autosave status tracking
  const handleStatusChange = (questionId: number, status: 'saving' | 'saved' | 'error', isAnswered: boolean) => {
    setSaveStatuses((prev) => ({ ...prev, [questionId]: status }));
    setAnsweredMap((prev) => ({ ...prev, [questionId]: isAnswered }));
  };

  // Submit Submission Mutation
  const submitMutation = useMutation({
    mutationFn: () => submissionsApi.submit(submission?.id ?? 0),
    onSuccess: (updatedSub) => {
      toast.success('Submission finalized successfully!');
      setIsConfirmOpen(false);
      // Update cache
      queryClient.setQueryData(['contestant-submission', dId, user?.id], updatedSub);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to submit. Please try again.');
    },
  });

  // Calculate Overall Saving Status
  const globalSaveStatus = useMemo(() => {
    const statuses = Object.values(saveStatuses);
    if (statuses.includes('error')) return 'error';
    if (statuses.includes('saving')) return 'saving';
    if (statuses.length > 0) return 'saved';
    return 'idle';
  }, [saveStatuses]);

  // Calculate answered count
  const answeredCount = useMemo(() => {
    return Object.values(answeredMap).filter(Boolean).length;
  }, [answeredMap]);

  const totalQuestions = day?.questions?.length ?? 0;
  const isLate = day ? isPast(new Date(day.endDate)) : false;

  // Render Loading states
  const isLoading = isDayLoading || isSubmissionLoading;
  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem' }}>
        <Loader2 className="spinner spinner-lg" style={{ marginBottom: '1rem', color: 'var(--primary)' }} />
        <p className="text-muted">Loading submission details…</p>
      </div>
    );
  }

  // Handle error cases
  if (dayError || subError || !day || !submission) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon" style={{ color: 'var(--danger)' }}><AlertTriangle size={28} /></div>
        <h3>Failed to load submission</h3>
        <p>There was an error loading the competition day or submission resources.</p>
        <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={() => navigate(`/competitions/${compId}/days`)}>
          <ArrowLeft size={16} /> Back to Days
        </button>
      </div>
    );
  }

  // RENDER SUBMISSION RESULT SCREEN (If already submitted, pending grading, or graded)
  const isCompleted = submission.status !== SubmissionStatus.InProgress;

  if (isCompleted) {
    const statusText =
      submission.status === SubmissionStatus.Graded
        ? 'Graded'
        : submission.status === SubmissionStatus.PendingManualReview
        ? 'Awaiting Manual Grading'
        : 'Submitted';

    const statusBadgeClass =
      submission.status === SubmissionStatus.Graded
        ? 'badge-success'
        : submission.status === SubmissionStatus.PendingManualReview
        ? 'badge-warning'
        : 'badge-primary';

    return (
      <div className="animate-fade-up" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <button
          className="btn btn-ghost btn-sm"
          style={{ marginBottom: '1.5rem' }}
          onClick={() => navigate(`/competitions/${compId}/days`)}
        >
          <ArrowLeft size={16} /> Back to Days
        </button>

        <div className="result-card card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div
              className="stat-icon"
              style={{
                background: submission.status === SubmissionStatus.Graded ? 'var(--success-bg)' : 'var(--primary-light)',
                color: submission.status === SubmissionStatus.Graded ? 'var(--success)' : 'var(--primary)',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
              }}
            >
              <Trophy size={32} />
            </div>
          </div>

          <h2 style={{ marginBottom: '0.25rem' }}>Competition Day Finished</h2>
          <p style={{ marginBottom: '1.5rem' }}>{day.title}</p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <div>
              <div className="result-score">
                {submission.status === SubmissionStatus.Graded ? `${submission.totalScore ?? 0}` : '?'}
                <span style={{ fontSize: '1.5rem', color: 'var(--text-subtle)' }}>/{day.dayTotalMark}</span>
              </div>
              <div className="result-label">Total Score</div>
            </div>
            {submission.status === SubmissionStatus.Graded && (
              <div>
                <div className="result-score" style={{ background: 'linear-gradient(135deg, var(--success), #4ade80)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {(submission.percentage ?? 0).toFixed(0)}%
                </div>
                <div className="result-label">Percentage</div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span className={`badge ${statusBadgeClass}`} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              Status: {statusText}
            </span>
            {submission.submittedAt && (
              <span className="badge badge-muted" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <Clock size={14} style={{ marginRight: '0.25rem' }} />
                Submitted on {format(new Date(submission.submittedAt), 'MMM d, yyyy HH:mm')}
              </span>
            )}
          </div>
        </div>

        {/* Responses Review */}
        <h3 style={{ marginBottom: '1rem' }}>Submission Details & Feedback</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {day.questions.map((question, qIdx) => {
            const resp = (submission.responses ?? []).find((r) => r.questionId === question.id);
            const isCorrect = resp?.isCorrect;
            const earnedMark = resp?.earnedMark ?? 0;

            return (
              <div key={question.id} className="card animate-fade-in" style={{ animationDelay: `${qIdx * 50}ms` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div>
                    <h4 style={{ color: 'var(--text)', fontWeight: 600 }}>{question.title}</h4>
                    {question.description && <p className="text-sm" style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>{question.description}</p>}
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    {submission.status === SubmissionStatus.Graded && (
                      <span
                        className={`badge ${isCorrect ? 'badge-success' : 'badge-danger'}`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}
                      >
                        {isCorrect ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    )}
                    <div className="text-sm text-subtle" style={{ marginTop: '0.25rem' }}>
                      {submission.status === SubmissionStatus.Graded ? `${earnedMark} / ` : ''}
                      {question.questionMark} pts
                    </div>
                  </div>
                </div>

                <div style={{ background: 'var(--surface-2)', padding: '1rem', borderRadius: 'var(--radius)', marginTop: '0.5rem' }}>
                  <div className="text-xs text-muted" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', fontWeight: 600 }}>Your Answer:</div>
                  <div className="text-sm" style={{ color: 'var(--text)', whiteSpace: 'pre-wrap' }}>
                    {question.type === QuestionType.Grid && resp?.answerData ? (
                      (() => {
                        try {
                          const dict = JSON.parse(resp.answerData);
                          return (
                            <ul style={{ listStyle: 'disc', paddingLeft: '1.25rem' }}>
                              {Object.entries(dict).map(([rKey, cKey]) => (
                                <li key={rKey}>
                                  <strong>{rKey}</strong>: {String(cKey)}
                                </li>
                              ))}
                            </ul>
                          );
                        } catch {
                          return resp.answerData;
                        }
                      })()
                    ) : question.type === QuestionType.MultipleChoice && resp?.answerData ? (
                      question.options?.[Number(resp.answerData)]?.text ?? `Option ${Number(resp.answerData) + 1}`
                    ) : (
                      resp?.answerData || <span className="text-subtle">No answer provided</span>
                    )}
                  </div>
                </div>

                {resp?.reviewerComment && (
                  <div
                    style={{
                      borderLeft: '3px solid var(--primary)',
                      background: 'rgba(99, 102, 241, 0.05)',
                      padding: '0.75rem 1rem',
                      borderRadius: '0 var(--radius) var(--radius) 0',
                      marginTop: '1rem',
                    }}
                  >
                    <div className="text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.25rem', fontWeight: 600 }}>
                      <Info size={12} /> Reviewer Comment:
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text)', margin: 0 }}>{resp.reviewerComment}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ACTIVE SUBMISSION RUN SHEET
  return (
    <div className="animate-fade-up" style={{ maxWidth: '840px', margin: '0 auto', paddingBottom: '4rem' }}>
      {/* Back navigation */}
      <button
        className="btn btn-ghost btn-sm"
        style={{ marginBottom: '1rem' }}
        onClick={() => navigate(`/competitions/${compId}/days`)}
      >
        <ArrowLeft size={16} /> Back to Days
      </button>

      {/* Header Info */}
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title">{day.title}</h1>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <span className="badge badge-primary">
              <Clock size={12} style={{ marginRight: '0.25rem' }} />
              Active Day
            </span>
            <span className="badge badge-muted">
              <Award size={12} style={{ marginRight: '0.25rem' }} />
              {day.dayTotalMark} marks total
            </span>
          </div>
        </div>
      </div>

      {/* Late Warning */}
      {isLate && (
        <div
          className="card card-sm animate-fade-in"
          style={{
            background: 'var(--warning-bg)',
            borderColor: 'var(--warning)',
            color: 'var(--warning)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <AlertTriangle size={20} style={{ flexShrink: 0 }} />
          <div>
            <strong style={{ display: 'block', fontSize: '0.9375rem' }}>Late Submission Warning</strong>
            <span className="text-sm" style={{ color: 'rgba(245, 158, 11, 0.9)' }}>
              The end date for this day has passed. You can still submit answers for practice, but they will not be recorded in public rankings.
            </span>
          </div>
        </div>
      )}

      {/* Sticky Progress & Saving Status */}
      <div
        style={{
          position: 'sticky',
          top: 'var(--header-height)',
          background: 'var(--bg)',
          zIndex: 40,
          padding: '0.75rem 0',
          borderBottom: '1px solid var(--border)',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', marginBottom: '0.5rem' }}>
          {/* Progress label */}
          <div className="text-sm" style={{ fontWeight: 600 }}>
            Progress: <span style={{ color: 'var(--primary)' }}>{answeredCount}</span> / {totalQuestions} answered
          </div>

          {/* Autosave Global Indicator */}
          <div className="autosave-indicator">
            {globalSaveStatus === 'saving' && (
              <>
                <div className="autosave-dot saving" />
                <span>Saving changes…</span>
              </>
            )}
            {globalSaveStatus === 'saved' && (
              <>
                <div className="autosave-dot saved" />
                <span>All changes saved</span>
              </>
            )}
            {globalSaveStatus === 'error' && (
              <>
                <div className="autosave-dot error" />
                <span style={{ color: 'var(--danger)' }}>Error saving! Click to retry</span>
              </>
            )}
            {globalSaveStatus === 'idle' && (
              <>
                <div className="autosave-dot saved" />
                <span>Ready</span>
              </>
            )}
          </div>
        </div>
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{ width: `${totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Questions list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {day.questions.map((question) => {
          const initialVal = initialAnswers[question.id] || '';
          return (
            <QuestionCardWrapper
              key={question.id}
              question={question}
              submissionId={submission.id}
              initialValue={initialVal}
              onStatusChange={handleStatusChange}
            />
          );
        })}
      </div>

      {/* Submit Section */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
        <button
          type="button"
          className="btn btn-primary btn-lg"
          style={{ width: '100%', maxWidth: '320px' }}
          onClick={() => setIsConfirmOpen(true)}
        >
          <Send size={18} /> Submit Day Responses
        </button>
      </div>

      {/* SUBMISSION CONFIRMATION MODAL */}
      {isConfirmOpen && (
        <div className="modal-backdrop">
          <div className="modal animate-scale-in" style={{ maxWidth: '440px' }}>
            <h3 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Send size={20} style={{ color: 'var(--primary)' }} />
              Submit Answers?
            </h3>
            <div className="modal-body" style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', lineHeight: 1.5 }}>
              <p style={{ marginBottom: '0.5rem' }}>
                Are you sure you want to finalize your submission for <strong>{day.title}</strong>?
              </p>
              <p>Once submitted, you will not be able to modify or add any further responses.</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsConfirmOpen(false)}
                disabled={submitMutation.isPending}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => submitMutation.mutate()}
                disabled={submitMutation.isPending}
              >
                {submitMutation.isPending ? <span className="spinner" /> : <Check size={16} />}
                {submitMutation.isPending ? 'Submitting…' : 'Yes, Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
