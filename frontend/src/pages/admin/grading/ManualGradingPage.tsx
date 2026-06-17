import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { ClipboardCheck, ChevronRight, CheckCircle2, Clock, Award, User, History, ChevronDown } from 'lucide-react';
import { manualGradingApi } from '../../../api/manualGrading';
import { format } from 'date-fns';
import type {
  CompetitionManualReviewDto,
  CompetitionDayManualReviewDto,
  ParagraphQuestionReviewDto,
  QuestionReviewDetailsDto,
} from '../../../types';
import toast from 'react-hot-toast';

type Step = 'competitions' | 'days' | 'questions' | 'grade';

interface GradeForm { earnedMark: number; reviewerComment: string; }

export default function ManualGradingPage() {
  const [step, setStep] = useState<Step>('competitions');
  const [selectedComp, setSelectedComp] = useState<CompetitionManualReviewDto | null>(null);
  const [selectedDay, setSelectedDay] = useState<CompetitionDayManualReviewDto | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<ParagraphQuestionReviewDto | null>(null);
  const [gradingResponseId, setGradingResponseId] = useState<number | null>(null);
  const qc = useQueryClient();

  // Step 1
  const { data: competitions = [], isLoading: loadingComps } = useQuery({
    queryKey: ['grading', 'competitions'],
    queryFn: manualGradingApi.getCompetitions,
    enabled: step === 'competitions',
  });

  // Step 2
  const { data: days = [], isLoading: loadingDays } = useQuery({
    queryKey: ['grading', 'days', selectedComp?.competitionId],
    queryFn: () => manualGradingApi.getDays(selectedComp!.competitionId),
    enabled: step === 'days' && !!selectedComp,
  });

  // Step 3 – pending
  const { data: questions = [], isLoading: loadingQs } = useQuery({
    queryKey: ['grading', 'questions', selectedDay?.id],
    queryFn: () => manualGradingApi.getQuestions(selectedDay!.id),
    enabled: step === 'questions' && !!selectedDay,
  });

  // Step 3 – graded history
  const [historyOpen, setHistoryOpen] = useState(false);
  const { data: gradedQuestions = [], isLoading: loadingGraded } = useQuery({
    queryKey: ['grading', 'graded-questions', selectedDay?.id],
    queryFn: () => manualGradingApi.getGradedQuestions(selectedDay!.id),
    enabled: step === 'questions' && !!selectedDay,
  });

  // Step 4
  const { data: questionDetails, isLoading: loadingDetails } = useQuery({
    queryKey: ['grading', 'details', selectedQuestion?.questionId],
    queryFn: () => manualGradingApi.getQuestionDetails(selectedQuestion!.questionId),
    enabled: step === 'grade' && !!selectedQuestion,
  });

  const gradeMutation = useMutation({
    mutationFn: ({ responseId, dto }: { responseId: number; dto: GradeForm }) =>
      manualGradingApi.gradeResponse(responseId, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['grading'] });
      toast.success('Grade saved!');
      setGradingResponseId(null);
    },
    onError: () => toast.error('Failed to save grade'),
  });

  function goTo(s: Step) { setStep(s); }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Manual Grading</h1>
          <p className="page-subtitle">Review and grade paragraph question answers</p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="step-breadcrumb">
        <span className={`step-crumb${step === 'competitions' ? ' active' : ''}`} onClick={() => goTo('competitions')}>Competitions</span>
        {selectedComp && (<><span className="step-sep">›</span><span className={`step-crumb${step === 'days' ? ' active' : ''}`} onClick={() => goTo('days')}>{selectedComp.competitionName}</span></>)}
        {selectedDay && (<><span className="step-sep">›</span><span className={`step-crumb${step === 'questions' ? ' active' : ''}`} onClick={() => goTo('questions')}>Day {selectedDay.dayNum}</span></>)}
        {selectedQuestion && (<><span className="step-sep">›</span><span className={`step-crumb${step === 'grade' ? ' active' : ''}`}>{selectedQuestion.title}</span></>)}
      </div>

      {/* Step 1 – Competition list */}
      {step === 'competitions' && (
        <div>
          {loadingComps ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><span className="spinner spinner-lg" /></div>
          ) : competitions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><CheckCircle2 size={28} style={{ color: 'var(--success)' }} /></div>
              <h3>All caught up!</h3>
              <p>No competitions have pending paragraph answers to grade.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {competitions.map((c, i) => (
                <div
                  key={c.competitionId}
                  className="card card-sm animate-fade-in"
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', animationDelay: `${i * 40}ms` }}
                  onClick={() => { setSelectedComp(c); setStep('days'); }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 40, height: 40, background: 'var(--warning-bg)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ClipboardCheck size={18} style={{ color: 'var(--warning)' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text)' }}>{c.competitionName}</div>
                      <div className="text-sm text-muted">{c.pendingResponsesCount} pending answer{c.pendingResponsesCount !== 1 ? 's' : ''}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="badge badge-warning"><Clock size={11} /> {c.pendingResponsesCount}</span>
                    <ChevronRight size={16} style={{ color: 'var(--text-subtle)' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2 – Days list */}
      {step === 'days' && (
        <div>
          {loadingDays ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><span className="spinner spinner-lg" /></div>
          ) : days.length === 0 ? (
            <div className="empty-state"><p>No days with pending reviews in this competition.</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {days.map((d, i) => (
                <div
                  key={d.id}
                  className="card card-sm animate-fade-in"
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', animationDelay: `${i * 40}ms` }}
                  onClick={() => { setSelectedDay(d); setStep('questions'); }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="day-num">{d.dayNum}</div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text)' }}>{d.title}</div>
                      <div className="text-sm text-muted">{d.pendingResponsesCount} pending</div>
                    </div>
                  </div>
                  <ChevronRight size={16} style={{ color: 'var(--text-subtle)' }} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 3 – Questions list */}
      {step === 'questions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Pending questions */}
          <div>
            {loadingQs ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><span className="spinner spinner-lg" /></div>
            ) : questions.length === 0 ? (
              <div className="empty-state"><p>No paragraph questions pending in this day.</p></div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {questions.map((q, i) => (
                  <div
                    key={q.questionId}
                    className="card card-sm animate-fade-in"
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', animationDelay: `${i * 40}ms` }}
                    onClick={() => { setSelectedQuestion(q); setStep('grade'); }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text)' }}>{q.title}</div>
                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                        <span className="badge badge-warning"><Clock size={11} /> {q.pendingSubmissionsCount} pending</span>
                        <span className="badge badge-muted"><Award size={11} /> {q.questionMark} marks</span>
                      </div>
                    </div>
                    <ChevronRight size={16} style={{ color: 'var(--text-subtle)' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Grading History */}
          {(gradedQuestions.length > 0 || loadingGraded) && (
            <div>
              <button
                onClick={() => setHistoryOpen((v) => !v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text)', fontWeight: 600, fontSize: '0.95rem',
                  padding: '0.5rem 0', marginBottom: '0.5rem',
                }}
              >
                <History size={16} style={{ color: 'var(--success)' }} />
                Grading History
                <span className="badge badge-success" style={{ marginLeft: '0.25rem' }}>{gradedQuestions.length} graded</span>
                <ChevronDown
                  size={15}
                  style={{
                    marginLeft: 'auto',
                    color: 'var(--text-muted)',
                    transition: 'transform 0.2s',
                    transform: historyOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              </button>

              {historyOpen && (
                loadingGraded ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><span className="spinner" /></div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {gradedQuestions.map((q, i) => (
                      <div
                        key={q.questionId}
                        className="card card-sm animate-fade-in"
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', animationDelay: `${i * 40}ms`, borderLeft: '3px solid var(--success)' }}
                        onClick={() => { setSelectedQuestion(q); setStep('grade'); }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text)' }}>{q.title}</div>
                          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                            <span className="badge badge-success"><CheckCircle2 size={11} /> {q.gradedSubmissionsCount} graded</span>
                            <span className="badge badge-muted"><Award size={11} /> {q.questionMark} marks</span>
                          </div>
                        </div>
                        <ChevronRight size={16} style={{ color: 'var(--text-subtle)' }} />
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          )}

        </div>
      )}

      {/* Step 4 – Grade responses */}
      {step === 'grade' && (
        <div>
          {loadingDetails ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><span className="spinner spinner-lg" /></div>
          ) : questionDetails ? (
            <GradeStep
              details={questionDetails}
              gradingResponseId={gradingResponseId}
              setGradingResponseId={setGradingResponseId}
              onGrade={(responseId, dto) => gradeMutation.mutate({ responseId, dto })}
              isPending={gradeMutation.isPending}
            />
          ) : null}
        </div>
      )}
    </div>
  );
}

function GradeStep({
  details,
  gradingResponseId,
  setGradingResponseId,
  onGrade,
  isPending,
}: {
  details: QuestionReviewDetailsDto;
  gradingResponseId: number | null;
  setGradingResponseId: (id: number | null) => void;
  onGrade: (id: number, dto: GradeForm) => void;
  isPending: boolean;
}) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<GradeForm>();

  function startGrading(responseId: number, existingMark: number, existingComment?: string) {
    setGradingResponseId(responseId);
    reset({ earnedMark: existingMark, reviewerComment: existingComment ?? '' });
  }

  function submitGrade(data: GradeForm) {
    if (gradingResponseId == null) return;
    onGrade(gradingResponseId, data);
  }

  const pending = details.responses.filter((r) => !r.isManuallyGraded);
  const graded = details.responses.filter((r) => r.isManuallyGraded);

  return (
    <div>
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{details.questionTitle}</h2>
            <div className="text-sm text-muted">{details.competitionName} · Day {details.dayNum}</div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span className="badge badge-warning"><Clock size={11} /> {pending.length} pending</span>
            <span className="badge badge-success"><CheckCircle2 size={11} /> {graded.length} graded</span>
            <span className="badge badge-muted"><Award size={11} /> Max {details.questionMark} marks</span>
          </div>
        </div>
      </div>

      {/* Pending responses */}
      {pending.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--warning)' }}>Pending Review</h3>
          {pending.map((r) => (
            <div key={r.responseId} className="grading-response">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={14} style={{ color: 'var(--text-muted)' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{r.userName}</div>
                    <div className="text-xs text-muted">{r.email} · Submitted {format(new Date(r.submittedAt), 'MMM d, HH:mm')}</div>
                  </div>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => startGrading(r.responseId, 0, '')}>
                  Grade
                </button>
              </div>
              <div className="grading-answer-text">{r.answerData}</div>

              {gradingResponseId === r.responseId && (
                <form onSubmit={handleSubmit(submitGrade)} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.75rem' }}>
                    <div className="form-group">
                      <label className="form-label">Mark (/ {details.questionMark})</label>
                      <input type="number" min={0} max={details.questionMark} className={`form-input${errors.earnedMark ? ' error' : ''}`}
                        {...register('earnedMark', { required: true, min: 0, max: details.questionMark, valueAsNumber: true })} />
                      {errors.earnedMark && <span className="form-error">0–{details.questionMark}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Reviewer Comment</label>
                      <input type="text" placeholder="Optional feedback to contestant…" className="form-input" {...register('reviewerComment')} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setGradingResponseId(null)}>Cancel</button>
                    <button type="submit" className="btn btn-primary btn-sm" disabled={isPending}>
                      {isPending ? <span className="spinner" /> : <CheckCircle2 size={14} />} Save Grade
                    </button>
                  </div>
                </form>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Graded responses */}
      {graded.length > 0 && (
        <div>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--success)' }}>Graded</h3>
          {graded.map((r) => (
            <div key={r.responseId} className="grading-response graded">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={14} style={{ color: 'var(--success)' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{r.userName}</div>
                    <div className="text-xs text-muted">{r.email}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-success">{r.earnedMark} / {details.questionMark}</span>
                  <button className="btn btn-ghost btn-sm" onClick={() => startGrading(r.responseId, r.earnedMark, r.reviewerComment)}>Re-grade</button>
                </div>
              </div>
              <div className="grading-answer-text">{r.answerData}</div>
              {r.reviewerComment && (
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  Comment: "{r.reviewerComment}"
                </div>
              )}
              {gradingResponseId === r.responseId && (
                <form onSubmit={handleSubmit(submitGrade)} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.75rem' }}>
                    <div className="form-group">
                      <label className="form-label">Mark (/ {details.questionMark})</label>
                      <input type="number" min={0} max={details.questionMark} className="form-input"
                        {...register('earnedMark', { required: true, min: 0, max: details.questionMark, valueAsNumber: true })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Reviewer Comment</label>
                      <input type="text" className="form-input" {...register('reviewerComment')} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setGradingResponseId(null)}>Cancel</button>
                    <button type="submit" className="btn btn-primary btn-sm" disabled={isPending}>
                      {isPending ? <span className="spinner" /> : <CheckCircle2 size={14} />} Update Grade
                    </button>
                  </div>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
