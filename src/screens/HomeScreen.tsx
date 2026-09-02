import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProgressBar, Tag } from '../components/ui';
import { useApp } from '../store/AppProvider';
import { englishMinutesForDate } from '../data/seed';
import { formatHomeDate, greetingKey } from '../utils/date';

export function HomeScreen() {
  const { data, t, selectedDate, streakFor, isChecked } = useApp();
  const nav = useNavigate();
  const tasks = data.tasks.filter((task) => task.date === selectedDate);
  const done = tasks.filter((task) => task.completed).length;
  const total = tasks.length;
  const remaining = Math.max(0, total - done);
  const pct = total ? Math.round((done / total) * 100) : 0;
  const streak = streakFor('habit-fitness');
  const greet = greetingKey();
  const greetKey =
    greet === 'morning'
      ? 'home.greetingMorning'
      : greet === 'afternoon'
        ? 'home.greetingAfternoon'
        : 'home.greetingEvening';
  const englishPct = Math.round((englishMinutesForDate(data, selectedDate) / 30) * 100);

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <div className="greeting-date">{formatHomeDate(selectedDate)}</div>
          <h1 className="greeting">{t(greetKey, { name: data.user.greetingName })}</h1>
        </div>
        <button type="button" className="avatar" onClick={() => nav('/profile')} aria-label={t('nav.profile')}>
          C
        </button>
      </header>

      <section className="overview-card">
        <div className="ov-label">{t('home.overview')}</div>
        <div className="overview-stats">
          <div>
            <b>
              {done} / {total || 0}
            </b>
            <small>{t('home.todayTasks')}</small>
          </div>
          <div className="ov-divider" />
          <div>
            <b>
              {streak} {t('home.streakUnit')}
            </b>
            <small>{t('home.streak')}</small>
          </div>
        </div>
        <ProgressBar value={pct} />
        <div className="overview-foot">
          <span>{t('home.completion', { n: pct })}</span>
          <span>{t('home.remaining', { n: remaining })}</span>
        </div>
      </section>

      <div className="section-label">{t('home.quick')}</div>
      <div className="quick-grid">
        <button type="button" className="quick-item" onClick={() => nav('/notes/new')}>
          <div className="qi">✏️</div>
          {t('home.newNote')}
        </button>
        <button type="button" className="quick-item" onClick={() => nav('/check-in/photo')}>
          <div className="qi">📸</div>
          {t('home.checkin')}
        </button>
        <button type="button" className="quick-item" onClick={() => nav('/tasks/new')}>
          <div className="qi">✅</div>
          {t('home.addTask')}
        </button>
        <button type="button" className="quick-item" onClick={() => nav('/bookmarks')}>
          <div className="qi">🌐</div>
          {t('home.bookmarks')}
        </button>
      </div>

      <div className="section-label">{t('home.modules')}</div>
      <button type="button" className="card pressable module-card" onClick={() => nav('/spaces/space-learning')}>
        <div className="module-top">
          <div className="module-emoji" style={{ background: 'var(--color-blue-soft)' }}>
            📘
          </div>
          <div className="grow">
            <div className="task-title">{t('home.english')}</div>
            <div className="muted">{t('home.englishSub')}</div>
          </div>
          <Tag tone="blue">{englishPct}%</Tag>
        </div>
        <div style={{ marginTop: 12 }}>
          <ProgressBar value={englishPct} />
        </div>
      </button>

      <button type="button" className="card pressable module-card" onClick={() => nav('/check-in')}>
        <div className="module-top">
          <div className="module-emoji" style={{ background: 'var(--color-green-soft)' }}>
            🏃
          </div>
          <div className="grow">
            <div className="task-title">{t('home.fitness')}</div>
            <div className="muted">{t('home.fitnessStreak', { n: streak })}</div>
          </div>
          <Tag tone="green">{isChecked('habit-fitness') ? t('home.checked') : t('checkin.btnDo')}</Tag>
        </div>
        <div style={{ marginTop: 12 }}>
          <ProgressBar value={isChecked('habit-fitness') ? 100 : 40} color="green" />
        </div>
      </button>

      <button type="button" className="card pressable module-card" onClick={() => nav('/moments')}>
        <div className="module-top">
          <div className="module-emoji" style={{ background: 'var(--color-orange-soft)' }}>
            ▶
          </div>
          <div className="grow">
            <div className="task-title">{t('home.dailyRecord')}</div>
            <div className="muted">{t('home.dailyRecordSub')}</div>
          </div>
          <ChevronRight size={16} color="var(--color-text-tertiary)" />
        </div>
      </button>
    </main>
  );
}
