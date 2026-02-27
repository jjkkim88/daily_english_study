import fs from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();
const dataDir = path.join(repoRoot, 'data');
const sourcesDir = path.join(repoRoot, 'sources');

export type TodayStudy = {
  date?: string;
  generatedAt?: string;
  vocab?: string[];
  sentences?: string[];
};

export type TodayDelta = {
  date?: string;
  title?: string;
  link?: string;
  vocab?: string;
  sentences?: string;
};

export type HistoryEntry = {
  date: string;
  archivedAt?: string;
  today_study?: TodayStudy;
  today_delta?: TodayDelta;
  message?: string;
};

async function readJson<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function readTodayStudy(): Promise<TodayStudy | null> {
  return readJson<TodayStudy>(path.join(dataDir, 'today_study.json'));
}

export async function readTodayDelta(): Promise<TodayDelta | null> {
  return readJson<TodayDelta>(path.join(dataDir, 'today_delta.json'));
}

export async function listHistoryDates(): Promise<string[]> {
  const dir = path.join(dataDir, 'history');
  try {
    const files = await fs.readdir(dir);
    return files
      .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
      .map((f) => f.replace(/\.json$/, ''))
      .sort()
      .reverse();
  } catch {
    return [];
  }
}

export async function readLatestHistory(): Promise<HistoryEntry | null> {
  const dates = await listHistoryDates();
  if (!dates.length) return null;
  return readHistory(dates[0]);
}

export function kstDateString(d = new Date()): string {
  // KST is UTC+9 with no DST.
  const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
}

export async function readHistory(date: string): Promise<HistoryEntry | null> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  return readJson<HistoryEntry>(path.join(dataDir, 'history', `${date}.json`));
}

export async function readLastSyncLabel(): Promise<string> {
  try {
    const raw = await fs.readFile(path.join(dataDir, 'last_sync.json'), 'utf-8');
    const j = JSON.parse(raw) as { kst?: string; utc?: string };
    return (j.kst || j.utc || '').trim() || 'unknown';
  } catch {
    return 'unknown';
  }
}

export async function readSource(name: 'english_vocab.md' | 'english_sentences.md'): Promise<string> {
  try {
    return await fs.readFile(path.join(sourcesDir, name), 'utf-8');
  } catch {
    return '';
  }
}

export type VocabSectionKey = 'words' | 'phrasal' | 'idioms' | 'all';

export type PagedItems = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  items: string[];
};

function sectionKeyFromHeading(h: string): VocabSectionKey | null {
  const t = h.trim().toLowerCase();
  if (t === 'words') return 'words';
  if (t === 'phrasal verbs') return 'phrasal';
  if (t === 'idioms') return 'idioms';
  return null;
}

export async function readVocabSectionPaged(
  section: VocabSectionKey,
  page: number,
  pageSize = 50
): Promise<PagedItems> {
  const raw = await readSource('english_vocab.md');
  const lines = raw ? raw.split(/\r?\n/) : [];

  let cur: VocabSectionKey | null = null;
  const buckets: Record<'words' | 'phrasal' | 'idioms', string[]> = {
    words: [],
    phrasal: [],
    idioms: [],
  };

  for (const line of lines) {
    const s = line.trim();
    if (s.startsWith('## ')) {
      cur = sectionKeyFromHeading(s.slice(3)) as VocabSectionKey | null;
      continue;
    }
    if (!s.startsWith('- ')) continue;
    const val = s.slice(2).trim();
    if (!val) continue;
    if (!cur) {
      // Back-compat: bullets before any section headings are treated as words.
      buckets.words.push(val);
      continue;
    }
    if (cur === 'words' || cur === 'phrasal' || cur === 'idioms') {
      buckets[cur].push(val);
    }
  }

  const all = [...buckets.words, ...buckets.phrasal, ...buckets.idioms];
  const chosen = section === 'all' ? all : buckets[section];

  const totalItems = chosen.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, Number.isFinite(page) ? page : 1), totalPages);
  const start = (safePage - 1) * pageSize;
  const end = start + pageSize;
  const items = chosen.slice(start, end);

  return { page: safePage, pageSize, totalItems, totalPages, items };
}

export type PagedText = {
  page: number;
  pageSize: number;
  totalLines: number;
  totalPages: number;
  lines: string[];
};

export async function readSourcePaged(
  name: 'english_vocab.md' | 'english_sentences.md',
  page: number,
  pageSize = 50
): Promise<PagedText> {
  const raw = await readSource(name);
  const allLines = raw ? raw.split(/\r?\n/) : [];
  const totalLines = allLines.length;
  const totalPages = Math.max(1, Math.ceil(totalLines / pageSize));
  const safePage = Math.min(Math.max(1, Number.isFinite(page) ? page : 1), totalPages);
  const start = (safePage - 1) * pageSize;
  const end = start + pageSize;
  const lines = allLines.slice(start, end);
  return { page: safePage, pageSize, totalLines, totalPages, lines };
}
