import React from 'react';
import { ScanReport } from '../types';
import { DynamicTurnitinManuscriptPage } from '../utils/dynamicManuscriptEngine';
import { AuthenticPdfManuscriptPage } from './AuthenticPdfManuscriptPage';
import { DanishManuscriptPage } from './DanishManuscript';
import { Cyb2103ManuscriptPage } from './Cyb2103Manuscript';
import { KunalManuscriptPage } from './KunalManuscript';
import { isDanishDocument } from '../data/danishReport';
import { isCyb2103Document } from '../data/cyb2103Report';
import { isKunalReport } from '../data/kunalReport';

export interface TurnitinManuscriptRendererProps {
  report: ScanReport;
  mode: 'ai' | 'similarity';
  pageIndex: number; // 0-based index (representing manuscript pages 1..N)
  pageNumber: number; // Overall report page number
  totalPages: number;
}

/**
 * Universal Turnitin Manuscript Page Renderer.
 * Prioritizes direct authentic PDF pages (from LibreOffice conversion or direct PDF upload)
 * preserving 100% of the original document's tables, TOC, graphs, images, logos, stickers, and selectable text.
 * Falls back to dedicated sample manuscripts or dynamic engine when fileData is not present.
 */
export const TurnitinManuscriptPage: React.FC<TurnitinManuscriptRendererProps> = ({
  report,
  mode,
  pageIndex,
  pageNumber,
  totalPages,
}) => {
  if (report.id === 'rep-danish-tauseef-shoaib') {
    return (
      <DanishManuscriptPage
        report={report}
        mode={mode}
        pageIndex={pageIndex}
        pageNumber={pageNumber}
        totalPages={totalPages}
      />
    );
  }

  if (report.id === 'rep-cyb2103-cyber-risk') {
    return (
      <Cyb2103ManuscriptPage
        report={report}
        mode={mode}
        pageIndex={pageIndex}
        pageNumber={pageNumber}
        totalPages={totalPages}
      />
    );
  }

  if (report.id === 'rep-kunal-ai-dev') {
    return (
      <KunalManuscriptPage
        report={report}
        mode={mode}
        pageIndex={pageIndex}
        pageNumber={pageNumber}
        totalPages={totalPages}
      />
    );
  }

  // If authentic PDF data is available (from LibreOffice DOCX conversion or direct PDF upload),
  // render the exact original pages with tables, TOC, graphs, images, logos, stickers, and selectable text intact
  if (report.fileData) {
    return (
      <AuthenticPdfManuscriptPage
        report={report}
        mode={mode}
        pageIndex={pageIndex}
        pageNumber={pageNumber}
        totalPages={totalPages}
      />
    );
  }

  return (
    <DynamicTurnitinManuscriptPage
      report={report}
      mode={mode}
      pageIndex={pageIndex}
      pageNumber={pageNumber}
      totalPages={totalPages}
    />
  );
};
