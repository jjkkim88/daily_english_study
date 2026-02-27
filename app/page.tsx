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

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-emerald-600" />
              <CardTitle>today_study</CardTitle>
              <Badge className="ml-auto" variant="outline">
                vocab {study?.vocab?.length ?? 0} · sentences {study?.sentences?.length ?? 0}
              </Badge>
            </div>
            <CardDescription>Deterministic pick per KST date</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="mb-2 text-sm font-bold">Vocab</div>
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  {(study?.vocab ?? []).map((v) => (
                    <li key={v}>{v}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mb-2 text-sm font-bold">Sentences</div>
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  {(study?.sentences ?? []).map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-sky-600" />
              <CardTitle>today_delta</CardTitle>
              <Badge className="ml-auto" variant="outline">
                {delta?.date ?? '-'}
              </Badge>
            </div>
            <CardDescription>Fetched from IBI source</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm font-extrabold">{delta?.title ?? '-'}</div>
              {delta?.link ? (
                <a className="text-sm" href={delta.link} target="_blank" rel="noreferrer">
                  {delta.link}
                </a>
              ) : null}

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <div className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">vocab</div>
                  <pre className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">{delta?.vocab ?? ''}</pre>
                </div>
                <div>
                  <div className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">sentences</div>
                  <pre className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">{delta?.sentences ?? ''}</pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
