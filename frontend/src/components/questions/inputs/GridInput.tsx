import { useMemo } from 'react';

interface Props {
  rows: string[];
  columns: string[];
  value: string; // JSON: '{"Row 1": "Col A", ...}'
  onChange: (val: string) => void;
  disabled?: boolean;
}

export default function GridInput({ rows, columns, value, onChange, disabled }: Props) {
  const selectedAnswers = useMemo<Record<string, string>>(() => {
    try {
      return value ? JSON.parse(value) : {};
    } catch {
      return {};
    }
  }, [value]);

  const handleCellSelect = (row: string, col: string) => {
    const updated = {
      ...selectedAnswers,
      [row]: col,
    };
    onChange(JSON.stringify(updated));
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="grid-table">
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Row</th>
            {columns.map((col, ci) => (
              <th key={ci}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="grid-row">
              <td>{row}</td>
              {columns.map((col, ci) => {
                const isChecked = selectedAnswers[row] === col;
                return (
                  <td key={ci}>
                    <input
                      type="radio"
                      name={`grid-row-${ri}-${row}`}
                      className="grid-radio"
                      checked={isChecked}
                      onChange={() => handleCellSelect(row, col)}
                      disabled={disabled}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
