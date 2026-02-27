import Link from 'next/link';
import { listHistoryDates } from '../../lib/fsdata';

export default async function HistoryPage() {
  const dates = await listHistoryDates();

  return (
    <div>
      <h1 className="h1">History</h1>
      <div className="card">
        <h2>Dates</h2>
        <ul className="list">
          {dates.map((d) => (
            <li key={d}>
              <Link href={`/history/${d}`}>{d}</Link>
            </li>
          ))}
          {dates.length === 0 ? <li className="muted">No history yet.</li> : null}
        </ul>
      </div>
    </div>
  );
}
