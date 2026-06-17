interface Props {
  minValue: number;
  maxValue: number;
  minLabel?: string;
  maxLabel?: string;
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export default function LinearScaleInput({
  minValue,
  maxValue,
  minLabel,
  maxLabel,
  value,
  onChange,
  disabled,
}: Props) {
  const steps = Array.from(
    { length: Math.max(0, maxValue - minValue + 1) },
    (_, i) => minValue + i
  );

  return (
    <div className="scale-container">
      {(minLabel || maxLabel) && (
        <div className="scale-labels">
          <span>{minLabel || ''}</span>
          <span>{maxLabel || ''}</span>
        </div>
      )}
      <div className="scale-buttons">
        {steps.map((num) => {
          const strNum = String(num);
          const isSelected = value === strNum;
          return (
            <button
              key={num}
              type="button"
              className={`scale-btn${isSelected ? ' selected' : ''}`}
              onClick={() => onChange(strNum)}
              disabled={disabled}
            >
              {num}
            </button>
          );
        })}
      </div>
    </div>
  );
}
