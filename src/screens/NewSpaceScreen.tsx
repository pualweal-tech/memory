import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { Field } from '../components/ui';
import { useApp } from '../store/AppProvider';
import type { SpaceColor } from '../types';

const colors: SpaceColor[] = ['blue', 'green', 'purple', 'orange', 'pink', 'yellow'];
const icons = ['📚', '🏃', '💼', '🌐', '🎵', '🏡'];
const colorMap: Record<SpaceColor, string> = {
  blue: '#4E86E8',
  green: '#32C86A',
  purple: '#7950C8',
  orange: '#F28A43',
  pink: '#F2A7C4',
  yellow: '#F4C84A',
};

export function NewSpaceScreen() {
  const { t, addSpace, toast } = useApp();
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [color, setColor] = useState<SpaceColor>('blue');
  const [icon, setIcon] = useState('📚');

  return (
    <main className="page sub">
      <PageHeader title={t('spaces.newSpace')} back />
      <Field label={t('spaces.name')}>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label={t('spaces.color')}>
        <div className="color-picks">
          {colors.map((c) => (
            <button
              key={c}
              type="button"
              className={color === c ? 'active' : ''}
              style={{ background: colorMap[c] }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
      </Field>
      <div className="chip-row">
        {icons.map((ic) => (
          <button key={ic} type="button" className={`filter-chip ${icon === ic ? 'active' : ''}`} onClick={() => setIcon(ic)}>
            {ic}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          if (!name.trim()) return;
          const space = addSpace({ name: name.trim(), nameEn: name.trim(), color, icon });
          toast(t('spaces.created'));
          nav(`/spaces/${space.id}`, { replace: true });
        }}
      >
        {t('spaces.create')}
      </button>
    </main>
  );
}
