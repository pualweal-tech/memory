export function todayISO(): string {
  const d = new Date();
  return toISODate(d);
}

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function addDays(iso: string, days: number): string {
  const d = parseISODate(iso);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

export function isSameDay(a: string, b: string): boolean {
  return a === b;
}

export function formatHomeDate(iso: string): string {
  const d = parseISODate(iso);
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  return `${months[d.getMonth()]}.${String(d.getDate()).padStart(2, '0')} ${weekdays[d.getDay()]}`;
}

export function formatMomentStamp(iso: string, today: string, lang: 'zh' | 'en'): string {
  const d = parseISODate(iso);
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const stamp = `${months[d.getMonth()]} ${d.getDate()}`;
  if (iso === today) return `${stamp} • ${lang === 'zh' ? 'TODAY' : 'TODAY'}`;
  if (iso === addDays(today, -1)) return `${stamp} • ${lang === 'zh' ? 'YESTERDAY' : 'YESTERDAY'}`;
  return stamp;
}

export function formatNoteMeta(iso: string, time: string): string {
  const d = parseISODate(iso);
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return `${months[d.getMonth()]} ${d.getDate()} , ${d.getFullYear()} • ${time}`;
}

export function weekdayShort(iso: string, lang: 'zh' | 'en'): string {
  const d = parseISODate(iso);
  if (lang === 'zh') return ['日', '一', '二', '三', '四', '五', '六'][d.getDay()];
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
}

export function dayNumber(iso: string): string {
  return String(parseISODate(iso).getDate());
}

export function formatTimeHM(date = new Date()): string {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export function formatDisplayTime(hhmm: string): string {
  const [hRaw, m] = hhmm.split(':');
  const h = Number(hRaw);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(h12).padStart(2, '0')}:${m} ${suffix}`;
}

export function greetingKey(now = new Date()): 'morning' | 'afternoon' | 'evening' {
  const h = now.getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
}

export function relativeUpdated(iso: string, today: string, lang: 'zh' | 'en'): string {
  const diff = Math.round(
    (parseISODate(today).getTime() - parseISODate(iso).getTime()) / 86400000,
  );
  if (diff <= 0) return lang === 'zh' ? '今天更新' : 'Updated today';
  if (diff === 1) return lang === 'zh' ? '昨天更新' : 'Updated yesterday';
  return lang === 'zh' ? `${diff} 天前更新` : `${diff} days ago`;
}

export function weekAround(center: string, count = 6): string[] {
  const d = parseISODate(center);
  const start = new Date(d);
  const weekday = d.getDay();
  const mondayOffset = weekday === 0 ? -6 : 1 - weekday;
  start.setDate(d.getDate() + mondayOffset);
  return Array.from({ length: count }, (_, i) => {
    const n = new Date(start);
    n.setDate(start.getDate() + i);
    return toISODate(n);
  });
}

export function uid(): string {
  return crypto.randomUUID();
}

export function nowISO(): string {
  return new Date().toISOString();
}
