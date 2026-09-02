import { Check } from 'lucide-react';

export function Checkbox({
  done,
  important,
  onChange,
}: {
  done: boolean;
  important?: boolean;
  onChange?: () => void;
}) {
  return (
    <button
      type="button"
      className={`checkbox ${done ? 'done' : ''} ${important && !done ? 'important' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onChange?.();
      }}
      aria-checked={done}
      role="checkbox"
    >
      {done ? <Check size={14} strokeWidth={3} /> : null}
    </button>
  );
}
