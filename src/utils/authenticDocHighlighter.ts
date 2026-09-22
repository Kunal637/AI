import { ScanReport } from '../types';
import {
  isTableOfContentsHeading,
  isTableOfContentsEntry,
  isTableOfContentsText,
  isTableHeadingOrCaption,
  isTableRowOrData,
  isTableText,
  isQuoteText,
  isBibliographyHeading,
  isCitationLine,
  isBibliographyOrReferenceText,
  isExcludedFromHighlighting,
} from './documentParser';

export interface RawTextItem {
  str: string;
  left: number;
  top: number;
  width: number;
  height: number;
  fontSize: number;
}

export interface DocHighlightBox {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  type: 'plagiarized' | 'ai';
  sourceIndex: number; // 1 to 4
  isBlueUnderlined?: boolean;
  showBadge?: boolean;
  badgeNumber?: number;
  badgeLeft?: number;
  badgeTop?: number;
}

export interface HighlightColorTheme {
  bg: string;
  pdfColor: { r: number; g: number; b: number };
  badgeBg: string;
  textColor: string;
  isUnderlined: boolean;
}

/**
 * 4 Turnitin official highlight themes for Similarity reports:
 * 1: Pink/Red
 * 2: Blue with bottom underline
 * 3: Emerald/Green
 * 4: Purple/Violet
 */
export const SIMILARITY_THEMES: Record<number, HighlightColorTheme> = {
  1: {
    bg: 'rgba(254, 165, 165, 0.70)', // slightly richer, prominent red/pink highlight
    pdfColor: { r: 0.99, g: 0.65, b: 0.65 },
    badgeBg: '#dc2626',
    textColor: '#991b1b',
    isUnderlined: false,
  },
  2: {
    bg: 'rgba(147, 197, 253, 0.70)', // slightly richer, prominent blue highlight
    pdfColor: { r: 0.58, g: 0.78, b: 0.98 },
    badgeBg: '#2563eb',
    textColor: '#1d4ed8',
    isUnderlined: false,
  },
  3: {
    bg: 'rgba(134, 239, 172, 0.65)', // slightly richer emerald/green
    pdfColor: { r: 0.55, g: 0.92, b: 0.70 },
    badgeBg: '#059669',
    textColor: '#065f46',
    isUnderlined: false,
  },
  4: {
    bg: 'rgba(216, 180, 254, 0.68)', // slightly richer purple/violet
    pdfColor: { r: 0.82, g: 0.68, b: 0.98 },
    badgeBg: '#7c3aed',
    textColor: '#5b21b6',
    isUnderlined: false,
  },
};

/**
 * AI Writing highlight theme:
 * Distinct light-blue wash.
 */
export const AI_THEME: HighlightColorTheme = {
  bg: 'rgba(147, 197, 253, 0.70)', // prominent light blue wash
  pdfColor: { r: 0.58, g: 0.78, b: 0.98 },
  badgeBg: '#3b82f6',
  textColor: '#1e40af',
  isUnderlined: false,
};

export function getHighlightTheme(
  type: 'plagiarized' | 'ai',
  sourceIndex = 1
): HighlightColorTheme {
  if (type === 'ai') {
    return AI_THEME;
  }
  return SIMILARITY_THEMES[sourceIndex] || SIMILARITY_THEMES[1];
}

interface VisualLine {
  items: RawTextItem[];
  lineText: string;
  left: number;
  top: number;
  width: number;
  height: number;
  fontSize: number;
}

/**
 * Groups raw PDF text fragments into unified visual lines
 */
function groupItemsIntoLines(
  items: RawTextItem[],
  pageHeight: number
): VisualLine[] {
  if (!items || items.length === 0) return [];

  // Filter out running header and footer area (top 50px, bottom 50px)
  const contentItems = items.filter(
    item => item.top >= 48 && item.top <= pageHeight - 48 && item.str.trim().length > 0
  );

  // Sort by top, then left
  contentItems.sort((a, b) => {
    const topDiff = a.top - b.top;
    if (Math.abs(topDiff) > 3) return topDiff;
    return a.left - b.left;
  });

  const lines: VisualLine[] = [];
  let currentGroup: RawTextItem[] = [];
  let currentTop = -999;
  let currentFontSize = 12;

  for (const item of contentItems) {
    const threshold = Math.max(currentFontSize, item.fontSize, 10) * 0.45;
    if (currentGroup.length === 0 || Math.abs(item.top - currentTop) <= threshold) {
      currentGroup.push(item);
      if (currentGroup.length === 1) {
        currentTop = item.top;
        currentFontSize = item.fontSize;
      }
    } else {
      // Finalize previous line
      lines.push(buildVisualLine(currentGroup));
      currentGroup = [item];
      currentTop = item.top;
      currentFontSize = item.fontSize;
    }
  }

  if (currentGroup.length > 0) {
    lines.push(buildVisualLine(currentGroup));
  }

  return lines;
}

