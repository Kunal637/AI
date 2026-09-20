import * as pdfjsLib from 'pdfjs-dist';

// Set up worker source with cdnjs (version 4.4.168)
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.js`;
}

// In-memory cache to avoid re-rasterizing on every re-render or tab switch
const renderedPdfCache = new Map<string, string[]>();

export function cleanBase64ToUint8Array(fileData: string): Uint8Array {
  const cleanBase64 = fileData.includes(',') ? fileData.split(',')[1] : fileData;
  const binary = atob(cleanBase64.replace(/[\r\n\s]/g, ''));
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Renders every page of a PDF document into high-resolution PNG data URLs.
 * Preserves 100% of the original vector logos, layout, typography, and formatting.
 */
export async function renderPDFPagesToImages(
  fileData: string, // base64 string (with or without data:application/pdf;base64, prefix)
  scale: number = 2.0 // 2.0x for crisp retina display and high-quality canvas rendering
): Promise<string[]> {
  if (!fileData) return [];

  // Check cache
  const cacheKey = `${fileData.substring(0, 100)}_${fileData.length}_${scale}`;
  if (renderedPdfCache.has(cacheKey)) {
    return renderedPdfCache.get(cacheKey)!;
  }

  try {
    const bytes = cleanBase64ToUint8Array(fileData);
    const loadingTask = pdfjsLib.getDocument({
      data: bytes,
      useSystemFonts: true,
      cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/cmaps/`,
      cMapPacked: true,
    });

    loadingTask.onPassword = () => {};
    loadingTask.promise.catch(err => {
      console.error('PDF.js loadingTask rejected:', err);
    });

    const pdf = await loadingTask.promise;
    const images: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Render PDF page into canvas context (canvas is required in pdfjs-dist v4)
        await page.render({
          canvasContext: ctx,
          viewport,
          canvas,
        } as any).promise;

        images.push(canvas.toDataURL('image/png'));
      }
    }

    if (images.length > 0) {
      renderedPdfCache.set(cacheKey, images);
    }

    return images;
  } catch (err) {
    console.error('Error rendering PDF pages to images via pdf.js:', err);
    return [];
  }
}
