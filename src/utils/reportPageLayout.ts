import { ScanReport, MatchedSource } from '../types';
import { isCyb2103Document } from '../data/cyb2103Report';
import { isDanishDocument } from '../data/danishReport';
import { isKunalReport } from '../data/kunalReport';

export interface PageLayoutItem {
  pageNumber: number;
  type: 'cover' | 'integrity_overview' | 'ai_overview' | 'top_sources' | 'manuscript';
  sectionTitle: string;
  manuscriptIndex?: number;
  sourcesSlice?: MatchedSource[];
  startIndex?: number;
  isFirstSourcePage?: boolean;
}

export interface ReportLayoutPlan {
  totalPages: number;
  manuscriptCount: number;
  pages: PageLayoutItem[];
}

export function getReportPageLayout(
  report: ScanReport,
  mode: 'ai' | 'similarity'
): ReportLayoutPlan {
  const isCyb = isCyb2103Document(report.fileName || report.title);
  const isDan = isDanishDocument(report.fileName || report.title);
  const isKunal = isKunalReport(report);

  let mCount = report.pageCount || 1;
  if (isDan) {
    mCount = 12;
  } else if (isCyb) {
    mCount = 4;
  } else if (isKunal) {
    mCount = 3;
  }

  const sources = report.sources || [];

  if (mode === 'ai') {
    // 2 Cover Pages (Cover, AI Overview) + Manuscript Pages
    const pages: PageLayoutItem[] = [
      { pageNumber: 1, type: 'cover', sectionTitle: 'Cover Page' },
      { pageNumber: 2, type: 'ai_overview', sectionTitle: 'AI Writing Overview' },
      ...Array.from({ length: mCount }).map((_, idx) => ({
        pageNumber: 3 + idx,
        type: 'manuscript' as const,
        manuscriptIndex: idx,
        sectionTitle: 'AI Writing Submission',
      })),
    ];
    return { totalPages: 2 + mCount, manuscriptCount: mCount, pages };
  } else {
    // 2 Cover Pages (Cover, Integrity Overview) + Top Sources Pages + Manuscript Pages
    const sourcesPages: PageLayoutItem[] = [];
    if (sources.length <= 10) {
      sourcesPages.push({
        pageNumber: 3,
        type: 'top_sources',
        sectionTitle: 'Top Sources',
        sourcesSlice: sources.slice(0, 10),
        startIndex: 0,
        isFirstSourcePage: true,
      });
    } else {
      // First page: 10 sources
      sourcesPages.push({
        pageNumber: 3,
        type: 'top_sources',
        sectionTitle: 'Top Sources',
        sourcesSlice: sources.slice(0, 10),
        startIndex: 0,
        isFirstSourcePage: true,
      });
      // Continuation pages: 11 sources per page
      let sIdx = 10;
      let pNum = 4;
      while (sIdx < sources.length) {
        const slice = sources.slice(sIdx, sIdx + 11);
        sourcesPages.push({
          pageNumber: pNum,
          type: 'top_sources',
          sectionTitle: 'Top Sources',
          sourcesSlice: slice,
          startIndex: sIdx,
          isFirstSourcePage: false,
        });
        sIdx += 11;
        pNum++;
      }
    }

    const totalCoverAndSourcePages = 2 + sourcesPages.length;
    const manuscriptStartPageNumber = totalCoverAndSourcePages + 1;

    const pages: PageLayoutItem[] = [
      { pageNumber: 1, type: 'cover', sectionTitle: 'Cover Page' },
      { pageNumber: 2, type: 'integrity_overview', sectionTitle: 'Integrity Overview' },
      ...sourcesPages,
      ...Array.from({ length: mCount }).map((_, idx) => ({
        pageNumber: manuscriptStartPageNumber + idx,
        type: 'manuscript' as const,
        manuscriptIndex: idx,
        sectionTitle: 'Submission',
      })),
    ];

    return {
      totalPages: totalCoverAndSourcePages + mCount,
      manuscriptCount: mCount,
      pages,
    };
  }
}

export function getReportPdfFileName(report: ScanReport, mode: 'ai' | 'similarity'): string {
  const isCyb = isCyb2103Document(report.fileName || report.title);
  if (isCyb) {
    if (mode === 'similarity') {
      return 'similarity-CYB2103_Assessment_3_Cyber_Risk_Management_report.pdf';
    } else {
      return 'ai-CYB2103_Assessment_3_Cyber_Risk_Management_report.pdf';
    }
  }

  const rawBase = (report.fileName || report.title || 'Turnitin_Report')
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_');

  if (mode === 'similarity') {
    return `similarity-${rawBase}.pdf`;
  } else {
    return `ai-${rawBase}.pdf`;
  }
}
