import { weekdayShort, dayNumber } from '../utils/date';
import type { Language } from '../types';

export function DateSelector({
  dates,
  selected,
  marked,
  lang,
  onSelect,
}: {
  dates: string[];
  selected: string;
  marked: string[];
  lang: Language;
  onSelect: (date: string) => void;
}) {
  return (
    <div className="date-row">
      {dates.map((d) => (
        <button
          key={d}
          type="button"
          className={`date-chip ${selected === d ? 'active' : ''} ${marked.includes(d) ? 'has' : ''}`}
          onClick={() => onSelect(d)}
        >
          <span>{weekdayShort(d, lang)}</span>
          <b>{dayNumber(d)}</b>
          <i className="dot" />
        </button>
      ))}
    </div>
  );
}
