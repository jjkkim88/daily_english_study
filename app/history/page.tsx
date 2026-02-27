import Link from 'next/link';
import { listHistoryDates } from '../../lib/fsdata';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { defaultSelectedMonth, groupByYearMonth, monthKey } from './grouped';
import { readHistory } from '../../lib/fsdata';
import { parsePushMessage } from '../../lib/push';

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const sp = await searchParams;
  const dates = await listHistoryDates();

  const latest = dates.slice(0, 7);
  const groups = groupByYearMonth(dates);

  const selectedMonth =
    (sp.month && /^\d{4}-\d{2}$/.test(sp.month) ? sp.month : '') ||
    defaultSelectedMonth(dates);

  const monthDates = dates.filter((d) => monthKey(d) === selectedMonth);

  const monthMeta = await Promise.all(
    monthDates.map(async (d) => {
      const entry = await readHistory(d);
      const msg = String(entry?.message ?? '');
      const parsed = parsePushMessage(msg);
      return {
        date: d,
        vocabCount: parsed.vocab.length,
        sentenceCount: parsed.sentences.length,
      };
    })
  );

  return (
    <div className="space-y-4">
      <div>
        <div className="text-2xl font-extrabold tracking-tight">History</div>
        <div className="text-sm text-slate-500">Latest 7 days + Year/Month navigator</div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Latest 7 days</CardTitle>
          <CardDescription>Quick access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {latest.map((d) => (
              <Link key={d} href={`/history/${d}`}>
                <Button variant="secondary" size="sm">
                  {d}
                </Button>
              </Link>
            ))}
            {latest.length === 0 ? <div className="text-sm text-slate-500">No history yet.</div> : null}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-12">
        <Card className="md:col-span-5">
          <CardHeader>
            <CardTitle>Year</CardTitle>
            <CardDescription>Select a month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {groups.map((yg) => (
              <details
                key={yg.year}
                open={yg.year === new Date().getFullYear().toString()}
                className="rounded-2xl border border-slate-200 bg-white/60 p-3"
              >
                <summary className="cursor-pointer text-sm font-medium text-slate-900">{yg.year}</summary>
                <div className="mt-3 flex flex-wrap gap-2">
                  {yg.months.map((m) => (
                    <Link key={m} href={`/history?month=${m}`}>
                      <Button variant={m === selectedMonth ? 'outline' : 'secondary'} size="sm">
                        {m}
                      </Button>
                    </Link>
                  ))}
                </div>
              </details>
            ))}
          </CardContent>
        </Card>

        <Card className="md:col-span-7">
          <CardHeader>
            <CardTitle>{selectedMonth || 'Month'}</CardTitle>
            <CardDescription>{monthDates.length} entries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-slate-200">
              {monthMeta.map((row) => (
                <div key={row.date} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div className="min-w-0">
                    <Link className="text-sm font-medium text-slate-900 hover:underline" href={`/history/${row.date}`}>
                      {row.date}
                    </Link>
                    <div className="text-xs text-slate-500">
                      vocab {row.vocabCount} · sentences {row.sentenceCount}
                    </div>
                  </div>
                  <Link href={`/history/${row.date}`}>
                    <Button variant="outline" size="sm">Open</Button>
                  </Link>
                </div>
              ))}
              {monthDates.length === 0 ? <div className="py-3 text-sm text-slate-500">No entries.</div> : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
