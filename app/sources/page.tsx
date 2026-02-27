import Link from 'next/link';

export default async function SourcesIndexPage() {
  return (
    <div>
      <h1 className="h1">Sources</h1>
      <div className="card">
        <h2>Choose</h2>
        <ul className="list">
          <li>
            <Link href="/sources/vocab">Vocab (english_vocab.md)</Link>
          </li>
          <li>
            <Link href="/sources/sentences">Sentences (english_sentences.md)</Link>
          </li>
        </ul>
        <div className="muted" style={{ marginTop: 10 }}>
          Paging: 50 lines per page
        </div>
      </div>
    </div>
  );
}
