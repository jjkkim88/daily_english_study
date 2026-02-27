export type YearGroup = {
  year: string; // e.g. 2026
  months: string[]; // e.g. ["2026-02","2026-01"]
  datesByMonth: Record<string, string[]>;
};

export function monthKey(date: string): string {
  return date.slice(0, 7);
}

export function yearKey(date: string): string {
  return date.slice(0, 4);
}

export function groupByYearMonth(dates: string[]): YearGroup[] {
  const years = new Map<string, Map<string, string[]>>();

  for (const d of dates) {
    const y = yearKey(d);
    const m = monthKey(d);
    if (!years.has(y)) years.set(y, new Map());
    const months = years.get(y)!;
    const arr = months.get(m) ?? [];
    arr.push(d);
    months.set(m, arr);
  }

  const out: YearGroup[] = [];
  for (const [y, months] of years.entries()) {
    const monthKeys = Array.from(months.keys()).sort().reverse();
    const datesByMonth: Record<string, string[]> = {};
    for (const mk of monthKeys) {
      datesByMonth[mk] = (months.get(mk) ?? []).sort().reverse();
    }
    out.push({ year: y, months: monthKeys, datesByMonth });
  }

  return out.sort((a, b) => (a.year < b.year ? 1 : -1));
}

export function defaultSelectedMonth(dates: string[]): string {
  return dates.length ? monthKey(dates[0]) : '';
}
