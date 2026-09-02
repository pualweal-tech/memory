import { ChevronRight, Globe, Settings, Sparkles, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { useApp } from '../store/AppProvider';
import { IMAGES } from '../utils/constants';

export function ProfileScreen() {
  const { data, t, streakFor } = useApp();
  const nav = useNavigate();
  const streak = streakFor('habit-fitness');

  return (
    <main className="page">
      <PageHeader title={t('profile.title')} />
      <div className="card profile-hero">
        <div className="avatar" style={{ width: 56, height: 56, fontSize: 22 }}>
          C
        </div>
        <div className="grow">
          <div style={{ fontWeight: 700, fontSize: 18 }}>{data.user.name}</div>
          <div className="muted">MEMORY</div>
        </div>
        <img src={IMAGES.sun} alt="" width={28} height={28} />
      </div>

      <div className="stat-row">
        <div className="stat-box">
          <b>{data.notes.length}</b>
          <span className="muted">{t('profile.statsNotes')}</span>
        </div>
        <div className="stat-box">
          <b>{data.tasks.filter((x) => x.completed).length}</b>
          <span className="muted">{t('profile.statsTasks')}</span>
        </div>
        <div className="stat-box">
          <b>{streak}</b>
          <span className="muted">{t('profile.statsStreak')}</span>
        </div>
      </div>

      {[
        { to: '/moments', icon: <Sparkles size={16} />, label: t('profile.moments') },
        { to: '/bookmarks', icon: <Globe size={16} />, label: t('profile.bookmarks') },
        { to: '/check-in', icon: <Flame size={16} />, label: t('profile.checkin') },
        { to: '/settings', icon: <Settings size={16} />, label: t('profile.settings') },
      ].map((item) => (
        <button key={item.to} type="button" className="card pressable list-link" onClick={() => nav(item.to)}>
          <span className="row">
            {item.icon}
            {item.label}
          </span>
          <ChevronRight size={16} color="var(--color-text-tertiary)" />
        </button>
      ))}
    </main>
  );
}
