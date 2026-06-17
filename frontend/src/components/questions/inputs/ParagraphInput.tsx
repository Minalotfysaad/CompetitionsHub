interface Props {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export default function ParagraphInput({ value, onChange, disabled }: Props) {
  return (
    <textarea
      placeholder="Type your detailed answer here…"
      className="paragraph-textarea"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  );
}
