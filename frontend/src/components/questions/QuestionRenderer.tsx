import { QuestionType, type QuestionContestantDto } from '../../types';
import MultipleChoiceInput from './inputs/MultipleChoiceInput';
import ShortAnswerInput from './inputs/ShortAnswerInput';
import LinearScaleInput from './inputs/LinearScaleInput';
import GridInput from './inputs/GridInput';
import ParagraphInput from './inputs/ParagraphInput';

interface Props {
  question: QuestionContestantDto;
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export default function QuestionRenderer({ question, value, onChange, disabled }: Props) {
  const renderInput = () => {
    switch (question.type) {
      case QuestionType.MultipleChoice:
        return (
          <MultipleChoiceInput
            options={question.options ?? []}
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
        );
      case QuestionType.ShortAnswer:
        return (
          <ShortAnswerInput
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
        );
      case QuestionType.LinearScale:
        return (
          <LinearScaleInput
            minValue={question.linearScale?.minValue ?? 1}
            maxValue={question.linearScale?.maxValue ?? 5}
            minLabel={question.linearScale?.minLabel}
            maxLabel={question.linearScale?.maxLabel}
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
        );
      case QuestionType.Grid:
        return (
          <GridInput
            rows={question.grid?.rows ?? []}
            columns={question.grid?.columns ?? []}
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
        );
      case QuestionType.Paragraph:
        return (
          <ParagraphInput
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
        );
      default:
        return <div className="text-danger">Unsupported question type.</div>;
    }
  };

  return (
    <div className="question-card">
      <div className="question-header">
        <div>
          <h4 className="question-title">
            {question.title}
            {question.isRequired && <span className="required" style={{ color: 'var(--danger)', marginLeft: '4px' }}>*</span>}
          </h4>
          {question.description && (
            <p className="question-desc">{question.description}</p>
          )}
        </div>
        <span className="question-mark">{question.questionMark} pts</span>
      </div>
      <div className="question-body">{renderInput()}</div>
    </div>
  );
}
