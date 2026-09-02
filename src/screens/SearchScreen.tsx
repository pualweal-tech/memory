import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { SearchBar } from '../components/SearchBar';
import { EmptyState } from '../components/ui';
import { useApp } from '../store/AppProvider';

export function SearchScreen() {
  const { data, t, lang } = useApp();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get('q') ?? '');
  const query = q.trim().toLowerCase();

  const results = useMemo(() => {
    if (!query) return [];
    const notes = data.notes
      .filter((n) => `${n.title} ${n.body} ${n.tags.join(' ')}`.toLowerCase().includes(query))
      .map((n) => ({ id: n.id, type: 'note' as const, title: n.title, to: `/notes/${n.id}` }));
    const tasks = data.tasks
      .filter((task) => task.title.toLowerCase().includes(query))
      .map((task) => ({ id: task.id, type: 'task' as const, title: task.title, to: `/tasks/${task.id}` }));
    const bms = data.bookmarks
      .filter((b) => `${b.title} ${b.description} ${b.tags.join(' ')}`.toLowerCase().includes(query))
      .map((b) => ({ id: b.id, type: 'bookmark' as const, title: b.title, to: `/bookmarks/${b.id}` }));
    const spaces = data.spaces
      .filter((s) => `${s.name} ${s.nameEn}`.toLowerCase().includes(query))
      .map((s) => ({
        id: s.id,
        type: 'space' as const,
        title: lang === 'zh' ? s.name : s.nameEn,
        to: `/spaces/${s.id}`,
      }));
    return [...notes, ...tasks, ...bms, ...spaces];
  }, [data, lang, query]);

  return (
    <main className="page sub">
      <PageHeader title={t('search.title')} back />
      <SearchBar value={q} onChange={setQ} placeholder={t('search.placeholder')} />
      {!query ? <p className="muted" style={{ marginTop: 16 }}>{t('search.hint')}</p> : null}
      {query && results.length === 0 ? <EmptyState icon="🔎" title={t('search.empty')} /> : null}
      {results.map((r) => (
        <button key={`${r.type}-${r.id}`} type="button" className="card pressable list-link" onClick={() => nav(r.to)}>
          <span>
            <div className="muted">
              {r.type === 'note'
                ? t('spaces.notes')
                : r.type === 'task'
                  ? t('nav.tasks')
                  : r.type === 'bookmark'
                    ? t('bookmarks.title')
                    : t('nav.spaces')}
            </div>
            <div className="task-title">{r.title}</div>
          </span>
        </button>
      ))}
    </main>
  );
}
