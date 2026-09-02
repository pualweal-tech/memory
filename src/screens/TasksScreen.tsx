import { Plus } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from '../components/Checkbox';
import { DateSelector } from '../components/DateSelector';
import { PageHeader } from '../components/PageHeader';
import { EmptyState, IconButton, ProgressBar, Tag } from '../components/ui';
import { useApp } from '../store/AppProvider';
import { weekAround } from '../utils/date';

export function TasksScreen() {
  const { data, t, lang, selectedDate, setDate, toggleTask, toast } = useApp();
  const nav = useNavigate();
  const dates = weekAround(selectedDate, 6);
  const marked = [...new Set(data.tasks.map((task) => task.date))];
  const tasks = data.tasks.filter((task) => task.date === selectedDate);
  const done = tasks.filter((task) => task.completed);
  const focus = tasks.filter((task) => !task.completed && task.priority === 'important');
  const open = tasks.filter((task) => !task.completed && task.priority !== 'important');
  const pct = tasks.length ? Math.round((done.length / tasks.length) * 100) : 0;

  const spaceName = (id?: string) => {
    if (!id) return '';
    const s = data.spaces.find((s) => s.id === id);
    if (!s) return '';
    return lang === 'zh' ? s.name : s.nameEn;
  };

  const groups = useMemo(
    () => [
      { key: 'focus', items: focus, title: t('tasks.sectionFocus'), icon: '🔥' },
      { key: 'open', items: open, title: t('tasks.sectionOpen'), icon: '⬜' },
      { key: 'done', items: done, title: t('tasks.sectionDone'), icon: '✅' },
    ],
    [done, focus, open, t],
  );

  return (
    <main className="page">
      <PageHeader
        title={t('tasks.title')}
        actions={
          <IconButton label={t('tasks.newTitle')} onClick={() => nav('/tasks/new')}>
            <Plus size={18} />
          </IconButton>
        }
      />
      <DateSelector dates={dates} selected={selectedDate} marked={marked} lang={lang} onSelect={setDate} />

      <div className="card" style={{ marginBottom: 8 }}>
        <div className="row">
          <div className="grow" style={{ fontWeight: 700 }}>{t('tasks.progress')}</div>
          <span className="muted">{t('tasks.doneOf', { done: done.length, total: tasks.length })}</span>
        </div>
        <div style={{ margin: '12px 0 8px' }}>
          <ProgressBar value={pct} />
        </div>
        <div className="legend">
          <span><i style={{ background: 'var(--color-green)' }} />{t('tasks.done', { n: done.length })}</span>
          <span><i style={{ background: 'var(--color-orange)' }} />{t('tasks.important', { n: focus.length })}</span>
          <span><i style={{ background: 'var(--color-text-tertiary)' }} />{t('tasks.pending', { n: open.length })}</span>
        </div>
      </div>

      {tasks.length === 0 ? <EmptyState icon="✅" title={t('tasks.empty')} /> : null}

      {groups.map((g) =>
        g.items.length ? (
          <section key={g.key}>
            <div className="section-h">
              <span>{g.icon}</span>
              {g.title}
            </div>
            {g.items.map((task) => (
              <div key={task.id} className="card pressable task-card" onClick={() => nav(`/tasks/${task.id}`)} role="button">
                <div className="row">
                  <Checkbox
                    done={task.completed}
                    important={task.priority === 'important'}
                    onChange={() => {
                      toggleTask(task.id);
                      toast(task.completed ? t('tasks.restored') : t('tasks.completedToast'));
                    }}
                  />
                  <div className="grow">
                    <div className={task.completed ? 'task-title strike' : 'task-title'}>{task.title}</div>
                    <div className="muted">
                      {task.completed && task.completedAt
                        ? t('tasks.completedAt', { time: task.completedAt.slice(11, 16) })
                        : `${task.dueTime ? t('tasks.due', { time: task.dueTime }) : t('tasks.today')}${spaceName(task.spaceId) ? ` · ${spaceName(task.spaceId)}` : ''}`}
                    </div>
                  </div>
                  {task.priority === 'important' && !task.completed ? <Tag tone="orange">{t('tasks.tagFocus')}</Tag> : null}
                  {task.spaceId === 'space-learning' && !task.completed && task.priority !== 'important' ? (
                    <Tag tone="purple">{lang === 'zh' ? '学习' : 'Study'}</Tag>
                  ) : null}
                </div>
              </div>
            ))}
          </section>
        ) : null,
      )}
    </main>
  );
}
