import Image from 'next/image';
import { BookOpen, Quote } from 'lucide-react';
import { kstDateString, readHistory, readLatestHistory, readTodayDelta, readTodayStudy } from '../lib/fsdata';
import { parsePushMessage } from '../lib/push';
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

// parsePushMessage moved to lib/push.ts

export default async function Page() {
  // Phase3/4: Today is derived from the official push snapshot.
  // Preferred source: *today's* history entry (KST date) created by archive_daily.py.
  // Fallbacks: latest history (if today's missing) → recomposed from today_study + today_delta.
  const todayKst = kstDateString();
  const todayHistory = await readHistory(todayKst);
  const latest = todayHistory?.message ? null : await readLatestHistory();

  const sourceHistory = todayHistory?.message ? todayHistory : latest;

  // Fallback (only if no history exists yet)
  const study = await readTodayStudy();
  const delta = await readTodayDelta();

  const date = sourceHistory?.date || todayKst || study?.date || delta?.date || '';

  const fullText = (sourceHistory?.message || '').trim()
    ? String(sourceHistory?.message)
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
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Daily English Study" width={18} height={18} className="rounded-lg opacity-80" />
            <div className="text-xs font-medium text-slate-500">Learning English</div>
          </div>
          <div className="text-2xl font-extrabold tracking-tight">Today’s Study</div>
          <div className="text-sm text-slate-500">Learning English vocabulary and sentences for a better tomorrow</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">{date || 'no-date'}</Badge>
          {(() => {
            const url = sourceHistory?.today_delta?.link || delta?.link || '';
            return url ? (
              <a href={url} target="_blank" rel="noreferrer">
                <Badge variant="secondary">study material</Badge>
              </a>
            ) : null;
          })()}
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
            <CardDescription>[오늘의 단어]</CardDescription>
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
            <CardDescription>[오늘의 문장]</CardDescription>
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
            <summary className="cursor-pointer text-sm font-medium text-slate-700">Show message</summary>
            <pre className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm">{fullText}</pre>
          </details>
        </CardContent>
      </Card>
    </div>
  );
}
