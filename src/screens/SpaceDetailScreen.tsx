import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { EmptyState, IconButton } from '../components/ui';
import { Checkbox } from '../components/Checkbox';
import { useApp } from '../store/AppProvider';
import { Plus, Trash2 } from 'lucide-react';

export function SpaceDetailScreen() {
  const { id } = useParams();
  const { data, t, lang, toggleTask, confirm, deleteSpace, toast } = useApp();
  const nav = useNavigate();
  const space = data.spaces.find((s) => s.id === id);

  if (!space) {
    return (
      <main className="page sub">
        <PageHeader title={t('spaces.title')} back />
        <EmptyState icon="📂" title={t('common.error')} />
      </main>
    );
  }

  const notes = data.notes.filter((n) => n.spaceId === space.id);
  const tasks = data.tasks.filter((task) => task.spaceId === space.id);
  const name = lang === 'zh' ? space.name : space.nameEn;

  return (
    <main className="page sub">
      <PageHeader
        title={name}
        back
        actions={
          <>
            <IconButton
              label={t('common.delete')}
              onClick={async () => {
                if (await confirm(t('confirm.deleteSpace'))) {
                  deleteSpace(space.id);
                  toast(t('spaces.deleted'));
                  nav('/spaces');
                }
              }}
            >
              <Trash2 size={16} />
            </IconButton>
            <IconButton label={t('notes.newTitle')} onClick={() => nav(`/notes/new?space=${space.id}`)}>
              <Plus size={18} />
            </IconButton>
          </>
        }
      />

      <div className="section-label">{t('spaces.notes')}</div>
      {notes.length === 0 ? (
        <EmptyState icon="✍️" title={t('spaces.detailEmpty')} text={t('notes.empty')} />
      ) : (
        notes.map((n) => (
          <button key={n.id} type="button" className="card pressable task-card" onClick={() => nav(`/notes/${n.id}`)}>
            <div className="task-title">{n.title}</div>
            <div className="muted">{n.body.slice(0, 48)}{n.body.length > 48 ? '…' : ''}</div>
          </button>
        ))
      )}

      <div className="section-label">{t('spaces.tasks')}</div>
      {tasks.length === 0 ? (
        <EmptyState icon="✅" title={t('tasks.empty')} />
      ) : (
        tasks.map((task) => (
          <div key={task.id} className="card task-card row">
            <Checkbox done={task.completed} onChange={() => toggleTask(task.id)} />
            <button type="button" className="grow" style={{ textAlign: 'left' }} onClick={() => nav(`/tasks/${task.id}`)}>
              <div className={task.completed ? 'task-title strike' : 'task-title'}>{task.title}</div>
            </button>
          </div>
        ))
      )}
    </main>
  );
}
