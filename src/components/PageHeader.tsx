import { ChevronLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from './ui';
import { useApp } from '../store/AppProvider';

export function PageHeader({
  title,
  back,
  actions,
}: {
  title: string;
  back?: boolean;
  actions?: ReactNode;
}) {
  const nav = useNavigate();
  const { t } = useApp();
  return (
    <header className="page-header">
      <div className="row" style={{ gap: 10, minWidth: 0 }}>
        {back ? (
          <IconButton label={t('common.back')} onClick={() => nav(-1)}>
            <ChevronLeft size={20} />
          </IconButton>
        ) : null}
        <h1 className="page-title">{title}</h1>
      </div>
      {actions ? <div className="header-actions">{actions}</div> : null}
    </header>
  );
}
