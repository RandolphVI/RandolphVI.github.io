import type { CollectionEntry } from 'astro:content';

type Book = CollectionEntry<'reading'>;

/** Parse "N小时M分钟" → total minutes. Returns 0 if unparseable. */
export function parseReadingTime(s?: string): number {
  if (!s) return 0;
  const h = s.match(/(\d+)\s*小时/);
  const m = s.match(/(\d+)\s*分钟/);
  return (h ? parseInt(h[1], 10) : 0) * 60 + (m ? parseInt(m[1], 10) : 0);
}

export function fmtMinutes(min: number): string {
  if (min === 0) return '—';
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m} 分钟`;
  if (m === 0) return `${h} 小时`;
  return `${h} 小时 ${m} 分`;
}

export interface YearStats {
  year: number;
  finishedBooks: Book[];
  startedBooks: Book[];
  activeBooks: Book[];
  totalMinutes: number;
  longest?: { book: Book; minutes: number };
  shortest?: { book: Book; minutes: number };
  monthly: number[];
  monthlyByCategory: Array<Array<{ category: string; count: number }>>; // 12 × N
  categoryOrder: string[]; // categories sorted by total count desc
  topCategories: Array<{ name: string; count: number }>;
}

export function computeYearStats(year: number, allBooks: Book[]): YearStats {
  const finished = allBooks.filter(
    (b) => b.data.finishedDate && b.data.finishedDate.getFullYear() === year,
  );
  const started = allBooks.filter(
    (b) => b.data.startDate && b.data.startDate.getFullYear() === year,
  );
  const active = allBooks.filter((b) => {
    const s = b.data.startDate?.getFullYear();
    const f = b.data.finishedDate?.getFullYear();
    return (s && s === year) || (f && f === year);
  });

  const totalMinutes = finished.reduce(
    (sum, b) => sum + parseReadingTime(b.data.readingTime),
    0,
  );

  const withTime = finished
    .map((b) => ({ book: b, minutes: parseReadingTime(b.data.readingTime) }))
    .filter((x) => x.minutes > 0)
    .sort((a, b) => b.minutes - a.minutes);

  const monthly = new Array(12).fill(0);
  for (const b of finished) {
    monthly[b.data.finishedDate!.getMonth()]++;
  }

  // Per-month per-category breakdown (for stacked bar chart)
  const monthlyByCategory: Array<Map<string, number>> = Array.from({ length: 12 }, () => new Map());
  const totalCatCount = new Map<string, number>();
  for (const b of finished) {
    const m = b.data.finishedDate!.getMonth();
    const bc = b.data.bookCategory;
    const primary = bc ? bc.split('-')[0] : '其他';
    monthlyByCategory[m].set(primary, (monthlyByCategory[m].get(primary) || 0) + 1);
    totalCatCount.set(primary, (totalCatCount.get(primary) || 0) + 1);
  }
  const categoryOrder = [...totalCatCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);
  const monthlyByCategoryArr = monthlyByCategory.map((m) =>
    categoryOrder.map((cat) => ({ category: cat, count: m.get(cat) || 0 })),
  );

  const catCounts = new Map<string, number>();
  for (const b of active) {
    const bc = b.data.bookCategory;
    if (!bc) continue;
    const primary = bc.split('-')[0];
    catCounts.set(primary, (catCounts.get(primary) || 0) + 1);
  }
  const topCategories = [...catCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  return {
    year,
    finishedBooks: finished,
    startedBooks: started,
    activeBooks: active,
    totalMinutes,
    longest: withTime[0],
    shortest: withTime[withTime.length - 1],
    monthly,
    monthlyByCategory: monthlyByCategoryArr,
    categoryOrder,
    topCategories,
  };
}

/** Years that have any reading activity (start or finish). */
export function getActiveYears(allBooks: Book[]): number[] {
  const years = new Set<number>();
  for (const b of allBooks) {
    if (b.data.finishedDate) years.add(b.data.finishedDate.getFullYear());
    if (b.data.startDate) years.add(b.data.startDate.getFullYear());
  }
  return [...years].sort((a, b) => b - a);
}

export interface HeatmapDay {
  date: string; // YYYY-MM-DD
  count: number; // number of books "active" that day
  finished: string[]; // titles finished that day
  active: string[]; // titles still in-progress that day
}

/** Build a year heatmap. Each day = how many books were "active" (start ≤ day ≤ finish). */
export function buildHeatmap(year: number, allBooks: Book[]): HeatmapDay[] {
  const days: HeatmapDay[] = [];
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dStr = d.toISOString().slice(0, 10);
    const day: HeatmapDay = { date: dStr, count: 0, finished: [], active: [] };
    for (const b of allBooks) {
      const s = b.data.startDate;
      const f = b.data.finishedDate;
      if (!s && !f) continue;
      const dayMs = d.getTime();
      const sMs = s?.getTime() ?? -Infinity;
      const fMs = f?.getTime() ?? sMs;
      if (dayMs >= sMs && dayMs <= fMs) {
        day.count++;
        if (f && f.toISOString().slice(0, 10) === dStr) {
          day.finished.push(b.data.title);
        } else {
          day.active.push(b.data.title);
        }
      }
    }
    days.push(day);
  }
  return days;
}
