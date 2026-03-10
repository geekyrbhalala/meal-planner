export function getWeekStartDate(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split('T')[0];
}

export function getWeekDates(weekStartDate: string): string[] {
  const dates: string[] = [];
  const start = new Date(weekStartDate + 'T00:00:00');
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

export function getPreviousWeekStart(weekStartDate: string): string {
  const d = new Date(weekStartDate + 'T00:00:00');
  d.setDate(d.getDate() - 7);
  return d.toISOString().split('T')[0];
}

export function getNextWeekStart(weekStartDate: string): string {
  const d = new Date(weekStartDate + 'T00:00:00');
  d.setDate(d.getDate() + 7);
  return d.toISOString().split('T')[0];
}

export function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatWeekRange(weekStartDate: string): string {
  const start = new Date(weekStartDate + 'T00:00:00');
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const startStr = start.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  const endStr = end.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  return `${startStr} - ${endStr}`;
}

export function getDayOfWeek(dateStr: string): number {
  return new Date(dateStr + 'T00:00:00').getDay();
}

export function isToday(dateStr: string): boolean {
  return dateStr === new Date().toISOString().split('T')[0];
}
