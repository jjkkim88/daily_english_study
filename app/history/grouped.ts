export type HistoryGroup = {
  key: string; // e.g., 2026-02
  label: string;
  dates: string[];
};

export function monthKey(date: string): string {
  return date.slice(0, 7);
}

export function groupByMonth(dates: string[]): HistoryGroup[] {
  const map = new Map<string, string[]>();
  for (const d of dates) {
    const k = monthKey(d);
    const arr = map.get(k) ?? [];
    arr.push(d);
    map.set(k, arr);
  }

  const groups = Array.from(map.entries())
    .map(([k, ds]) => ({
      key: k,
      label: k,
      dates: ds.sort().reverse(),
    }))
    .sort((a, b) => (a.key < b.key ? 1 : -1));

  return groups;
}
