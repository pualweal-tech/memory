import { useApp } from '../store/AppProvider';

export function ToastHost() {
  const { toasts } = useApp();
  if (!toasts.length) return null;
  return (
    <div className="toast-stack">
      {toasts.map((t) => (
        <div key={t.id} className="toast">
          {t.text}
        </div>
      ))}
    </div>
  );
}

export function ConfirmHost() {
  const { confirmState, answerConfirm, t } = useApp();
  if (!confirmState) return null;
  return (
    <>
      <div className="overlay" onClick={() => answerConfirm(false)} />
      <div className="modal" role="dialog">
        <h3>{t('common.confirm')}</h3>
        <p>{confirmState.message}</p>
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={() => answerConfirm(false)}>
            {t('common.cancel')}
          </button>
          <button type="button" className="btn btn-primary" onClick={() => answerConfirm(true)}>
            {t('common.confirm')}
          </button>
        </div>
      </div>
    </>
  );
}
