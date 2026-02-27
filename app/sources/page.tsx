import { readSource } from '../../lib/fsdata';

export default async function SourcesPage() {
  const vocab = await readSource('english_vocab.md');
  const sentences = await readSource('english_sentences.md');

  return (
    <div>
      <h1 className="h1">Sources</h1>

      <div className="card">
        <h2>english_vocab.md</h2>
        <pre className="pre">{vocab}</pre>
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <h2>english_sentences.md</h2>
        <pre className="pre">{sentences}</pre>
      </div>
    </div>
  );
}
