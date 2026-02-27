import { readHistory } from '../../../lib/fsdata';

export default async function HistoryDetail({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const entry = await readHistory(date);

  if (!entry) {
    return (
      <div>
        <h1 className="h1">History</h1>
        <div className="card">
          <h2>Not found</h2>
          <div className="muted">No entry for: {date}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="h1">History: {entry.date}</h1>
      <div className="card">
        <h2>message (push snapshot)</h2>
        <pre className="pre">{entry.message ?? ''}</pre>
      </div>

      <div className="grid" style={{ marginTop: 14 }}>
        <div className="card">
          <h2>today_study (raw)</h2>
          <pre className="pre">{JSON.stringify(entry.today_study ?? {}, null, 2)}</pre>
        </div>
        <div className="card">
          <h2>today_delta (raw)</h2>
          <pre className="pre">{JSON.stringify(entry.today_delta ?? {}, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
