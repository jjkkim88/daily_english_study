import Link from 'next/link';
import { readSourcePaged } from '../../../lib/fsdata';

function PageNav({ base, page, totalPages }: { base: string; page: number; totalPages: number }) {
  const prev = Math.max(1, page - 1);
  const next = Math.min(totalPages, page + 1);
  return (
    <div className="kv" style={{ marginTop: 10 }}>
      <span className="pill">
        Page {page} / {totalPages}
      </span>
      <Link className="pill" href={`${base}?page=1`}>
        First
      </Link>
      <Link className="pill" href={`${base}?page=${prev}`}>
        Prev
      </Link>
      <Link className="pill" href={`${base}?page=${next}`}>
        Next
      </Link>
      <Link className="pill" href={`${base}?page=${totalPages}`}>
        Last
      </Link>
    </div>
  );
}

export default async function VocabPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = Number(sp.page ?? '1');
  const p = await readSourcePaged('english_vocab.md', page, 50);

  return (
    <div>
      <h1 className="h1">Sources: Vocab</h1>
      <div className="card">
        <h2>english_vocab.md</h2>
        <div className="muted">{p.totalLines} lines total</div>
        <PageNav base="/sources/vocab" page={p.page} totalPages={p.totalPages} />
        <pre className="pre" style={{ marginTop: 12 }}>{p.lines.join('\n')}</pre>
        <PageNav base="/sources/vocab" page={p.page} totalPages={p.totalPages} />
      </div>
    </div>
  );
}
