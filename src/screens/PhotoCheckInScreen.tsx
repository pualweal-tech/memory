import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { Field } from '../components/ui';
import { useApp } from '../store/AppProvider';
import { IMAGES } from '../utils/constants';
import { formatTimeHM } from '../utils/date';

const gallery = [IMAGES.breakfast, IMAGES.exercise, IMAGES.night, IMAGES.plan, IMAGES.working];

export function PhotoCheckInScreen() {
  const { data, t, lang, selectedDate, addMoment, checkIn, toast } = useApp();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const [image, setImage] = useState<string>(IMAGES.exercise);
  const [caption, setCaption] = useState('');
  const [habitId, setHabitId] = useState(params.get('habit') ?? 'habit-fitness');

  return (
    <main className="page sub">
      <PageHeader title={t('photo.title')} back />
      <div className="photo-pick">
        {gallery.map((src) => (
          <button key={src} type="button" className={image === src ? 'selected-photo' : ''} onClick={() => setImage(src)}>
            <img src={src} alt="" />
          </button>
        ))}
        <label className="file-pick">
          {t('photo.pick')}
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => setImage(String(reader.result));
              reader.readAsDataURL(file);
            }}
          />
        </label>
      </div>
      {image ? <img className="cover-img" src={image} alt="" /> : null}
      <Field label={t('photo.caption')}>
        <textarea className="textarea" value={caption} onChange={(e) => setCaption(e.target.value)} />
      </Field>
      <Field label={t('photo.habit')}>
        <select className="input" value={habitId} onChange={(e) => setHabitId(e.target.value)}>
          <option value="">{t('photo.none')}</option>
          {data.habits.map((h) => (
            <option key={h.id} value={h.id}>
              {lang === 'zh' ? h.name : h.nameEn}
            </option>
          ))}
        </select>
      </Field>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          addMoment({
            date: selectedDate,
            time: formatTimeHM(),
            title: t('photo.title'),
            text: caption || t('photo.title'),
            image,
            kind: 'photo',
            tint: 'green',
          });
          if (habitId) checkIn(habitId, { photo: image, note: caption });
          toast(t('photo.saved'));
          nav('/check-in');
        }}
      >
        {t('photo.save')}
      </button>
    </main>
  );
}
