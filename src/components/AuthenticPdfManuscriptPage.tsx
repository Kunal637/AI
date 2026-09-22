import React, { useEffect, useRef, useState, useMemo } from 'react';
import { ScanReport } from '../types';
import { cleanBase64ToUint8Array } from '../utils/pdfPageRenderer';
import { DynamicTurnitinManuscriptPage } from '../utils/dynamicManuscriptEngine';
import { TurnitinPageHeader, TurnitinPageFooter } from './TurnitinOfficialPages';
import {
  computeHighlightsForPage,
  getHighlightTheme,
  DocHighlightBox,
  RawTextItem,
} from '../utils/authenticDocHighlighter';
import * as pdfjsLib from 'pdfjs-dist';

export interface AuthenticPdfManuscriptPageProps {
  report: ScanReport;
  mode: 'ai' | 'similarity';
  pageIndex: number; // 0-based page index of the user's document
  pageNumber: number; // Overall Turnitin report page number
  totalPages: number;
}

interface TextItemOverlay extends RawTextItem {}

export const AuthenticPdfManuscriptPage: React.FC<AuthenticPdfManuscriptPageProps> = ({
  report,
  mode,
  pageIndex,
  pageNumber,
  totalPages,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [textItems, setTextItems] = useState<TextItemOverlay[]>([]);
  const [pageDimensions, setPageDimensions] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (!report.fileData) {
      setLoadError(true);
      return;
    }

    async function renderPage() {
      try {
        setLoading(true);
        const bytes = cleanBase64ToUint8Array(report.fileData);
        if (!bytes || bytes.length === 0) {
          throw new Error('Invalid PDF byte buffer');
        }

        const loadingTask = pdfjsLib.getDocument({
          data: bytes,
          useSystemFonts: true,
        });

        const pdf = await loadingTask.promise;
        const targetPageNum = pageIndex + 1;
        if (targetPageNum > pdf.numPages) {
          throw new Error(`Page ${targetPageNum} exceeds total pages ${pdf.numPages}`);
        }

        const page = await pdf.getPage(targetPageNum);
        // Base viewport for layout aspect ratio
        const baseViewport = page.getViewport({ scale: 1.0 });
        // High-res render scale for crystal sharp tables, graphs, logos, and fonts
        const renderScale = 2.0;
        const renderViewport = page.getViewport({ scale: renderScale });

        if (!isMounted) return;

        setPageDimensions({
          width: baseViewport.width,
          height: baseViewport.height,
        });

        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = renderViewport.width;
          canvas.height = renderViewport.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            await page.render({
              canvasContext: ctx,
              viewport: renderViewport,
              canvas,
            } as any).promise;
          }
        }

        // Extract text items for text selection, copy-pasting, and searchability
        try {
          const textContent = await page.getTextContent();
          const overlays: TextItemOverlay[] = [];

          for (const item of textContent.items as any[]) {
            if (!item.str || !item.transform) continue;
            // Convert PDF coordinates to viewport coordinates (scale: 1.0)
            const [vx, vy] = baseViewport.convertToViewportPoint(item.transform[4], item.transform[5]);
            const fontSize = Math.sqrt(
              item.transform[0] * item.transform[0] + item.transform[1] * item.transform[1]
            );
            const width = (item.width || 0) * baseViewport.scale;
            const height = Math.max(fontSize, 12);
            // vy is the baseline from top, so top edge is roughly vy - fontSize * 0.85
            const top = Math.max(0, vy - fontSize * 0.88);

            overlays.push({
              str: item.str,
              left: vx,
              top,
              width: Math.max(width, 4),
              height,
              fontSize,
            });
          }

          if (isMounted) {
            setTextItems(overlays);
          }
        } catch (textErr) {
          console.warn('Text layer extraction notice:', textErr);
        }

        if (isMounted) {
          setLoading(false);
        }
      } catch (err) {
        console.warn('AuthenticPdfManuscriptPage render error, falling back to dynamic engine:', err);
        if (isMounted) {
          setLoadError(true);
          setLoading(false);
        }
      }
    }

    renderPage();

    return () => {
      isMounted = false;
    };
  }, [report.fileData, pageIndex]);

  const submissionId = report.submissionId || 'trn:oid:::2:445438161';
  const sectionTitle = mode === 'ai' ? 'AI Writing Submission' : 'Submission';

  // Compute Turnitin document highlights directly for this page (hook must run unconditionally)
  const highlights = useMemo<DocHighlightBox[]>(() => {
    if (!pageDimensions || textItems.length === 0) return [];
    return computeHighlightsForPage(
      textItems,
      pageDimensions.width,
      pageDimensions.height,
      pageIndex,
      report,
      mode
    );
  }, [textItems, pageDimensions, pageIndex, report, mode]);

  // Fallback to dynamic manuscript engine if PDF rendering fails or fileData is unavailable
  if (loadError || !report.fileData) {
    return (
      <DynamicTurnitinManuscriptPage
        report={report}
        mode={mode}
        pageIndex={pageIndex}
        pageNumber={pageNumber}
        totalPages={totalPages}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="turnitin-authentic-pdf-page flex flex-col justify-between h-full min-h-[960px] font-sans p-6 sm:p-10 text-slate-900 bg-white select-text relative"
      style={{
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* EXACT TURNITIN OFFICIAL RUNNING HEADER AS OF COVER PAGES */}
      <TurnitinPageHeader
        pageNumber={pageNumber}
        totalPages={totalPages}
        sectionTitle={sectionTitle}
        submissionId={submissionId}
      />

      {/* DOCUMENT CANVAS CONTAINER (PRESERVING 100% TABLES, TOC, GRAPHS, IMAGES, STICKERS, AND LOGOS) */}
      <div className="flex-1 my-auto relative flex items-center justify-center py-4 overflow-hidden bg-white">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-sans">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span>Rendering authentic document page {pageIndex + 1}...</span>
            </div>
          </div>
        )}

        <div
          className="relative max-w-full shadow-xs border border-slate-200/60 bg-white"
          style={{
            width: pageDimensions ? `${pageDimensions.width}px` : '100%',
            maxWidth: '100%',
            aspectRatio: pageDimensions ? `${pageDimensions.width} / ${pageDimensions.height}` : '8.5 / 11',
          }}
        >
          {/* High-Resolution Rendered Canvas */}
          <canvas
            ref={canvasRef}
            className="w-full h-auto block"
            style={{ display: 'block' }}
          />

          {/* Turnitin Authentic Document Highlight Layer */}
          {highlights.length > 0 && (
            <div
              className="absolute inset-0 pointer-events-none select-none overflow-hidden"
              style={{
                width: '100%',
                height: '100%',
                zIndex: 10,
              }}
            >
              {highlights.map(h => {
                if (!pageDimensions) return null;
                const leftPercent = (h.left / pageDimensions.width) * 100;
                const topPercent = (h.top / pageDimensions.height) * 100;
                const widthPercent = (h.width / pageDimensions.width) * 100;
                const heightPercent = (h.height / pageDimensions.height) * 100;
                const theme = getHighlightTheme(h.type, h.sourceIndex);

                return (
                  <React.Fragment key={h.id}>
                    {/* Semi-transparent highlight band */}
                    <div
                      style={{
                        position: 'absolute',
                        left: `${leftPercent}%`,
                        top: `${topPercent}%`,
                        width: `${widthPercent}%`,
                        height: `${heightPercent}%`,
                        backgroundColor: theme.bg,
                        borderBottom: 'none',
                        mixBlendMode: 'multiply',
                        pointerEvents: 'none',
                      }}
                      className="rounded-[1.5px]"
                    />

                    {/* Turnitin numbered badge indicator at start/left of highlight */}
                    {h.showBadge && h.badgeNumber && (
                      <span
                        className="inline-flex items-center justify-center rounded-full font-bold font-mono text-white shadow-xs pointer-events-none select-none"
                        style={{
                          position: 'absolute',
                          left: `${((h.badgeLeft ?? Math.max(10, h.left - 15)) / pageDimensions.width) * 100}%`,
                          top: `${((h.badgeTop ?? h.top) / pageDimensions.height) * 100}%`,
                          width: '13px',
                          height: '13px',
                          fontSize: '8px',
                          lineHeight: '1',
                          backgroundColor: theme.badgeBg,
                          zIndex: 15,
                        }}
                      >
                        {h.badgeNumber}
                      </span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}

          {/* Selectable, Searchable & Copyable Text Layer */}
          <div
            className="absolute inset-0 pointer-events-auto select-text overflow-hidden"
            style={{
              width: '100%',
              height: '100%',
            }}
          >
            {textItems.map((item, idx) => {
              if (!pageDimensions) return null;
              const leftPercent = (item.left / pageDimensions.width) * 100;
              const topPercent = (item.top / pageDimensions.height) * 100;
              const widthPercent = (item.width / pageDimensions.width) * 100;

              return (
                <span
                  key={`text-item-${idx}`}
                  style={{
                    position: 'absolute',
                    left: `${leftPercent}%`,
                    top: `${topPercent}%`,
                    width: `${widthPercent}%`,
                    fontSize: `${item.fontSize}px`,
                    lineHeight: '1.1',
                    color: 'transparent',
                    whiteSpace: 'pre',
                    cursor: 'text',
                    userSelect: 'text',
                  }}
                  className="selection:bg-blue-500/30 selection:text-transparent"
                >
                  {item.str}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* EXACT TURNITIN OFFICIAL RUNNING FOOTER AS OF COVER PAGES */}
      <TurnitinPageFooter
        pageNumber={pageNumber}
        totalPages={totalPages}
        sectionTitle={sectionTitle}
        submissionId={submissionId}
      />
    </div>
  );
};
