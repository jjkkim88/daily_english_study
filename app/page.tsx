import { BookOpen, Quote } from 'lucide-react';
import { readLatestHistory, readTodayDelta, readTodayStudy } from '../lib/fsdata';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

function toBulletLines(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => (l.startsWith('- ') ? l : `- ${l}`));
}

function buildPushPreview(opts: {
  date?: string;
  deltaVocab?: string;
  deltaSentences?: string;
  studyVocab?: string[];
  studySentences?: string[];
}): string {
  const date = (opts.date ?? '').trim();
  const lines: string[] = [];

  lines.push('[알림][오늘의영어]');
  lines.push(date ? `오늘의 영어 공부 (${date})` : '오늘의 영어 공부');

  lines.push('');
  lines.push('[오늘의 단어]');
  lines.push(...toBulletLines(opts.deltaVocab));
  for (const v of opts.studyVocab ?? []) {
    const t = String(v).trim();
    if (t) lines.push(`- ${t}`);
  }

  lines.push('');
  lines.push('[오늘의 문장]');
  lines.push(...toBulletLines(opts.deltaSentences));
  for (const s of opts.studySentences ?? []) {
    const t = String(s).trim();
    if (t) lines.push(`- ${t}`);
  }

  return lines.join('\n').trim();
}

function parsePushMessage(text: string): { vocab: string[]; sentences: string[] } {
  const lines = text.split(/\r?\n/).map((l) => l.trimEnd());
  const idxV = lines.findIndex((l) => l.trim() === '[오늘의 단어]');
  const idxS = lines.findIndex((l) => l.trim() === '[오늘의 문장]');

  const vocabLines: string[] = [];
  const sentenceLines: string[] = [];

  if (idxV >= 0) {
    const end = idxS >= 0 ? idxS : lines.length;
    for (const l of lines.slice(idxV + 1, end)) {
      const t = l.trim();
      if (!t) continue;
      if (t.startsWith('- ')) vocabLines.push(t.slice(2).trim());
    }
  }

  if (idxS >= 0) {
    for (const l of lines.slice(idxS + 1)) {
      const t = l.trim();
      if (!t) continue;
      if (t.startsWith('- ')) sentenceLines.push(t.slice(2).trim());
    }
  }

  return { vocab: vocabLines, sentences: sentenceLines };
}

export default async function Page() {
  // Phase2: Today is derived from the "official" push snapshot.
  // Preferred source: latest history.message (created by archive_daily.py).
  const latest = await readLatestHistory();

  // Fallback (before history exists): recomposed from today_study + today_delta.
  const study = await readTodayStudy();
  const delta = await readTodayDelta();

  const date = latest?.date || study?.date || delta?.date || '';

  const fullText = (latest?.message || '').trim()
    ? String(latest?.message)
    : buildPushPreview({
        date,
        deltaVocab: delta?.vocab,
        deltaSentences: delta?.sentences,
        studyVocab: study?.vocab,
        studySentences: study?.sentences,
      });

  const parsed = parsePushMessage(fullText);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-2xl font-extrabold tracking-tight">Today</div>
          <div className="text-sm text-slate-500">Derived from the official push snapshot</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">{date || 'no-date'}</Badge>
          {latest?.message ? <Badge variant="secondary">from history</Badge> : <Badge variant="secondary">fallback</Badge>}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-emerald-600" />
              <CardTitle>Today’s Vocab</CardTitle>
              <Badge className="ml-auto" variant="outline">{parsed.vocab.length}</Badge>
            </div>
            <CardDescription>[오늘의 단어] section from push</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {parsed.vocab.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Quote className="h-4 w-4 text-sky-600" />
              <CardTitle>Today’s Sentence</CardTitle>
              <Badge className="ml-auto" variant="outline">{parsed.sentences.length}</Badge>
            </div>
            <CardDescription>[오늘의 문장] section from push</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {parsed.sentences.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Full push message</CardTitle>
          <CardDescription>Kept for reference</CardDescription>
        </CardHeader>
        <CardContent>
          <details>
            <summary className="cursor-pointer text-sm font-bold text-emerald-700">Show message</summary>
            <pre className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm">{fullText}</pre>
          </details>
        </CardContent>
      </Card>
    </div>
  );
}
