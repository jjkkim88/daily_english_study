import { readTodayDelta, readTodayStudy } from '../lib/fsdata';

function SectionHeader({ title }: { title: string }) {
  return <h2>{title}</h2>;
}

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

  // Push header rule (Discord push only)
  lines.push('[알림][오늘의영어]');
  lines.push(date ? `오늘의 영어 공부 (${date})` : '오늘의 영어 공부');

  // vocab
  lines.push('');
  lines.push('[오늘의 단어]');
  lines.push(...toBulletLines(opts.deltaVocab));
  for (const v of opts.studyVocab ?? []) {
    const t = String(v).trim();
    if (t) lines.push(`- ${t}`);
  }

  // sentences
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
        <h2>Push preview (recomposed)</h2>
        <pre className="pre">{pushPreview}</pre>
      </div>
    </div>
  );
}
