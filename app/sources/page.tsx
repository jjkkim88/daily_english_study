import Link from 'next/link';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

export default async function SourcesIndexPage() {
  return (
    <div className="space-y-4">
      <div>
        <div className="text-2xl font-extrabold tracking-tight">Sources</div>
        <div className="text-sm text-slate-500">Reference lists used for today_study pick</div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Choose a list</CardTitle>
          <CardDescription>Paging: 50 lines per page</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Link href="/sources/vocab">
            <Button variant="secondary">Vocab</Button>
          </Link>
          <Link href="/sources/sentences">
            <Button variant="secondary">Sentences</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
