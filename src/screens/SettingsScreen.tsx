import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { useApp } from '../store/AppProvider';
import type { Language, Theme } from '../types';

export function SettingsScreen() {
  const { t, lang, theme, setLanguage, setTheme, confirm, resetData, toast } = useApp();
  const nav = useNavigate();

  return (
    <main className="page sub">
      <PageHeader title={t('settings.title')} back />

      <div className="section-label">{t('settings.language')}</div>
      <div className="seg">
        {(['zh', 'en'] as Language[]).map((l) => (
          <button key={l} type="button" className={lang === l ? 'active' : ''} onClick={() => setLanguage(l)}>
            {l === 'zh' ? t('settings.chinese') : t('settings.english')}
          </button>
        ))}
      </div>

      <div className="section-label">{t('settings.theme')}</div>
      <div className="seg">
        {(['light', 'dark'] as Theme[]).map((th) => (
          <button key={th} type="button" className={theme === th ? 'active' : ''} onClick={() => setTheme(th)}>
            {th === 'light' ? t('settings.light') : t('settings.dark')}
          </button>
        ))}
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="task-title">{t('profile.about')}</div>
        <p className="muted">{t('profile.aboutBody')}</p>
      </div>

      <button
        type="button"
        className="btn btn-danger"
        style={{ marginTop: 20 }}
        onClick={async () => {
          if (await confirm(t('settings.resetConfirm'))) {
            resetData();
            toast(t('settings.resetDone'));
            nav('/');
          }
        }}
      >
        {t('settings.reset')}
      </button>
    </main>
  );
}
