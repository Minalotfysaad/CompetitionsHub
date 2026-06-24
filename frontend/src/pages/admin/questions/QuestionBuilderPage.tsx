import { useNavigate, useParams, Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, BookOpen, Award, CheckCircle2, Circle, Pencil, ListOrdered } from 'lucide-react';
import { questionsApi } from '../../../api/questions';
import { competitionDaysApi } from '../../../api/competitionDays';
import QuestionBuilder from '../../../components/questions/QuestionBuilder';
import type { CreateQuestionDto } from '../../../types';
import { QuestionType } from '../../../types';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const TYPE_LABELS: Record<number, string> = {
  [QuestionType.ShortAnswer]:    'Short Answer',
  [QuestionType.Paragraph]:      'Paragraph',
  [QuestionType.MultipleChoice]: 'Multiple Choice',
  [QuestionType.Grid]:           'Grid',
  [QuestionType.LinearScale]:    'Linear Scale',
};

const TYPE_COLORS: Record<number, string> = {
  [QuestionType.ShortAnswer]:    'badge-info',
  [QuestionType.Paragraph]:      'badge-muted',
  [QuestionType.MultipleChoice]: 'badge-primary',
  [QuestionType.Grid]:           'badge-success',
  [QuestionType.LinearScale]:    'badge-warning',
};

export default function QuestionBuilderPage() {
  const { competitionId, dayId, questionId } = useParams<{
    competitionId: string;
    dayId: string;
    questionId: string;
  }>();
  const isEdit = !!questionId;
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: existingQuestion } = useQuery({
    queryKey: ['question', Number(questionId)],
    queryFn: () => questionsApi.getById(Number(questionId)),
    enabled: isEdit,
  });

  const resolvedDayId = isEdit
    ? (existingQuestion?.competitionDayId ?? 0)
    : Number(dayId);

  // Live day data for the right panel
  const { data: dayData } = useQuery({
    queryKey: ['day', resolvedDayId],
    queryFn: () => competitionDaysApi.getById(resolvedDayId),
    enabled: resolvedDayId > 0,
    refetchInterval: false,
  });

  const createMutation = useMutation({
    mutationFn: (dto: CreateQuestionDto) => questionsApi.create(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['competition', Number(competitionId)] });
      qc.invalidateQueries({ queryKey: ['day', resolvedDayId] });
      toast.success('Question created!');
      navigate(`/admin/competitions/${competitionId}`);
    },
    onError: () => toast.error('Failed to create question'),
  });

  const updateMutation = useMutation({
    mutationFn: (dto: CreateQuestionDto) => questionsApi.update(Number(questionId), dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['competition', Number(competitionId)] });
      qc.invalidateQueries({ queryKey: ['question', Number(questionId)] });
      qc.invalidateQueries({ queryKey: ['day', resolvedDayId] });
      toast.success('Question updated!');
      navigate(`/admin/competitions/${competitionId}`);
    },
    onError: () => toast.error('Failed to update question'),
  });

  function handleSubmit(dto: CreateQuestionDto) {
    isEdit ? updateMutation.mutate(dto) : createMutation.mutate(dto);
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  const questions = [...(dayData?.questions ?? [])].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );
  const totalMarks = questions.reduce((s, q) => s + (q.questionMark ?? 0), 0);

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <div>
          <button
            className="btn btn-ghost btn-sm"
            style={{ marginBottom: '0.5rem' }}
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="page-title">{isEdit ? 'Edit Question' : 'Add Question'}</h1>
          <p className="page-subtitle">
            {isEdit ? 'Modify this question' : 'Create a new question for this day'}
          </p>
        </div>
      </div>

      {/* Two-column layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: '1.5rem',
          alignItems: 'flex-start',
        }}
      >
        {/* ── LEFT: Question Builder ── */}
        <div className="card" style={{ minWidth: 0 }}>
          <QuestionBuilder
            defaultValues={existingQuestion}
            competitionDayId={resolvedDayId}
            onSubmit={handleSubmit}
            isPending={isPending}
          />
        </div>

        {/* ── RIGHT: Day Preview Panel ── */}
        <div
          style={{
            position: 'sticky',
            top: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          {/* Day header card */}
          <div
            className="card card-sm"
            style={{
              background: 'var(--surface-2)',
              borderColor: 'var(--primary)',
              borderWidth: 1,
              borderStyle: 'solid',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.75rem',
              }}
            >
              <BookOpen size={15} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--primary)',
                }}
              >
                Competition Day Preview
              </span>
            </div>

            {dayData ? (
              <>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: '0.25rem' }}>
                  {dayData.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  {format(new Date(dayData.startDate), 'MMM d, yyyy HH:mm')}
                  {' → '}
                  {format(new Date(dayData.endDate), 'MMM d, yyyy HH:mm')}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-primary">
                    <ListOrdered size={11} /> {questions.length} question{questions.length !== 1 ? 's' : ''}
                  </span>
                  <span className="badge badge-muted">
                    <Award size={11} /> {totalMarks} marks
                  </span>
                </div>
              </>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Loading day…
              </div>
            )}
          </div>

          {/* Questions list card */}
          <div className="card card-sm" style={{ background: 'var(--surface-2)' }}>
            <div
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-subtle)',
                marginBottom: '0.75rem',
              }}
            >
              Questions
            </div>

            {questions.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '1.5rem 0.5rem',
                  color: 'var(--text-subtle)',
                  fontSize: '0.8rem',
                }}
              >
                <Circle size={24} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
                No questions yet. <br />
                Save your first one!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                {questions.map((q) => {
                  const isCurrentlyEditing = isEdit && Number(questionId) === q.id;
                  return (
                    <div
                      key={q.id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.5rem',
                        padding: '0.5rem 0.625rem',
                        background: isCurrentlyEditing
                          ? 'var(--primary-light)'
                          : 'var(--surface-3)',
                        borderRadius: 'var(--radius-sm)',
                        border: isCurrentlyEditing
                          ? '1px solid var(--primary)'
                          : '1px solid transparent',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {/* Order number */}
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          color: 'var(--text-subtle)',
                          minWidth: 18,
                          paddingTop: 2,
                        }}
                      >
                        #{q.displayOrder}
                      </span>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            color: isCurrentlyEditing ? 'var(--primary)' : 'var(--text)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                          title={q.title}
                        >
                          {q.title}
                        </div>
                        <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.2rem', flexWrap: 'wrap' }}>
                          <span className={`badge ${TYPE_COLORS[q.type] ?? 'badge-muted'}`} style={{ fontSize: '0.65rem' }}>
                            {TYPE_LABELS[q.type] ?? 'Unknown'}
                          </span>
                          <span className="badge badge-muted" style={{ fontSize: '0.65rem' }}>
                            <Award size={9} /> {q.questionMark}
                          </span>
                        </div>
                      </div>

                      {/* Edit link */}
                      <Link
                        to={`/admin/competitions/${competitionId}/questions/${q.id}/edit`}
                        className="btn btn-ghost btn-icon"
                        style={{ padding: '0.2rem', flexShrink: 0 }}
                        title="Edit"
                      >
                        {isCurrentlyEditing ? (
                          <CheckCircle2 size={13} style={{ color: 'var(--primary)' }} />
                        ) : (
                          <Pencil size={13} />
                        )}
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
