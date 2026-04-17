/**
 * Normalize a string: lowercase + strip diacritics.
 */
function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Case-insensitive, diacritic-insensitive fuzzy match.
 * Returns true if every character in `query` appears in `text` in order.
 */
export function fuzzyMatch(query: string, text: string): boolean {
  if (!query) return true;
  const q = normalize(query);
  const t = normalize(text);
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  return qi === q.length;
}

export type MatchSegment = { text: string; match: boolean };

/**
 * Highlight matched characters in `text` based on `query`.
 * Returns an array of segments for React rendering with `<mark>`.
 */
export function highlightMatch(query: string, text: string): MatchSegment[] {
  if (!query) return [{ text, match: false }];

  const q = normalize(query);
  const t = normalize(text);
  const segments: MatchSegment[] = [];

  let qi = 0;
  let segStart = 0;
  let lastMatchEnd = 0;

  // Find all matched character positions
  const matchedPositions: number[] = [];
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      matchedPositions.push(ti);
      qi++;
    }
  }

  if (qi < q.length) {
    // No match — return the whole string as unmatched
    return [{ text, match: false }];
  }

  // Build segments from matched positions
  let cursor = 0;
  for (const pos of matchedPositions) {
    if (pos > cursor) {
      segments.push({ text: text.slice(cursor, pos), match: false });
    }
    segments.push({ text: text.slice(pos, pos + 1), match: true });
    cursor = pos + 1;
  }
  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), match: false });
  }

  // Merge adjacent segments of the same type
  const merged: MatchSegment[] = [];
  for (const seg of segments) {
    const last = merged[merged.length - 1];
    if (last && last.match === seg.match) {
      last.text += seg.text;
    } else {
      merged.push({ ...seg });
    }
  }

  // Suppress unused variable warnings
  void segStart;
  void lastMatchEnd;

  return merged;
}
