import Link from 'next/link';
import { listHistoryDates } from '../../lib/fsdata';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

export default async function HistoryPage() {
  const dates = await listHistoryDates();

  return (
    <div className="space-y-4">
      <div>
        <div className="text-2xl font-extrabold tracking-tight">History</div>
        <div className="text-sm text-slate-500">Click a date to view the push snapshot</div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dates</CardTitle>
          <CardDescription>{dates.length} entries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {dates.map((d) => (
              <Link key={d} href={`/history/${d}`}>
                <Button variant="secondary" size="sm">{d}</Button>
              </Link>
            ))}
            {dates.length === 0 ? <div className="text-sm text-slate-500">No history yet.</div> : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
