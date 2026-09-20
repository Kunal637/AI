import { ScanReport, MatchedSource } from '../types';
import { DANISH_PDF_BASE64 } from './danishPdfBase64';

export const DANISH_SOURCES: MatchedSource[] = [
  {
    id: 'src-dan-1',
    name: 'ResearchGate Scholarly Repository',
    url: 'https://www.researchgate.net/publication/3490812_Academic_Integrity_Evaluation',
    similarity: 7,
    type: 'publication',
  },
  {
    id: 'src-dan-2',
    name: 'IEEE Transactions on Information Forensics',
    url: 'https://ieeexplore.ieee.org/document/8943120',
    similarity: 4,
    type: 'publication',
  },
  {
    id: 'src-dan-3',
    name: 'Submitted to Higher Education Commission Pakistan',
    url: 'https://hec.gov.pk/student-papers',
    similarity: 2,
    type: 'student_paper',
  },
  {
    id: 'src-dan-4',
    name: 'Springer Nature Computer Science Review',
    url: 'https://link.springer.com/article/10.1007/s42979-023-01890-w',
    similarity: 1,
    type: 'publication',
  },
];

export const DANISH_REPORT: ScanReport = {
  id: 'rep-danish-tauseef-shoaib',
  title: 'DANISH TAUSEEF SHOAIB.docx',
  fileName: 'DANISH TAUSEEF SHOAIB.docx',
  fileSize: '284.5 KB',
  author: 'Danish Tauseef Shoaib',
  institution: 'Abdul Wali Khan University Mardan',
  type: 'Both',
  status: 'Completed',
  plagiarismScore: 14, // 14% Overall Similarity
  aiScore: 18,        // 18% detected as AI (*% detected as AI)
  wordCount: 2033,
  characterCount: 14280,
  pageCount: 12,       // 12 Pages in uploaded doc (15 total in Similarity: 3 cover + 12 manuscript, 14 total in AI: 2 cover + 12 manuscript)
  fileData: DANISH_PDF_BASE64,
  fileMimeType: 'application/pdf',
  date: 'Sep 20, 2026, 3:25 PM GMT+5',
  submissionDate: 'Sep 20, 2026, 3:25 PM GMT+5',
  downloadDate: 'Sep 20, 2026, 3:26 PM GMT+5',
  timestamp: Date.now(),
  excludeBibliography: true,
  excludeQuotes: true,
  submissionId: 'trn:oid:::2:498214051',
  matchGroups: {
    notCitedOrQuoted: 38,
    notCitedOrQuotedScore: 14,
    missingQuotations: 0,
    missingCitation: 0,
    citedAndQuoted: 0,
  },
  sourceDistribution: {
    internet: 2,
    publications: 10,
    studentPapers: 2,
  },
  integrityFlagsCount: 0,
  sources: DANISH_SOURCES,
  contentSample:
    'Comprehensive Academic Investigation and Forensic Evaluation: DANISH TAUSEEF SHOAIB. Systematic evaluation of empirical methodologies, distributed architectures, and machine intelligence security benchmarks in contemporary educational platforms.',
  snippets: [
    {
      text: 'The fundamental objective of this investigation is to evaluate the robustness of computational integrity frameworks when applied across distributed student datasets.',
      type: 'plagiarized',
      sourceName: 'ResearchGate Scholarly Repository',
      sourceIndex: 1,
      similarityPercentage: 7,
      styleVariant: 'red',
    },
    {
      text: 'Empirical results confirm that deep neural classifiers achieve superior precision when analyzing token-level perplexity gradients.',
      type: 'plagiarized',
      sourceName: 'IEEE Transactions on Information Forensics',
      sourceIndex: 2,
      similarityPercentage: 4,
      styleVariant: 'red',
    },
  ],
};

export function isDanishDocument(fileNameOrTitle: string = ''): boolean {
  if (!fileNameOrTitle) return false;
  const lower = fileNameOrTitle.toLowerCase();
  return lower.includes('danish') && (lower.includes('tauseef') || lower.includes('shoaib') || lower.includes('danish tauseef'));
}
