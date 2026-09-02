import { MoreHorizontal, Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { IconButton } from '../components/ui';
import { useApp } from '../store/AppProvider';
import { relativeUpdated } from '../utils/date';
import type { SpaceColor } from '../types';

const covers: Record<SpaceColor, string> = {
  blue: 'linear-gradient(135deg,#5b8def,#7aa4f5)',
  green: 'linear-gradient(135deg,#3dcf74,#7be0a2)',
  purple: 'linear-gradient(135deg,#7b5cd0,#a888ea)',
  orange: 'linear-gradient(135deg,#f28a43,#f6b27a)',
  pink: 'linear-gradient(135deg,#f2a7c4,#f7c8da)',
  yellow: 'linear-gradient(135deg,#f4c84a,#f7dd8a)',
};

export function SpacesScreen() {
  const { data, t, lang, selectedDate } = useApp();
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const spaces = useMemo(() => {
    const query = q.trim().toLowerCase();
    return data.spaces.filter((s) => {
      if (!query) return true;
      return `${s.name} ${s.nameEn}`.toLowerCase().includes(query);
    });
  }, [data.spaces, q]);

  const learning = data.spaces.find((s) => s.id === 'space-learning') ?? data.spaces[0];
  const learningNotes = data.notes.filter((n) => n.spaceId === learning?.id);

  return (
    <main className="page">
      <PageHeader
        title={t('spaces.title')}
        actions={
          <IconButton label={t('search.title')} onClick={() => (searchOpen ? nav('/search') : setSearchOpen(true))}>
            <Search size={18} />
          </IconButton>
        }
      />
      {searchOpen ? (
        <div style={{ marginBottom: 12 }}>
          <input
            className="input"
            autoFocus
            placeholder={t('spaces.searchPlaceholder')}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') nav(`/search?q=${encodeURIComponent(q)}`);
            }}
          />
        </div>
      ) : null}

      <div className="section-label">{t('spaces.all')}</div>
      {spaces.length === 0 ? (
        <div className="empty">
          <h3>{t('spaces.empty')}</h3>
        </div>
      ) : (
        <div className="space-grid">
          {spaces.map((s) => {
            const count = data.notes.filter((n) => n.spaceId === s.id).length;
            return (
              <button
                key={s.id}
                type="button"
                className="card pressable space-card"
                onClick={() => nav(`/spaces/${s.id}`)}
              >
                <div className="space-cover" style={{ background: covers[s.color] }}>
                  <MoreHorizontal size={16} />
                  <span className="emoji">{s.icon}</span>
                </div>
                <div className="space-body">
                  <h3>{lang === 'zh' ? s.name : s.nameEn}</h3>
                  <div className="muted">
                    {t('spaces.pages', { n: count })} · {relativeUpdated(s.updatedAt.slice(0, 10), selectedDate, lang)}
                  </div>
                </div>
              </button>
            );
          })}
          <button type="button" className="card new-space" onClick={() => nav('/spaces/new')}>
            <Plus size={22} />
            {t('spaces.newSpace')}
          </button>
        </div>
      )}

      {learning ? (
        <>
          <div className="section-label">
            {t('spaces.recent')} · {lang === 'zh' ? learning.name : learning.nameEn}
          </div>
          <div className="card">
            <div
              className="space-cover"
              style={{ background: covers[learning.color], borderRadius: 16, marginBottom: 8 }}
            >
              <b>
                {t('home.english')} / English
              </b>
              <span className="emoji">{learning.icon}</span>
            </div>
            {learningNotes.slice(0, 2).map((n) => (
              <button key={n.id} type="button" className="recent-entry" onClick={() => nav(`/notes/${n.id}`)}>
                <span>{n.title.includes('打卡') ? '🗓️' : '📝'}</span>
                <span className="grow">{n.title}</span>
                <span className="tag tag-soft">
                  {n.checklist.length ? `${n.checklist.length} rows` : `${Math.max(1, n.body.length > 40 ? 6 : 1)} notes`}
                </span>
              </button>
            ))}
          </div>
        </>
      ) : null}
    </main>
  );
}
