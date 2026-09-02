import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { Field } from '../components/ui';
import { useApp } from '../store/AppProvider';
import type { Task, TaskPriority } from '../types';

export function TaskEditorScreen() {
  const { id } = useParams();
  const { data, t, selectedDate, addTask, updateTask, deleteTask, confirm, toast } = useApp();
  const nav = useNavigate();
  const existing = data.tasks.find((task) => task.id === id);

  const initial = useMemo<Omit<Task, 'id'>>(
    () =>
      existing ?? {
        title: '',
        date: selectedDate,
        dueTime: '23:59',
        spaceId: 'space-learning',
        priority: 'normal',
        completed: false,
        note: '',
      },
    [existing, selectedDate],
  );

  const [form, setForm] = useState(initial);
  const isEdit = Boolean(existing);

  return (
    <main className="page sub">
      <PageHeader title={isEdit ? t('tasks.editTitle') : t('tasks.newTitle')} back />
      <Field label={t('tasks.name')}>
        <input
          className="input"
          value={form.title}
          placeholder={t('tasks.namePlaceholder')}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </Field>
      <Field label={t('tasks.date')}>
        <input className="input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
      </Field>
      <Field label={t('tasks.dueTime')}>
        <input className="input" type="time" value={form.dueTime ?? ''} onChange={(e) => setForm({ ...form, dueTime: e.target.value })} />
      </Field>
      <Field label={t('tasks.space')}>
        <select
          className="input"
          value={form.spaceId ?? ''}
          onChange={(e) => setForm({ ...form, spaceId: e.target.value || undefined })}
        >
          <option value="">{t('tasks.none')}</option>
          {data.spaces.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label={t('tasks.priority')}>
        <div className="seg">
          {(['normal', 'important'] as TaskPriority[]).map((p) => (
            <button
              key={p}
              type="button"
              className={form.priority === p ? 'active' : ''}
              onClick={() => setForm({ ...form, priority: p })}
            >
              {p === 'important' ? t('tasks.importantLabel') : t('tasks.normal')}
            </button>
          ))}
        </div>
      </Field>
      <Field label={t('tasks.note')}>
        <textarea className="textarea" value={form.note ?? ''} onChange={(e) => setForm({ ...form, note: e.target.value })} />
      </Field>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          if (!form.title.trim()) return;
          if (existing) updateTask(existing.id, form);
          else addTask(form);
          toast(t('tasks.saved'));
          nav('/tasks');
        }}
      >
        {t('tasks.save')}
      </button>
      {isEdit ? (
        <button
          type="button"
          className="btn btn-danger"
          style={{ marginTop: 8 }}
          onClick={async () => {
            if (await confirm(t('confirm.deleteTask'))) {
              deleteTask(existing!.id);
              toast(t('tasks.deleted'));
              nav('/tasks');
            }
          }}
        >
          {t('common.delete')}
        </button>
      ) : null}
    </main>
  );
}

export function TaskDetailScreen() {
  const { id } = useParams();
  const { data, t, toggleTask, toast } = useApp();
  const nav = useNavigate();
  const task = data.tasks.find((task) => task.id === id);
  if (!task) {
    return (
      <main className="page sub">
        <PageHeader title={t('tasks.detail')} back />
      </main>
    );
  }
  const space = data.spaces.find((s) => s.id === task.spaceId);

  return (
    <main className="page sub">
      <PageHeader title={t('tasks.detail')} back />
      <div className="card">
        <h2 style={{ margin: '0 0 8px', fontSize: 20 }} className={task.completed ? 'strike' : ''}>
          {task.title}
        </h2>
        <p className="muted">
          {task.date} {task.dueTime ? `· ${task.dueTime}` : ''} {space ? `· ${space.name}` : ''}
        </p>
        {task.note ? <p>{task.note}</p> : null}
      </div>
      <button
        type="button"
        className="btn btn-primary"
        style={{ marginTop: 12 }}
        onClick={() => {
          toggleTask(task.id);
          toast(task.completed ? t('tasks.restored') : t('tasks.completedToast'));
        }}
      >
        {task.completed ? t('tasks.markUndone') : t('tasks.markDone')}
      </button>
      <button type="button" className="btn btn-secondary" style={{ marginTop: 8 }} onClick={() => nav(`/tasks/${task.id}/edit`)}>
        {t('common.edit')}
      </button>
    </main>
  );
}
