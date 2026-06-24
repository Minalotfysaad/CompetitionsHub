import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, ToggleLeft } from 'lucide-react';
import { QuestionType, type CreateQuestionDto, type QuestionDto } from '../../types';

// Frontend-only sentinel for True/False (submitted as MultipleChoice)
const TF_TYPE = 'TrueFalse' as const;
type ExtendedQuestionType = QuestionType | typeof TF_TYPE;

interface Props {
  defaultValues?: QuestionDto;
  competitionDayId: number;
  onSubmit: (dto: CreateQuestionDto) => void;
  isPending?: boolean;
}

const QUESTION_TYPES: { value: ExtendedQuestionType; label: string }[] = [
  { value: QuestionType.MultipleChoice, label: 'Multiple Choice' },
  { value: TF_TYPE,                     label: 'True or False' },
  { value: QuestionType.ShortAnswer,    label: 'Short Answer' },
  { value: QuestionType.LinearScale,    label: 'Linear Scale' },
  { value: QuestionType.Grid,           label: 'Grid' },
  { value: QuestionType.Paragraph,      label: 'Paragraph' },
];

interface FormValues {
  title: string;
  description: string;
  type: QuestionType;
  displayOrder: number;
  isRequired: boolean;
  questionMark: number;
  // Multiple Choice
  mcOptions: { text: string }[];
  mcCorrect: number;
  // Short Answer
  saCorrectAnswer: string;
  // Linear Scale
  lsMin: number;
  lsMax: number;
  lsMinLabel: string;
  lsMaxLabel: string;
  lsCorrect: number;
  // Grid
  gridRows: { text: string }[];
  gridCols: { text: string }[];
  gridAnswers: Record<string, string>; // rowIdx -> colIdx
}

