import Link from 'next/link';
import { listHistoryDates } from '../../lib/fsdata';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { groupByMonth } from './grouped';

export default async function HistoryPage() {
  const dates = await listHistoryDates();
  const latest = dates.slice(0, 7);
  const groups = groupByMonth(dates);

  return (
    <div className="space-y-4">
      <div>
        <div className="text-2xl font-extrabold tracking-tight">History</div>
        <div className="text-sm text-slate-500">Latest 7 days + monthly groups</div>
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
                <Button variant="secondary" size="sm">{d}</Button>
              </Link>
            ))}
            {latest.length === 0 ? <div className="text-sm text-slate-500">No history yet.</div> : null}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {groups.map((g) => (
          <Card key={g.key}>
            <CardHeader>
              <CardTitle>{g.label}</CardTitle>
              <CardDescription>{g.dates.length} entries</CardDescription>
            </CardHeader>
            <CardContent>
              <details>
                <summary className="cursor-pointer text-sm font-bold text-emerald-700">Toggle</summary>
                <div className="mt-3 flex flex-wrap gap-2">
                  {g.dates.map((d) => (
                    <Link key={d} href={`/history/${d}`}>
                      <Button variant="secondary" size="sm">{d}</Button>
                    </Link>
                  ))}
                </div>
              </details>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
