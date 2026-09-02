import { BarChart3 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { IconButton, ProgressBar } from '../components/ui';
import { englishMinutesForDate } from '../data/seed';
import { useApp } from '../store/AppProvider';
import { addDays } from '../utils/date';

export function CheckInScreen() {
  const { data, t, lang, selectedDate, streakFor, isChecked, checkIn, undoCheckIn, toast } = useApp();
  const nav = useNavigate();
  const [stats, setStats] = useState(false);
  const streak = streakFor('habit-fitness');
  const englishMin = englishMinutesForDate(data, selectedDate);

  return (
    <main className="page">
      <PageHeader
        title={t('checkin.title')}
        actions={
          <IconButton label={t('checkin.stats')} onClick={() => setStats(true)}>
            <BarChart3 size={18} />
          </IconButton>
        }
      />

      <section className="streak-card">
        <div className="ring" style={{ ['--p' as string]: Math.min(100, (streak / 7) * 100) }}>
          <span>
            {t('checkin.days', { n: streak }).replace(' ', '\n')}
          </span>
        </div>
        <div className="grow">
          <div style={{ fontWeight: 700, fontSize: 16 }}>{t('checkin.streakTitle', { n: streak })}</div>
          <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>{t('checkin.keep')}</div>
          <div className="streak-dots">
            {Array.from({ length: 7 }, (_, i) => {
              const date = addDays(selectedDate, i - 6);
              const on = data.checkIns.some((c) => c.habitId === 'habit-fitness' && c.date === date);
              const isToday = date === selectedDate;
              return (
                <i key={date}>{isToday ? t('checkin.todayMark') : on ? '✓' : ''}</i>
              );
            })}
          </div>
        </div>
      </section>

      <div className="section-label">{t('checkin.todayItems')}</div>
      {data.habits.map((h) => {
        const done = isChecked(h.id);
        const name = lang === 'zh' ? h.name : h.nameEn;
        let sub = '';
        let pill = t('checkin.btnGo');
        let pillCls = 'pill pill-soft';
        if (h.kind === 'fitness') {
          sub = t('checkin.doneToday', { n: streak || 0 });
          if (!done) {
            pill = t('checkin.btnDo');
            pillCls = 'pill pill-action';
            sub = t('checkin.notYet', { time: lang === 'zh' ? h.targetLabel : h.targetLabelEn });
          } else {
            pill = `✓ ${t('checkin.btnDone')}`;
            pillCls = 'pill pill-green';
          }
        } else if (h.kind === 'study') {
          sub = t('checkin.progress', { target: '30 min', n: englishMin });
          pill = done ? `✓ ${t('checkin.btnDone')}` : t('checkin.btnDo');
          pillCls = done ? 'pill pill-green' : 'pill pill-action';
        } else {
          sub = done
            ? t('checkin.doneToday', { n: streakFor(h.id) })
            : t('checkin.notYet', { time: h.goalTime ?? '07:00' });
          pill = done ? `✓ ${t('checkin.btnDone')}` : t('checkin.btnGo');
          pillCls = done ? 'pill pill-green' : 'pill pill-soft';
        }
        return (
          <div key={h.id} className="card habit-card">
            <div className="module-emoji">{h.icon}</div>
            <div className="grow">
              <div className="task-title">{name}</div>
              <div className="muted">{sub}</div>
            </div>
            <button
              type="button"
              className={pillCls}
              onClick={() => {
                if (h.kind === 'morning' && !done) {
                  nav('/check-in/photo?habit=' + h.id);
                  return;
                }
                if (done) {
                  undoCheckIn(h.id);
                  toast(t('checkin.undone'));
                } else {
                  checkIn(h.id, h.kind === 'study' ? { minutes: 30 } : undefined);
                  toast(t('checkin.success'));
                }
              }}
            >
              {pill}
            </button>
          </div>
        );
      })}

      <div className="card" style={{ marginTop: 8 }}>
        <div className="muted">{t('checkin.next')}</div>
        <div className="row" style={{ marginTop: 8 }}>
          <span style={{ fontSize: 28 }}>🏆</span>
          <div className="grow">
            <div className="task-title">{t('checkin.nextName')}</div>
            <div style={{ marginTop: 8 }}>
              <ProgressBar value={(streak / 14) * 100} />
            </div>
            <div className="muted" style={{ marginTop: 6 }}>
              {streak} / 14
            </div>
          </div>
        </div>
      </div>

      {stats ? (
        <>
          <div className="overlay" onClick={() => setStats(false)} />
          <div className="sheet">
            <h3 style={{ marginTop: 0 }}>{t('checkin.statsTitle')}</h3>
            {data.habits.map((h) => (
              <p key={h.id}>
                {lang === 'zh' ? h.name : h.nameEn}: {streakFor(h.id)} · {data.checkIns.filter((c) => c.habitId === h.id).length}
              </p>
            ))}
            <button type="button" className="btn btn-primary" onClick={() => setStats(false)}>
              {t('common.close')}
            </button>
          </div>
        </>
      ) : null}
    </main>
  );
}
