import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppProvider';

const items = [
  { to: '/notes/new', icon: '✍️', bg: '#3d5a80', key: 'note' },
  { to: '/check-in/photo', icon: '📸', bg: '#2f6f6a', key: 'photo' },
  { to: '/tasks/new', icon: '✅', bg: '#4b5c32', key: 'task' },
  { to: '/bookmarks/new', icon: '🌐', bg: '#5a4a78', key: 'web' },
  { to: '/voice', icon: '🎙️', bg: '#6a5340', key: 'voice' },
] as const;

export function CreateMenu() {
  const { createOpen, setCreateOpen, t } = useApp();
  const nav = useNavigate();
  if (!createOpen) return null;

  return (
    <div className="create-menu" onClick={() => setCreateOpen(false)}>
      <h2>{t('create.title')}</h2>
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          className="create-item"
          onClick={(e) => {
            e.stopPropagation();
            setCreateOpen(false);
            nav(item.to);
          }}
        >
          <span className="ci-icon" style={{ background: item.bg }}>
            {item.icon}
          </span>
          <span className="ci-text">
            <b>{t(`create.${item.key}`)}</b>
            <span>{t(`create.${item.key}Sub`)}</span>
          </span>
          <ChevronRight size={18} color="rgba(255,255,255,.6)" />
        </button>
      ))}
    </div>
  );
}