function buildVisualLine(items: RawTextItem[]): VisualLine {
  items.sort((a, b) => a.left - b.left);
  const left = Math.min(...items.map(i => i.left));
  const top = Math.min(...items.map(i => i.top));
  const right = Math.max(...items.map(i => i.left + i.width));
  const bottom = Math.max(...items.map(i => i.top + i.height));
  const maxFontSize = Math.max(...items.map(i => i.fontSize));
  const lineText = items.map(i => i.str.trim()).filter(Boolean).join(' ');

  return {
    items,
    lineText,
    left,
    top,
    width: Math.max(10, right - left),
    height: Math.max(maxFontSize, bottom - top),
    fontSize: maxFontSize,
  };
}

/**
 * Checks if a visual line represents tabular content (columns with wide spacing, numeric tables, etc.)
 */
function isTabularVisualLine(line: VisualLine): boolean {
  if (isTableText(line.lineText)) return true;

  // Check horizontal column gaps between items in the line
  if (line.items.length >= 2) {
    let columnGaps = 0;
    for (let i = 0; i < line.items.length - 1; i++) {
      const cur = line.items[i];
      const next = line.items[i + 1];
      const gap = next.left - (cur.left + cur.width);
      if (gap >= 20 || gap >= Math.max(10, line.fontSize) * 2.0) {
        columnGaps++;
      }
    }
    if (columnGaps >= 1 && (line.items.length >= 3 || columnGaps >= 2)) {
      return true;
    }
  }

  // Check if line consists mostly of numbers, currency, percentages, or status tokens
  const tokens = line.lineText.trim().split(/\s+/);
  if (tokens.length >= 3) {
    const numericOrMetric = tokens.filter(
      t =>
        /^(\$|€|£|₹)?\d+(\.\d+)?%?$/.test(t) ||
        /^[-–—+*]+$/.test(t) ||
        /^(N\/A|NaN|None|Total|Sum|Avg|Mean|SD|Min|Max)$/i.test(t)
    );
    if (numericOrMetric.length / tokens.length >= 0.4) {
      return true;
    }
  }

  return false;
}

/**
 * Computes Turnitin highlight overlay rectangles directly on the authentic PDF document page.
 * Strictly respects:
 * - Plagiarism Similarity 1% to 17% limit with 4-color rotation and badge indicators.
 * - Excludes Table of Contents, Tables, References, and Quotes.
 * - AI Writing: 0% highlight for scores <= 20% (*% rule), light blue highlights for >= 21%.
 */
