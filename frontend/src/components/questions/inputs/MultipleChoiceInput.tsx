import type { QuestionOptionDto } from '../../../types';

interface Props {
  options: QuestionOptionDto[];
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export default function MultipleChoiceInput({ options, value, onChange, disabled }: Props) {
  return (
    <div className="mc-options">
      {options.map((option, idx) => {
        const strIdx = String(idx);
        const isSelected = value === strIdx;
        return (
          <label
            key={option.id}
            className={`mc-option${isSelected ? ' selected' : ''}`}
          >
            <input
              type="radio"
              name={`mc-option-${option.id}`}
              checked={isSelected}
              onChange={() => onChange(strIdx)}
              disabled={disabled}
            />
            <span className="mc-option-label">{option.text}</span>
          </label>
        );
      })}
    </div>
  );
}