export default function QuestionBuilder({ defaultValues, competitionDayId, onSubmit, isPending }: Props) {
  const [questionType, setQuestionType] = useState<ExtendedQuestionType>(
    defaultValues?.type ?? QuestionType.MultipleChoice
  );

  const { register, handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      type: QuestionType.MultipleChoice,
      displayOrder: 1,
      isRequired: true,
      questionMark: 1,
      mcOptions: [{ text: '' }, { text: '' }],
      mcCorrect: 0,
      saCorrectAnswer: '',
      lsMin: 1,
      lsMax: 5,
      lsMinLabel: '',
      lsMaxLabel: '',
      lsCorrect: 1,
      gridRows: [{ text: '' }],
      gridCols: [{ text: '' }],
      gridAnswers: {},
    },
  });

  const { fields: mcFields, append: mcAppend, remove: mcRemove } = useFieldArray({ control, name: 'mcOptions' });
  const { fields: rowFields, append: rowAppend, remove: rowRemove } = useFieldArray({ control, name: 'gridRows' });
  const { fields: colFields, append: colAppend, remove: colRemove } = useFieldArray({ control, name: 'gridCols' });

  const watchedRows = watch('gridRows');
  const watchedCols = watch('gridCols');
  const lsMin = watch('lsMin');
  const lsMax = watch('lsMax');

  // Populate from existing question for edit mode
  useEffect(() => {
    if (!defaultValues) return;
    setQuestionType(defaultValues.type);

    const initialGridAnswers: Record<string, string> = {};
    if (defaultValues.grid?.answerKeys && defaultValues.grid.rows && defaultValues.grid.columns) {
      defaultValues.grid.answerKeys.forEach((ak) => {
        const ri = defaultValues.grid!.rows.indexOf(ak.rowKey);
        const ci = defaultValues.grid!.columns.indexOf(ak.columnKey);
        if (ri !== -1 && ci !== -1) {
          initialGridAnswers[String(ri)] = String(ci);
        }
      });
    }

    reset({
      title: defaultValues.title,
      description: defaultValues.description ?? '',
      type: defaultValues.type,
      displayOrder: defaultValues.displayOrder,
      isRequired: defaultValues.isRequired,
      questionMark: defaultValues.questionMark,
      mcOptions: defaultValues.options?.map((o) => ({ text: o.text })) ?? [{ text: '' }, { text: '' }],
      mcCorrect: defaultValues.correctAnswer ? Number(defaultValues.correctAnswer) : 0,
      saCorrectAnswer: defaultValues.correctAnswer ?? '',
      lsMin: defaultValues.linearScale?.minValue ?? 1,
      lsMax: defaultValues.linearScale?.maxValue ?? 5,
      lsMinLabel: defaultValues.linearScale?.minLabel ?? '',
      lsMaxLabel: defaultValues.linearScale?.maxLabel ?? '',
      lsCorrect: defaultValues.linearScale?.correctValue ?? 1,
      gridRows: defaultValues.grid?.rows.map((r) => ({ text: r })) ?? [{ text: '' }],
      gridCols: defaultValues.grid?.columns.map((c) => ({ text: c })) ?? [{ text: '' }],
      gridAnswers: initialGridAnswers,
    });
  }, [defaultValues, reset]);

  function buildDto(vals: FormValues): CreateQuestionDto {
    // True/False is stored as MultipleChoice on the backend
    const backendType = questionType === TF_TYPE ? QuestionType.MultipleChoice : questionType as QuestionType;

    const base = {
      title: vals.title,
      description: vals.description || undefined,
      type: backendType,
      displayOrder: Number(vals.displayOrder),
      isRequired: vals.isRequired,
      questionMark: Number(vals.questionMark),
      competitionDayId,
    };

    switch (questionType) {
      case TF_TYPE:
        return {
          ...base,
          multipleChoice: {
            options: ['True', 'False'],
            correctOptionIndex: Number(vals.mcCorrect),
          },
        };
      case QuestionType.MultipleChoice:
        return {
          ...base,
          multipleChoice: {
            options: vals.mcOptions.map((o) => o.text),
            correctOptionIndex: Number(vals.mcCorrect),
          },
        };
      case QuestionType.ShortAnswer:
        return { ...base, text: { correctAnswer: vals.saCorrectAnswer } };
      case QuestionType.LinearScale:
        return {
          ...base,
          linearScale: {
            minValue: Number(vals.lsMin),
            maxValue: Number(vals.lsMax),
            minLabel: vals.lsMinLabel || undefined,
            maxLabel: vals.lsMaxLabel || undefined,
            correctValue: Number(vals.lsCorrect),
          },
        };
      case QuestionType.Grid: {
        const rows = vals.gridRows.map((r) => r.text);
        const cols = vals.gridCols.map((c) => c.text);
        const answerKeys = rows
          .map((row, ri) => {
            const colIdx = vals.gridAnswers[String(ri)];
            if (colIdx === undefined || colIdx === '') return null;
            return { rowKey: row, columnKey: cols[Number(colIdx)] };
          })
          .filter(Boolean) as { rowKey: string; columnKey: string }[];
        return { ...base, grid: { rows, columns: cols, answerKeys } };
      }
      case QuestionType.Paragraph:
      default:
        return base;
    }
  }

  function onFormSubmit(vals: FormValues) {
    onSubmit(buildDto(vals));
  }

  const scaleSteps = Array.from({ length: Math.max(0, Number(lsMax) - Number(lsMin) + 1) }, (_, i) => Number(lsMin) + i);

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Type Selector */}
      <div className="form-group">
        <label className="form-label">Question Type <span className="required">*</span></label>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {QUESTION_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setQuestionType(t.value)}
              className={`role-btn${questionType === t.value ? ' active' : ''}`}
              style={{ flex: 'unset', padding: '0.5rem 1rem' }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Common fields */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '1rem', alignItems: 'flex-start' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="q-title">Question Title <span className="required">*</span></label>
          <input
            id="q-title"
            type="text"
            placeholder="Enter your question…"
            className={`form-input${errors.title ? ' error' : ''}`}
            {...register('title', { required: 'Title is required' })}
          />
          {errors.title && <span className="form-error">{errors.title.message}</span>}
        </div>
        <div className="form-group" style={{ minWidth: 100 }}>
          <label className="form-label" htmlFor="q-order">Order</label>
          <input id="q-order" type="number" min={1} className="form-input" {...register('displayOrder', { min: 1, valueAsNumber: true })} />
        </div>
        <div className="form-group" style={{ minWidth: 100 }}>
          <label className="form-label" htmlFor="q-mark">Marks <span className="required">*</span></label>
          <input id="q-mark" type="number" min={0} className="form-input" {...register('questionMark', { min: 0, valueAsNumber: true })} />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="q-desc">Description <span className="text-subtle">(optional)</span></label>
        <input id="q-desc" type="text" placeholder="Additional context for the question…" className="form-input" {...register('description')} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <input id="q-required" type="checkbox" {...register('isRequired')} style={{ width: 16, height: 16, accentColor: 'var(--primary)' }} />
        <label htmlFor="q-required" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>Required question</label>
      </div>

      {/* ── Type-specific sections ── */}

      {/* MULTIPLE CHOICE */}
      {questionType === QuestionType.MultipleChoice && (
        <div className="builder-section">
          <div className="builder-section-title">Options & Correct Answer</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {mcFields.map((field, idx) => (
              <div key={field.id} className="option-row">
                <input
                  type="radio"
                  name="mc-correct"
                  checked={Number(watch('mcCorrect')) === idx}
                  onChange={() => setValue('mcCorrect', idx)}
                  title="Mark as correct"
                  style={{ width: 18, height: 18, accentColor: 'var(--primary)', flexShrink: 0 }}
                />
                <input
                  type="text"
                  placeholder={`Option ${idx + 1}`}
                  className="form-input"
                  style={{ flex: 1 }}
                  {...register(`mcOptions.${idx}.text`, { required: 'Option text required' })}
                />
                {mcFields.length > 2 && (
                  <button type="button" className="btn btn-ghost btn-icon" onClick={() => mcRemove(idx)}>
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" className="btn btn-secondary btn-sm" style={{ marginTop: '0.75rem' }} onClick={() => mcAppend({ text: '' })}>
            <Plus size={14} /> Add Option
          </button>
          <p className="form-hint" style={{ marginTop: '0.5rem' }}>Select the radio button next to the correct answer.</p>
        </div>
      )}

      {/* TRUE OR FALSE */}
      {questionType === TF_TYPE && (
        <div className="builder-section">
          <div className="builder-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ToggleLeft size={16} /> True or False Options
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {(['True', 'False'] as const).map((label, idx) => (
              <div key={label} className="option-row">
                <input
                  type="radio"
                  name="tf-correct"
                  checked={Number(watch('mcCorrect')) === idx}
                  onChange={() => setValue('mcCorrect', idx)}
                  title="Mark as correct"
                  style={{ width: 18, height: 18, accentColor: 'var(--primary)', flexShrink: 0 }}
                />
                <div
                  className="form-input"
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    background: 'var(--surface-2)',
                    color: 'var(--text-muted)',
                    cursor: 'default',
                    userSelect: 'none',
                    fontWeight: 500,
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
          <p className="form-hint" style={{ marginTop: '0.75rem' }}>Select the radio button next to the correct answer. Options are fixed.</p>
        </div>
      )}

      {/* SHORT ANSWER */}
      {questionType === QuestionType.ShortAnswer && (
        <div className="builder-section">
          <div className="builder-section-title">Correct Answer</div>
          <div className="form-group">
            <label className="form-label" htmlFor="sa-answer">Expected Answer</label>
            <input id="sa-answer" type="text" placeholder="The exact correct answer" className="form-input" {...register('saCorrectAnswer', { required: 'Correct answer is required' })} />
            {errors.saCorrectAnswer && <span className="form-error">{errors.saCorrectAnswer.message}</span>}
            <span className="form-hint">Grading is case-insensitive exact match.</span>
          </div>
        </div>
      )}

      {/* LINEAR SCALE */}
      {questionType === QuestionType.LinearScale && (
        <div className="builder-section">
          <div className="builder-section-title">Scale Configuration</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Min Value</label>
              <input type="number" className="form-input" {...register('lsMin', { valueAsNumber: true })} />
            </div>
            <div className="form-group">
              <label className="form-label">Max Value</label>
              <input type="number" className="form-input" {...register('lsMax', { valueAsNumber: true })} />
            </div>
            <div className="form-group">
              <label className="form-label">Correct Value</label>
              <input type="number" className="form-input" {...register('lsCorrect', { valueAsNumber: true })} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Min Label</label>
              <input type="text" placeholder="e.g. Not at all" className="form-input" {...register('lsMinLabel')} />
            </div>
            <div className="form-group">
              <label className="form-label">Max Label</label>
              <input type="text" placeholder="e.g. Extremely" className="form-input" {...register('lsMaxLabel')} />
            </div>
          </div>
          {scaleSteps.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <div className="form-hint" style={{ marginBottom: '0.5rem' }}>Preview:</div>
              <div className="scale-buttons">
                {scaleSteps.map((v) => (
                  <div key={v} className={`scale-btn${v === Number(watch('lsCorrect')) ? ' selected' : ''}`} style={{ cursor: 'default' }}>{v}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* GRID */}
      {questionType === QuestionType.Grid && (
        <div className="builder-section">
          <div className="builder-section-title">Grid Configuration</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
            <div>
              <div className="form-hint" style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Rows</div>
              {rowFields.map((f, i) => (
                <div key={f.id} className="option-row">
                  <input type="text" placeholder={`Row ${i + 1}`} className="form-input" {...register(`gridRows.${i}.text`, { required: true })} />
                  {rowFields.length > 1 && (
                    <button type="button" className="btn btn-ghost btn-icon" onClick={() => rowRemove(i)}><Trash2 size={13} /></button>
                  )}
                </div>
              ))}
              <button type="button" className="btn btn-secondary btn-sm" style={{ marginTop: '0.5rem' }} onClick={() => rowAppend({ text: '' })}>
                <Plus size={13} /> Add Row
              </button>
            </div>
            <div>
              <div className="form-hint" style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Columns</div>
              {colFields.map((f, i) => (
                <div key={f.id} className="option-row">
                  <input type="text" placeholder={`Column ${i + 1}`} className="form-input" {...register(`gridCols.${i}.text`, { required: true })} />
                  {colFields.length > 1 && (
                    <button type="button" className="btn btn-ghost btn-icon" onClick={() => colRemove(i)}><Trash2 size={13} /></button>
                  )}
                </div>
              ))}
              <button type="button" className="btn btn-secondary btn-sm" style={{ marginTop: '0.5rem' }} onClick={() => colAppend({ text: '' })}>
                <Plus size={13} /> Add Column
              </button>
            </div>
          </div>
          {/* Answer key grid */}
          {watchedRows.length > 0 && watchedCols.length > 0 && (
            <div>
              <div className="form-hint" style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Answer Key (select one column per row)</div>
              <div style={{ overflowX: 'auto' }}>
                <table className="grid-table">
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left' }}>Row</th>
                      {watchedCols.map((c, ci) => <th key={ci}>{c.text || `Col ${ci + 1}`}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {watchedRows.map((r, ri) => (
                      <tr key={ri} className="grid-row">
                        <td>{r.text || `Row ${ri + 1}`}</td>
                        {watchedCols.map((_, ci) => (
                          <td key={ci}>
                            <input
                              type="radio"
                              name={`grid-answer-${ri}`}
                              className="grid-radio"
                              checked={watch(`gridAnswers.${ri}`) === String(ci)}
                              onChange={() => setValue(`gridAnswers.${ri}`, String(ci))}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PARAGRAPH */}
      {questionType === QuestionType.Paragraph && (
        <div className="builder-section">
          <div className="builder-section-title">Paragraph Question</div>
          <p className="form-hint">Paragraph questions require manual grading by an admin. No correct answer is configured here.</p>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
        <button type="submit" className="btn btn-primary" disabled={isPending}>
          {isPending ? <span className="spinner" /> : null}
          {isPending ? 'Saving…' : 'Save Question'}
        </button>
      </div>
    </form>
  );
}
