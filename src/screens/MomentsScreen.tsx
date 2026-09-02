import { CalendarDays, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { EmptyState, IconButton } from '../components/ui';
import { useApp } from '../store/AppProvider';
import { formatDisplayTime, formatMomentStamp } from '../utils/date';

const tints: Record<string, string> = {
  blue: '#dce7fb',
  purple: '#e8ddf8',
  green: '#ddf7e7',
  orange: '#fce4d4',
  yellow: '#fff2c7',
};

export function MomentsScreen() {
  const { data, t, lang, selectedDate, setDate } = useApp();
  const nav = useNavigate();
  const [pickDate, setPickDate] = useState(false);
  const grouped = useMemo(() => {
    const map = new Map<string, typeof data.moments>();
    [...data.moments]
      .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`))
      .forEach((m) => {
        const list = map.get(m.date) ?? [];
        list.push(m);
        map.set(m.date, list);
      });
    return [...map.entries()];
  }, [data.moments]);

  return (
    <main className="page">
      <PageHeader
        title={t('moments.title')}
        actions={
          <>
            <IconButton label={t('common.today')} onClick={() => setPickDate(true)}>
              <CalendarDays size={18} />
            </IconButton>
            <IconButton label={t('moments.add')} onClick={() => nav('/moments/new')}>
              <Plus size={18} />
            </IconButton>
          </>
        }
      />

      {grouped.length === 0 ? <EmptyState icon="✨" title={t('moments.empty')} /> : null}

      {grouped.map(([date, items]) => {
        const [hero, ...rest] = items;
        return (
          <section key={date}>
            <div className="stamp">{formatMomentStamp(date, selectedDate, lang)}</div>
            {hero ? (
              <button type="button" className="card moment-hero" onClick={() => nav(`/moments/${hero.id}`)}>
                <div className="cover" style={{ background: tints[hero.tint] }}>
                  {hero.image ? <img src={hero.image} alt="" /> : <span>📚</span>}
                  <span className="time-pill">{formatDisplayTime(hero.time)}</span>
                </div>
                <p>{hero.text}</p>
              </button>
            ) : null}
            {rest.length ? (
              <div className="moment-grid">
                {rest.map((m) => (
                  <button key={m.id} type="button" className="card moment-mini" onClick={() => nav(`/moments/${m.id}`)}>
                    <div className="art" style={{ background: tints[m.tint] }}>
                      {m.image ? <img src={m.image} alt="" /> : m.kind === 'checkin' ? '🏋️' : '🍵'}
                    </div>
                    <div className="cap">
                      {m.title} • {m.time}
                    </div>
                  </button>
                ))}
              </div>
            ) : null}
          </section>
        );
      })}

      {pickDate ? (
        <>
          <div className="overlay" onClick={() => setPickDate(false)} />
          <div className="sheet">
            <h3 style={{ marginTop: 0 }}>{t('tasks.date')}</h3>
            <input
              className="input"
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setDate(e.target.value);
                setPickDate(false);
              }}
            />
          </div>
        </>
      ) : null}
    </main>
  );
}
