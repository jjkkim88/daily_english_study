import { BookOpen, Quote } from 'lucide-react';
import { readHistory } from '../../../lib/fsdata';
import { parsePushMessage } from '../../../lib/push';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';

export default async function HistoryDetail({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const entry = await readHistory(date);

  if (!entry) {
    return (
      <div className="space-y-4">
        <div>
          <div className="text-2xl font-extrabold tracking-tight">History</div>
          <div className="text-sm text-slate-500">Not found</div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>No entry</CardTitle>
            <CardDescription>No entry for: {date}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const msg = String(entry.message ?? '');
  const parsed = parsePushMessage(msg);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-2xl font-extrabold tracking-tight">History</div>
          <div className="text-sm text-slate-500">{entry.date}</div>
        </div>
        <Badge variant="default">{entry.date}</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-emerald-600" />
              <CardTitle>Vocab</CardTitle>
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
              <CardTitle>Sentences</CardTitle>
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
          <CardDescription>Original snapshot</CardDescription>
        </CardHeader>
        <CardContent>
          <details>
            <summary className="cursor-pointer text-sm font-medium text-slate-700">Show message</summary>
            <pre className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm">{msg}</pre>
          </details>
        </CardContent>
      </Card>
    </div>
  );
}
