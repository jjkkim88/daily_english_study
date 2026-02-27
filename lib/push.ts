export type PushSections = {
  vocab: string[];
  sentences: string[];
};

export function parsePushMessage(text: string): PushSections {
  const lines = String(text || '')
    .split(/\r?\n/)
    .map((l) => l.trimEnd());

  const idxV = lines.findIndex((l) => l.trim() === '[오늘의 단어]');
  const idxS = lines.findIndex((l) => l.trim() === '[오늘의 문장]');

  const vocabLines: string[] = [];
  const sentenceLines: string[] = [];

  if (idxV >= 0) {
    const end = idxS >= 0 ? idxS : lines.length;
    for (const l of lines.slice(idxV + 1, end)) {
      const t = l.trim();
      if (!t) continue;
      if (t.startsWith('- ')) vocabLines.push(t.slice(2).trim());
    }
  }

  if (idxS >= 0) {
    for (const l of lines.slice(idxS + 1)) {
      const t = l.trim();
      if (!t) continue;
      if (t.startsWith('- ')) sentenceLines.push(t.slice(2).trim());
    }
  }

  return { vocab: vocabLines, sentences: sentenceLines };
}
