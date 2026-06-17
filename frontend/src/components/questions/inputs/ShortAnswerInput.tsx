interface Props {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export default function ShortAnswerInput({ value, onChange, disabled }: Props) {
  return (
    <input
      type="text"
      placeholder="Type your answer here…"
      className="form-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  );
}
