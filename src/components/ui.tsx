import type { CSSProperties, ReactNode } from 'react';

export function Card({
  children,
  className = '',
  onClick,
  style,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
}) {
  const cls = `card ${onClick ? 'pressable' : ''} ${className}`.trim();
  if (onClick) {
    return (
      <button type="button" className={cls} onClick={onClick} style={style}>
        {children}
      </button>
    );
  }
  return (
    <div className={cls} style={style}>
      {children}
    </div>
  );
}

export function IconButton({
  children,
  onClick,
  dark,
  label,
}: {
  children: ReactNode;
  onClick?: () => void;
  dark?: boolean;
  label: string;
}) {
  return (
    <button type="button" className={`icon-btn ${dark ? 'dark' : ''}`} onClick={onClick} aria-label={label}>
      {children}
    </button>
  );
}

export function Tag({
  children,
  tone = 'soft',
}: {
  children: ReactNode;
  tone?: 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'yellow' | 'soft';
}) {
  return <span className={`tag tag-${tone}`}>{children}</span>;
}

export function ProgressBar({
  value,
  color = 'gradient',
}: {
  value: number;
  color?: 'gradient' | 'green';
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={`progress ${color === 'green' ? 'green' : ''}`}>
      <span style={{ width: `${pct}%` }} />
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text?: string;
}) {
  return (
    <div className="empty">
      <div style={{ fontSize: 32 }}>{icon}</div>
      <h3>{title}</h3>
      {text ? <p>{text}</p> : null}
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}
