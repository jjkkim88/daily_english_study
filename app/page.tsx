import { BookOpen, Sparkles } from 'lucide-react';
import { readTodayDelta, readTodayStudy } from '../lib/fsdata';
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

export default async function Page() {
  // UI policy: hide raw today_study/today_delta cards.
  // We still use them temporarily to render a recomposed preview when needed.
  const study = await readTodayStudy();
  const delta = await readTodayDelta();

  const date = study?.date || delta?.date || '';
  const pushPreview = buildPushPreview({
    date,
    deltaVocab: delta?.vocab,
    deltaSentences: delta?.sentences,
    studyVocab: study?.vocab,
    studySentences: study?.sentences,
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-2xl font-extrabold tracking-tight">Today</div>
          <div className="text-sm text-slate-500">Daily study set + delta + recomposed push preview</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">{date || 'no-date'}</Badge>
          <Badge variant="secondary">read-only</Badge>
        </div>
      </div>

      {/* Raw today_study/today_delta cards intentionally hidden. */}

      <Card>
        <CardHeader>
          <CardTitle>Push preview</CardTitle>
          <CardDescription>Recomposed to match Discord push format</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">{pushPreview}</pre>
        </CardContent>
      </Card>
    </div>
  );
}
