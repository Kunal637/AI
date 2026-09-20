import React from 'react';
import { ScanReport } from '../types';
import { DynamicTurnitinManuscriptPage } from '../utils/dynamicManuscriptEngine';

export interface TurnitinManuscriptRendererProps {
  report: ScanReport;
  mode: 'ai' | 'similarity';
  pageIndex: number; // 0-based index (representing manuscript pages 1..N)
  pageNumber: number; // Overall report page number
  totalPages: number;
}

/**
 * Universal Turnitin Manuscript Page Renderer.
 * Directly renders original document pages as high-resolution canvas images via pdf.js
 * when uploaded PDF binary data is available, preserving 100% of the original vector logos,
 * layout, typography, and formatting.
 */
export const TurnitinManuscriptPage: React.FC<TurnitinManuscriptRendererProps> = ({
  report,
  mode,
  pageIndex,
  pageNumber,
  totalPages,
}) => {
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
