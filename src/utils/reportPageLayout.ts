import { ScanReport, MatchedSource } from '../types';
import { isCyb2103Document } from '../data/cyb2103Report';
import { isDanishDocument } from '../data/danishReport';

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
  const isDan = isDanishDocument(report.fileName || report.title);
  const mCount = isDan ? 12 : (report.pageCount || 12);
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
    // 3 Cover Pages (Cover, Integrity Overview, Top Sources) + Manuscript Pages
    const pages: PageLayoutItem[] = [
      { pageNumber: 1, type: 'cover', sectionTitle: 'Cover Page' },
      { pageNumber: 2, type: 'integrity_overview', sectionTitle: 'Integrity Overview' },
      {
        pageNumber: 3,
        type: 'top_sources',
        sectionTitle: 'Top Sources',
        sourcesSlice: sources.slice(0, 10),
        startIndex: 0,
        isFirstSourcePage: true,
      },
      ...Array.from({ length: mCount }).map((_, idx) => ({
        pageNumber: 4 + idx,
        type: 'manuscript' as const,
        manuscriptIndex: idx,
        sectionTitle: 'Submission',
      })),
    ];
    return { totalPages: 3 + mCount, manuscriptCount: mCount, pages };
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
