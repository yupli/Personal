export const normalizeSearch = (text: string) => text.normalize("NFKC").toLowerCase();

type Match = { start: number; end: number };
type Part = { text: string; match: boolean };
const segmenter = typeof Intl.Segmenter === "function" ? new Intl.Segmenter(undefined, { granularity: "grapheme" }) : undefined;

function originalOffsets(text: string, points: number[]) {
  if (/^[\x00-\x7F]*$/.test(text)) return points;

  const offsets: number[] = [];
  let original = 0;
  let normalized = 0;
  const segments = segmenter?.segment(text);
  const append = (part: string) => {
    const end = normalized + normalizeSearch(part).length;
    while (offsets.length < points.length && points[offsets.length] < end) {
      const i = offsets.length;
      const roundUp = i === points.length - 1 || (i > 0 && i % 2 === 0);
      offsets.push(roundUp && points[i] > normalized ? original + part.length : original);
    }
    original += part.length;
    normalized = end;
  };
  if (segments) {
    for (const { segment } of segments) {
      append(segment);
      if (offsets.length === points.length) break;
    }
  } else {
    for (const point of text) {
      append(point);
      if (offsets.length === points.length) break;
    }
  }
  while (offsets.length < points.length) offsets.push(text.length);
  return offsets;
}

export function searchParts(text: string, terms: string[], excerpt = false): Part[] {
  const normalized = normalizeSearch(text);
  const matches: Match[] = [];
  for (const term of terms) {
    if (!term) continue;
    for (let start = normalized.indexOf(term); start >= 0; start = normalized.indexOf(term, start + term.length)) {
      matches.push({ start, end: start + term.length });
    }
  }
  if (!matches.length) return excerpt || !text ? [] : [{ text, match: false }];

  matches.sort((a, b) => a.start - b.start);
  const start = excerpt ? Math.max(0, matches[0].start - 18) : 0;
  const end = excerpt ? Math.min(normalized.length, Math.max(start + 108, matches[0].end)) : normalized.length;
  const runs: Match[] = [];
  for (const match of matches) {
    if (match.start >= end) break;
    const last = runs.at(-1);
    const limit = Math.min(match.end, end);
    if (last && match.start <= last.end) last.end = Math.max(last.end, limit);
    else runs.push({ start: match.start, end: limit });
  }

  const positions = [start, ...runs.flatMap(({ start, end }) => [start, end]), end];
  const offsets = originalOffsets(text, positions);
  const parts: Part[] = [];
  if (offsets[0] > 0) parts.push({ text: "…", match: false });
  let cursor = offsets[0];
  for (let i = 1; i < offsets.length - 1; i += 2) {
    if (offsets[i] > cursor) parts.push({ text: text.slice(cursor, offsets[i]), match: false });
    const match = text.slice(Math.max(cursor, offsets[i]), offsets[i + 1]);
    if (match) parts.push({ text: match, match: true });
    cursor = Math.max(cursor, offsets[i + 1]);
  }
  const last = offsets.at(-1)!;
  if (last > cursor) parts.push({ text: text.slice(cursor, last), match: false });
  if (last < text.length) parts.push({ text: "…", match: false });
  return parts;
}
