import Link from 'next/link';
import { readSourcePaged } from '../../../lib/fsdata';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';

function PageNav({ base, page, totalPages }: { base: string; page: number; totalPages: number }) {
  const prev = Math.max(1, page - 1);
  const next = Math.min(totalPages, page + 1);
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <Badge variant="secondary">
        Page {page} / {totalPages}
      </Badge>
      <Link href={`${base}?page=1`}>
        <Button variant="secondary" size="sm">First</Button>
      </Link>
      <Link href={`${base}?page=${prev}`}>
        <Button variant="secondary" size="sm">Prev</Button>
      </Link>
      <Link href={`${base}?page=${next}`}>
        <Button variant="secondary" size="sm">Next</Button>
      </Link>
      <Link href={`${base}?page=${totalPages}`}>
        <Button variant="secondary" size="sm">Last</Button>
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
    <div className="space-y-4">
      <div>
        <div className="text-2xl font-extrabold tracking-tight">Sources: Vocab</div>
        <div className="text-sm text-slate-500">50 lines per page</div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>english_vocab.md</CardTitle>
          <CardDescription>{p.totalLines} lines total</CardDescription>
        </CardHeader>
        <CardContent>
          <PageNav base="/sources/vocab" page={p.page} totalPages={p.totalPages} />
          <pre className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm">{p.lines.join('\n')}</pre>
          <PageNav base="/sources/vocab" page={p.page} totalPages={p.totalPages} />
        </CardContent>
      </Card>
    </div>
  );
}
