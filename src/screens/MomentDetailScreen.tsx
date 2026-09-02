import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { EmptyState, Field } from '../components/ui';
import { useApp } from '../store/AppProvider';
import { formatTimeHM } from '../utils/date';
import { IMAGES } from '../utils/constants';

export function MomentDetailScreen() {
  const { id } = useParams();
  const { data, t, confirm, deleteMoment, toast } = useApp();
  const nav = useNavigate();
  const moment = data.moments.find((m) => m.id === id);
  if (!moment) {
    return (
      <main className="page sub">
        <PageHeader title={t('moments.detail')} back />
        <EmptyState icon="✨" title={t('moments.empty')} />
      </main>
    );
  }
  return (
    <main className="page sub">
      <PageHeader title={moment.title} back />
      {moment.image ? <img className="cover-img" src={moment.image} alt="" /> : null}
      <p className="muted" style={{ marginTop: 12 }}>
        {moment.date} · {moment.time}
      </p>
      <p style={{ lineHeight: 1.7 }}>{moment.text}</p>
      <button
        type="button"
        className="btn btn-danger"
        onClick={async () => {
          if (await confirm(t('confirm.deleteMoment'))) {
            deleteMoment(moment.id);
            toast(t('moments.deleted'));
            nav(-1);
          }
        }}
      >
        {t('common.delete')}
      </button>
    </main>
  );
}

export function NewMomentScreen() {
  const { t, selectedDate, addMoment, toast } = useApp();
  const nav = useNavigate();
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [image, setImage] = useState<string | undefined>(undefined);

  return (
    <main className="page sub">
      <PageHeader title={t('moments.newTitle')} back />
      <Field label={t('tasks.name')}>
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
      </Field>
      <Field label={t('moments.caption')}>
        <textarea className="textarea" value={text} onChange={(e) => setText(e.target.value)} />
      </Field>
      <div className="photo-pick">
        {[IMAGES.breakfast, IMAGES.exercise, IMAGES.night, IMAGES.plan, IMAGES.working].map((src) => (
          <button key={src} type="button" onClick={() => setImage(src)} className={image === src ? 'selected-photo' : ''}>
            <img src={src} alt="" />
          </button>
        ))}
      </div>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          addMoment({
            date: selectedDate,
            time: formatTimeHM(),
            title: title.trim() || t('moments.title'),
            text: text.trim() || title,
            image,
            kind: image ? 'photo' : 'note',
            tint: 'blue',
          });
          toast(t('moments.saved'));
          nav('/moments');
        }}
      >
        {t('moments.save')}
      </button>
    </main>
  );
}