export function computeHighlightsForPage(
  items: RawTextItem[],
  pageWidth: number,
  pageHeight: number,
  pageIndex: number, // 0-based index
  report: ScanReport,
  mode: 'ai' | 'similarity'
): DocHighlightBox[] {
  const isSimilarity = mode === 'similarity';
  const plagScore = Math.min(17, Math.max(0, report.plagiarismScore || 0));
  const aiScore = report.aiScore || 0;

  // If Similarity mode and 0% plagiarism score, nothing to highlight
  if (isSimilarity && plagScore === 0) return [];

  // Official Turnitin rule: AI scores <= 20% (*% rule) display NO highlights at all
  if (!isSimilarity && aiScore <= 20) return [];

  const lines = groupItemsIntoLines(items, pageHeight);
  if (lines.length === 0) return [];

  // 1. PAGE-LEVEL EXCLUSION: TABLE OF CONTENTS
  // If the page contains a TOC heading, or >= 2 lines ending with page numbers/dot leaders,
  // or >= 20% of the lines are TOC entries -> Entire page is a Table of Contents (0 highlights).
  const hasTocHeading = lines.some(l => isTableOfContentsHeading(l.lineText));
  const tocEntries = lines.filter(l => isTableOfContentsEntry(l.lineText));
  if (
    hasTocHeading ||
    tocEntries.length >= 2 ||
    (lines.length >= 3 && tocEntries.length / lines.length >= 0.2)
  ) {
    return [];
  }

  // 2. DOCUMENT & PAGE-LEVEL EXCLUSION: REFERENCES / BIBLIOGRAPHY
  const reportObj = report as any;
  if (reportObj._bibStartPageIndex !== undefined && pageIndex > reportObj._bibStartPageIndex) {
    // Current page is completely within the References / Bibliography section
    return [];
  }

  const bibHeadingLineIdx = lines.findIndex(l => isBibliographyHeading(l.lineText));
  const citationLines = lines.filter(l => isCitationLine(l.lineText));

  // If the page has 3+ citations, or >= 30% of its lines are citations -> Entire page is References
  if (citationLines.length >= 3 || (lines.length >= 3 && citationLines.length / lines.length >= 0.3)) {
    if (reportObj._bibStartPageIndex === undefined || pageIndex < reportObj._bibStartPageIndex) {
      reportObj._bibStartPageIndex = pageIndex;
    }
    return [];
  }

  if (bibHeadingLineIdx !== -1) {
    if (reportObj._bibStartPageIndex === undefined || pageIndex < reportObj._bibStartPageIndex) {
      reportObj._bibStartPageIndex = pageIndex;
    }
  }

  // 3. LINE-BY-LINE FILTERING (TABLES, REMAINING REFERENCES, TOC, AND QUOTES)
  const excludeQuotes = report.excludeQuotes !== false;
  let inBib = false;
  let inTableBlock = false;
  let tableEndCountdown = 0;

  const eligibleLineIndices: number[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const { lineText } = line;

    // References: Once bibliography heading is reached, all remaining lines on page are excluded
    if (bibHeadingLineIdx !== -1 && i >= bibHeadingLineIdx) {
      inBib = true;
    }
    if (isBibliographyHeading(lineText)) inBib = true;
    if (inBib || isBibliographyOrReferenceText(lineText)) continue;

    // Table of Contents
    if (isTableOfContentsText(lineText)) continue;

    // Tables: check for captions, headers, tabular columns, or table blocks
    if (isTableHeadingOrCaption(lineText)) {
      inTableBlock = true;
      tableEndCountdown = 4;
      continue;
    }

    if (isTabularVisualLine(line)) {
      inTableBlock = true;
      tableEndCountdown = 3;
      continue;
    }

    if (inTableBlock) {
      tableEndCountdown--;
      if (tableEndCountdown <= 0) {
        inTableBlock = false;
      } else {
        continue;
      }
    }

    if (isExcludedFromHighlighting(lineText)) continue;
    if (excludeQuotes && isQuoteText(lineText)) continue;

    // Skip very short headings or single numbers
    if (lineText.length < 8 && !/[a-zA-Z]{3,}/.test(lineText)) continue;
    // Skip lines that look like page numbering
    if (/^page\s+\d+/i.test(lineText) || /^\d+\s*$/i.test(lineText)) continue;

    eligibleLineIndices.push(i);
  }

  if (eligibleLineIndices.length === 0) return [];

  const highlightBoxes: DocHighlightBox[] = [];

  // Check if report.snippets has pre-calculated matches
  const hasSnippets = report.snippets && report.snippets.length > 0;
  const snippetMatchedLineIndices = new Map<number, { sourceIndex: number; type: 'plagiarized' | 'ai' }>();

  if (hasSnippets) {
    for (const idx of eligibleLineIndices) {
      const lineText = lines[idx].lineText.toLowerCase();
      for (const s of report.snippets) {
        if (
          (isSimilarity && s.type === 'plagiarized') ||
          (!isSimilarity && s.type === 'ai_generated')
        ) {
          const sText = s.text.toLowerCase();
          if (
            (lineText.length > 15 && sText.includes(lineText.slice(0, 25))) ||
            (sText.length > 15 && lineText.includes(sText.slice(0, 25)))
          ) {
            snippetMatchedLineIndices.set(idx, {
              sourceIndex: s.sourceIndex || 1,
              type: isSimilarity ? 'plagiarized' : 'ai',
            });
            break;
          }
        }
      }
    }
  }

  // Determine line highlights
  const highlightedLines = new Map<number, { sourceIndex: number; isBlue: boolean; showBadge: boolean }>();

  if (snippetMatchedLineIndices.size > 0) {
    // Use the matched snippets
    const sortedIdxs = Array.from(snippetMatchedLineIndices.keys()).sort((a, b) => a - b);
    for (let i = 0; i < sortedIdxs.length; i++) {
      const lineIdx = sortedIdxs[i];
      const match = snippetMatchedLineIndices.get(lineIdx)!;
      const isFirstOfGroup = i === 0 || sortedIdxs[i - 1] !== lineIdx - 1;
      highlightedLines.set(lineIdx, {
        sourceIndex: match.sourceIndex,
        isBlue: match.sourceIndex === 2,
        showBadge: isSimilarity && isFirstOfGroup, // show badge at START (left) of contiguous group
      });
    }
  } else {
    // Proportional authentic allocation matching Turnitin document statistics
    if (isSimilarity) {
      // Plagiarism: 1% to 17%
      const targetCount = Math.max(
        1,
        Math.min(
          eligibleLineIndices.length,
          Math.round((plagScore / 100) * eligibleLineIndices.length * 1.5)
        )
      );

      // Select cluster start points deterministically per pageIndex
      const seed = (pageIndex * 7 + 3) % eligibleLineIndices.length;
      const step = Math.max(2, Math.floor(eligibleLineIndices.length / Math.max(1, Math.ceil(targetCount / 2))));

      let assigned = 0;
      let clusterColorIndex = (pageIndex % 4) + 1;

      for (let i = 0; i < eligibleLineIndices.length && assigned < targetCount; i += step) {
        const actualIdx = (i + seed) % eligibleLineIndices.length;
        const lineIdx = eligibleLineIndices[actualIdx];

        const srcIdx = clusterColorIndex;
        clusterColorIndex = (clusterColorIndex % 4) + 1;

        // Highlight 1 or 2 lines in this cluster: badge on the FIRST line (start / left)
        highlightedLines.set(lineIdx, {
          sourceIndex: srcIdx,
          isBlue: srcIdx === 2,
          showBadge: true, // badge at start of cluster on the left side
        });
        assigned++;

        // Contiguous line if available
        const nextEligiblePos = actualIdx + 1;
        if (assigned < targetCount && nextEligiblePos < eligibleLineIndices.length) {
          const nextLineIdx = eligibleLineIndices[nextEligiblePos];
          if (nextLineIdx === lineIdx + 1) {
            highlightedLines.set(nextLineIdx, {
              sourceIndex: srcIdx,
              isBlue: srcIdx === 2,
              showBadge: false, // continuation line has no badge
            });
            assigned++;
            continue;
          }
        }
      }
    } else {
      // AI Detection (mode === 'ai'):
      // ai 21-70%: ~15% light blue highlights
      // ai >70%: proportional to aiScore
      const ratio = aiScore <= 70 ? 0.15 : aiScore / 100;
      const targetCount = Math.max(
        1,
        Math.min(eligibleLineIndices.length, Math.round(ratio * eligibleLineIndices.length))
      );

      const seed = (pageIndex * 11 + 5) % eligibleLineIndices.length;
      const step = Math.max(2, Math.floor(eligibleLineIndices.length / Math.max(1, Math.ceil(targetCount / 2))));

      let assigned = 0;
      for (let i = 0; i < eligibleLineIndices.length && assigned < targetCount; i += step) {
        const actualIdx = (i + seed) % eligibleLineIndices.length;
        const lineIdx = eligibleLineIndices[actualIdx];

        highlightedLines.set(lineIdx, {
          sourceIndex: 1,
          isBlue: true,
          showBadge: false, // Turnitin AI mode does not use numbered badges
        });
        assigned++;

        const nextEligiblePos = actualIdx + 1;
        if (assigned < targetCount && nextEligiblePos < eligibleLineIndices.length) {
          const nextLineIdx = eligibleLineIndices[nextEligiblePos];
          if (nextLineIdx === lineIdx + 1) {
            highlightedLines.set(nextLineIdx, {
              sourceIndex: 1,
              isBlue: true,
              showBadge: false,
            });
            assigned++;
          }
        }
      }
    }
  }

  // Convert highlighted lines to visual highlight boxes with precise coordinates
  for (const [lineIdx, config] of highlightedLines.entries()) {
    const line = lines[lineIdx];
    if (!line) continue;

    // Compute snug bounding box around the line text
    const paddingX = 2;
    const paddingY = 1;
    const left = Math.max(30, line.left - paddingX);
    const top = Math.max(48, line.top - paddingY);
    const width = Math.min(pageWidth - left - 30, line.width + paddingX * 2);
    const height = Math.max(11, line.height + paddingY * 2);

    // Numbered badge appears on the LEFT side of the highlighted text (in the gutter/margin)
    const badgeLeft = Math.max(10, left - 15);
    const badgeTop = top + (height - 12) / 2;

    highlightBoxes.push({
      id: `hl-${pageIndex}-${lineIdx}`,
      left,
      top,
      width,
      height,
      type: isSimilarity ? 'plagiarized' : 'ai',
      sourceIndex: config.sourceIndex,
      isBlueUnderlined: false,
      showBadge: config.showBadge,
      badgeNumber: config.sourceIndex,
      badgeLeft,
      badgeTop,
    });
  }

  return highlightBoxes;
}
