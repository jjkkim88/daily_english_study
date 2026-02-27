import { readTodayDelta, readTodayStudy } from '../lib/fsdata';

function SectionHeader({ title }: { title: string }) {
  return <h2>{title}</h2>;
}

export default async function Page() {
  const study = await readTodayStudy();
  const delta = await readTodayDelta();

  return (
    <div>
      <h1 className="h1">Today</h1>

      <div className="grid">
        <div className="card">
          <SectionHeader title="today_study" />
          <div className="kv">
            <span className="pill">date: {study?.date ?? '-'}</span>
            <span className="pill">vocab: {study?.vocab?.length ?? 0}</span>
            <span className="pill">sentences: {study?.sentences?.length ?? 0}</span>
          </div>
          <ul className="list">
            {(study?.vocab ?? []).map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
          <ul className="list">
            {(study?.sentences ?? []).map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>

        <div className="card">
          <SectionHeader title="today_delta" />
          <div className="kv">
            <span className="pill">date: {delta?.date ?? '-'}</span>
          </div>
          <div style={{ marginTop: 10 }}>
            <div style={{ fontWeight: 600 }}>{delta?.title ?? '-'}</div>
            {delta?.link ? (
              <div>
                <a href={delta.link} target="_blank" rel="noreferrer">
                  {delta.link}
                </a>
              </div>
            ) : null}
          </div>
          <div style={{ marginTop: 10 }}>
            <div className="muted">vocab</div>
            <pre className="pre">{delta?.vocab ?? ''}</pre>
          </div>
          <div style={{ marginTop: 10 }}>
            <div className="muted">sentences</div>
            <pre className="pre">{delta?.sentences ?? ''}</pre>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <h2>Push preview</h2>
        <div className="muted">(Later: render the combined push message or show today’s history message after 23:55)</div>
      </div>
    </div>
  );
}
