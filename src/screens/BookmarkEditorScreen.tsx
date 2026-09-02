import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { EmptyState, Field, Tag } from '../components/ui';
import { useApp } from '../store/AppProvider';
import type { Bookmark } from '../types';

function domainFrom(url: string) {
  try {
    return new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace(/^www\./, '').toUpperCase();
  } catch {
    return url.toUpperCase();
  }
}

export function BookmarkDetailScreen() {
  const { id } = useParams();
  const { data, t, confirm, deleteBookmark, toast } = useApp();
  const nav = useNavigate();
  const item = data.bookmarks.find((b) => b.id === id);
  if (!item) {
    return (
      <main className="page sub">
        <PageHeader title={t('bookmarks.title')} back />
        <EmptyState icon="🌐" title={t('bookmarks.empty')} />
      </main>
    );
  }
  return (
    <main className="page sub">
      <PageHeader title={t('bookmarks.title')} back />
      <div className="card">
        <div className="bm-domain">{item.domain}</div>
        <h2 style={{ margin: '8px 0' }}>{item.title}</h2>
        <p className="muted">{item.description}</p>
        <div className="row" style={{ gap: 6, marginTop: 8 }}>
          {item.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </div>
      <a className="btn btn-primary" style={{ marginTop: 12 }} href={item.url} target="_blank" rel="noreferrer">
        {t('bookmarks.open')}
      </a>
      <button
        type="button"
        className="btn btn-danger"
        style={{ marginTop: 8 }}
        onClick={async () => {
          if (await confirm(t('confirm.deleteBookmark'))) {
            deleteBookmark(item.id);
            toast(t('bookmarks.deleted'));
            nav('/bookmarks');
          }
        }}
      >
        {t('common.delete')}
      </button>
    </main>
  );
}

export function NewBookmarkScreen() {
  const { t, selectedDate, addBookmark, toast } = useApp();
  const nav = useNavigate();
  const [url, setUrl] = useState('https://');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Bookmark['category']>('design');
  const [tags, setTags] = useState('设计');

  const guessed = useMemo(() => domainFrom(url), [url]);

  return (
    <main className="page sub">
      <PageHeader title={t('bookmarks.newTitle')} back />
      <Field label={t('bookmarks.url')}>
        <input
          className="input"
          value={url}
          placeholder={t('bookmarks.urlPlaceholder')}
          onChange={(e) => setUrl(e.target.value)}
        />
      </Field>
      <Field label={t('bookmarks.titleField')}>
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
      </Field>
      <Field label={t('bookmarks.desc')}>
        <textarea className="textarea" value={description} onChange={(e) => setDescription(e.target.value)} />
      </Field>
      <Field label={t('bookmarks.category')}>
        <div className="chip-row">
          {(['design', 'dev', 'inspire', 'other'] as const).map((c) => (
            <button key={c} type="button" className={`filter-chip ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>
              {t(`bookmarks.${c}`)}
            </button>
          ))}
        </div>
      </Field>
      <Field label={t('bookmarks.tags')}>
        <input className="input" value={tags} onChange={(e) => setTags(e.target.value)} />
      </Field>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          if (!url.includes('.')) {
            toast(t('bookmarks.invalid'));
            return;
          }
          addBookmark({
            url: url.startsWith('http') ? url : `https://${url}`,
            domain: guessed,
            title: title.trim() || guessed,
            description,
            category,
            tags: tags.split(/[,，]/).map((x) => x.trim()).filter(Boolean),
            date: selectedDate,
          });
          toast(t('bookmarks.saved'));
          nav('/bookmarks');
        }}
      >
        {t('bookmarks.save')}
      </button>
    </main>
  );
}
