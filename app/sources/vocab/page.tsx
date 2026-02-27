import Link from 'next/link';
import { readVocabSectionPaged, type VocabSectionKey } from '../../../lib/fsdata';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';

function PageNav({ base, page, totalPages }: { base: string; page: number; totalPages: number }) {
  const prev = Math.max(1, page - 1);
  const next = Math.min(totalPages, page + 1);
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <Link href={`${base}&page=1`}>
        <Button variant="secondary" size="sm" className="h-8 px-3 text-xs">First</Button>
      </Link>
      <Link href={`${base}&page=${prev}`}>
        <Button variant="secondary" size="sm" className="h-8 px-3 text-xs">Prev</Button>
      </Link>
      <Badge variant="secondary">
        Page {page} / {totalPages}
      </Badge>
      <Link href={`${base}&page=${next}`}>
        <Button variant="secondary" size="sm" className="h-8 px-3 text-xs">Next</Button>
      </Link>
      <Link href={`${base}&page=${totalPages}`}>
        <Button variant="secondary" size="sm" className="h-8 px-3 text-xs">Last</Button>
      </Link>
    </div>
  );
}

export default async function VocabPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; section?: string }>;
}) {
  const sp = await searchParams;
  const section = (['words', 'phrasal', 'idioms', 'all'].includes(String(sp.section))
    ? (sp.section as VocabSectionKey)
    : 'words') as VocabSectionKey;
  const page = Number(sp.page ?? '1');
  const p = await readVocabSectionPaged(section, page, 50);

  const base = `/sources/vocab?section=${section}`;

  return (
    <div className="space-y-4">
      <div>
        <div className="text-2xl font-extrabold tracking-tight">Sources: Vocab</div>
        <div className="text-sm text-slate-500">50 items per page</div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vocabulary List</CardTitle>
          <CardDescription>{p.totalItems} items total</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Link href="/sources/vocab?section=words">
              <Button variant={section === 'words' ? 'outline' : 'secondary'} size="sm">Words</Button>
            </Link>
            <Link href="/sources/vocab?section=phrasal">
              <Button variant={section === 'phrasal' ? 'outline' : 'secondary'} size="sm">Phrasal Verbs</Button>
            </Link>
            <Link href="/sources/vocab?section=idioms">
              <Button variant={section === 'idioms' ? 'outline' : 'secondary'} size="sm">Idioms</Button>
            </Link>
            <Link href="/sources/vocab?section=all">
              <Button variant={section === 'all' ? 'outline' : 'secondary'} size="sm">All</Button>
            </Link>
          </div>

          <PageNav base={base} page={p.page} totalPages={p.totalPages} />
          <pre className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm">{p.items.join('\n')}</pre>
          <PageNav base={base} page={p.page} totalPages={p.totalPages} />
        </CardContent>
      </Card>
    </div>
  );
}
