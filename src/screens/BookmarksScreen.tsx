import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { SearchBar } from '../components/SearchBar';
import { EmptyState, IconButton, Tag } from '../components/ui';
import { useApp } from '../store/AppProvider';
import type { Bookmark } from '../types';

const thumbs: Record<Bookmark['category'], { bg: string; icon: string }> = {
  design: { bg: '#dce7fb', icon: '🎨' },
  dev: { bg: '#ddf7e7', icon: '⚡️' },
  inspire: { bg: '#fbe4ed', icon: '🎭' },
  other: { bg: '#fff2c7', icon: '🔗' },
};

const tagTone = (tag: string) => {
  if (tag === '设计' || tag.toLowerCase() === 'design') return 'purple' as const;
  if (tag === '开发' || tag.toLowerCase() === 'dev') return 'blue' as const;
  if (tag === '灵感' || tag.toLowerCase() === 'inspire') return 'green' as const;
  return 'soft' as const;
};

export function BookmarksScreen() {
  const { data, t } = useApp();
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<'all' | Bookmark['category']>('all');

  const counts = {
    all: data.bookmarks.length,
    design: data.bookmarks.filter((b) => b.category === 'design').length,
    dev: data.bookmarks.filter((b) => b.category === 'dev').length,
    inspire: data.bookmarks.filter((b) => b.category === 'inspire').length,
  };

  const list = useMemo(() => {
    return data.bookmarks.filter((b) => {
      if (cat !== 'all' && b.category !== cat) return false;
      const s = `${b.title} ${b.description} ${b.domain} ${b.tags.join(' ')}`.toLowerCase();
      return s.includes(q.trim().toLowerCase());
    });
  }, [cat, data.bookmarks, q]);

  return (
    <main className="page">
      <PageHeader
        title={t('bookmarks.title')}
        actions={
          <IconButton label={t('bookmarks.newTitle')} onClick={() => nav('/bookmarks/new')}>
            <Plus size={18} />
          </IconButton>
        }
      />
      <SearchBar value={q} onChange={setQ} placeholder={t('bookmarks.search')} />
      <div className="chip-row">
        {(['all', 'design', 'dev', 'inspire'] as const).map((c) => (
          <button key={c} type="button" className={`filter-chip ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>
            {t(`bookmarks.${c}`)} {counts[c]}
          </button>
        ))}
      </div>
      {list.length === 0 ? <EmptyState icon="🌐" title={t('bookmarks.empty')} /> : null}
      {list.map((b) => (
        <button key={b.id} type="button" className="card pressable bm-card" onClick={() => nav(`/bookmarks/${b.id}`)}>
          <div className="bm-thumb" style={{ background: thumbs[b.category].bg }}>
            {thumbs[b.category].icon}
          </div>
          <div className="grow">
            <div className="bm-domain">{b.domain}</div>
            <h3>{b.title}</h3>
            <div className="muted">{b.description}</div>
            <div className="row" style={{ marginTop: 8, gap: 6 }}>
              {b.tags.map((tag) => (
                <Tag key={tag} tone={tagTone(tag)}>
                  {tag}
                </Tag>
              ))}
            </div>
          </div>
        </button>
      ))}
    </main>
  );
}
