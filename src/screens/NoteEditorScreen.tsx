import { Check, MoreHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Checkbox } from '../components/Checkbox';
import { PageHeader } from '../components/PageHeader';
import { IconButton, Tag } from '../components/ui';
import { useApp } from '../store/AppProvider';
import { formatNoteMeta, formatTimeHM } from '../utils/date';
import type { ChecklistItem, Note } from '../types';
import { uid } from '../utils/date';

export function NoteEditorScreen() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const { data, t, selectedDate, addNote, updateNote, deleteNote, confirm, toast } = useApp();
  const nav = useNavigate();
  const existing = data.notes.find((n) => n.id === id);
  const spaceId = params.get('space') ?? existing?.spaceId ?? 'space-learning';
  const space = data.spaces.find((s) => s.id === spaceId);

  const initial = useMemo<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>(
    () =>
      existing ?? {
        spaceId,
        title: '',
        body: '',
        tags: [],
        date: selectedDate,
        checklist: [],
      },
    [existing, selectedDate, spaceId],
  );

  const [form, setForm] = useState(initial);
  const [addingTag, setAddingTag] = useState(false);
  const [tagDraft, setTagDraft] = useState('');
  const [mode, setMode] = useState<'body' | 'heading' | 'list' | 'table'>('body');
  const [draftItem, setDraftItem] = useState('');

  const breadcrumb = t('notes.breadcrumb', {
    space: space ? space.name : t('spaces.title'),
    title: form.title || t('notes.editTitle'),
  });

  const toggleCheck = (cid: string) => {
    setForm((f) => ({
      ...f,
      checklist: f.checklist.map((c) => (c.id === cid ? { ...c, done: !c.done } : c)),
    }));
  };

  const persist = (next = form) => {
    if (existing) updateNote(existing.id, next);
    else {
      const created = addNote(next);
      nav(`/notes/${created.id}`, { replace: true });
    }
    toast(t('notes.saved'));
  };

  return (
    <main className="page sub">
      <PageHeader
        title={breadcrumb}
        back
        actions={
          <>
            <IconButton
              label={t('common.more')}
              onClick={async () => {
                if (!existing) return;
                if (await confirm(t('confirm.deleteNote'))) {
                  deleteNote(existing.id);
                  toast(t('notes.deleted'));
                  nav(-1);
                }
              }}
            >
              <MoreHorizontal size={16} />
            </IconButton>
            <IconButton dark label={t('notes.save')} onClick={() => persist()}>
              <Check size={16} />
            </IconButton>
          </>
        }
      />

      <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
        {form.tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setForm({ ...form, tags: form.tags.filter((x) => x !== tag) })}
          >
            <Tag tone="purple"># {tag}</Tag>
          </button>
        ))}
        {addingTag ? (
          <input
            className="input"
            style={{ width: 120, height: 32, padding: '0 10px' }}
            autoFocus
            placeholder={t('notes.tagPlaceholder')}
            value={tagDraft}
            onChange={(e) => setTagDraft(e.target.value)}
            onBlur={() => {
              if (tagDraft.trim()) setForm({ ...form, tags: [...form.tags, tagDraft.trim()] });
              setTagDraft('');
              setAddingTag(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.currentTarget.blur();
              }
            }}
          />
        ) : (
          <button type="button" onClick={() => setAddingTag(true)}>
            <Tag>{t('notes.addTag')}</Tag>
          </button>
        )}
      </div>

      <div className="muted" style={{ margin: '10px 0' }}>
        {formatNoteMeta(form.date, formatTimeHM())}
      </div>

      <input
        className="note-title-input"
        placeholder={t('notes.titlePlaceholder')}
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <textarea
        className="note-body-input"
        placeholder={t('notes.bodyPlaceholder')}
        value={form.body}
        onChange={(e) => setForm({ ...form, body: e.target.value })}
      />

      <div className="drop-image">{t('notes.imageDrop')}</div>

      {form.checklist.map((c: ChecklistItem) => (
        <div key={c.id} className="card check-row">
          <Checkbox done={c.done} onChange={() => toggleCheck(c.id)} />
          <span className={c.done ? 'strike' : ''}>{c.text}</span>
        </div>
      ))}
      <div className="row" style={{ marginBottom: 12 }}>
        <input
          className="input"
          placeholder={t('notes.addCheck')}
          value={draftItem}
          onChange={(e) => setDraftItem(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && draftItem.trim()) {
              setForm({
                ...form,
                checklist: [...form.checklist, { id: uid(), text: draftItem.trim(), done: false }],
              });
              setDraftItem('');
            }
          }}
        />
      </div>

      <div className="editor-bar">
        <button type="button" className={mode === 'body' ? 'active' : ''} onClick={() => setMode('body')}>
          {t('notes.toolbarBody')}
        </button>
        <button
          type="button"
          className={mode === 'heading' ? 'active' : ''}
          onClick={() => {
            setMode('heading');
            if (!form.title) setForm({ ...form, title: form.body.split('\n')[0] ?? '' });
          }}
        >
          {t('notes.toolbarHeading')}
        </button>
        <button
          type="button"
          className={mode === 'list' ? 'active' : ''}
          onClick={() => {
            setMode('list');
            if (!draftItem) setDraftItem('');
          }}
        >
          {t('notes.toolbarList')}
        </button>
        <button type="button" className={mode === 'table' ? 'active' : ''} onClick={() => setMode('table')}>
          {t('notes.toolbarTable')}
        </button>
      </div>
      <button type="button" className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => persist()}>
        {t('notes.save')}
      </button>
    </main>
  );
}
