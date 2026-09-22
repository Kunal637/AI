import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { PDFDocument } from 'pdf-lib';

const execFileAsync = promisify(execFile);

export interface ConvertDocxResult {
  success: boolean;
  pdfBase64?: string;
  pageCount?: number;
  error?: string;
}

// Locate the soffice or libreoffice binary
function getLibreOfficeBinary(): string | null {
  const candidates = [
    '/usr/bin/soffice',
    '/usr/bin/libreoffice',
    '/usr/local/bin/soffice',
    '/usr/local/bin/libreoffice',
  ];
  for (const bin of candidates) {
    if (fs.existsSync(bin)) {
      return bin;
    }
  }
  return null;
}

/**
 * Converts a DOCX file directly into an authentic, searchable, vector PDF
 * using server-side headless LibreOffice.
 *
 * This preserves:
 * - 100% exact page sequence, breaks, and layout
 * - All tables, borders, row heights, and column widths
 * - All images, logos, stickers, and embedded graphics
 * - Table of Contents (TOC) and hyperlinks
 * - Exact fonts, formatting, headers, and footers
 * - Full vector text selection, copy-pasting, and searchability
 */
export async function convertDocxToPdf(docxBase64: string): Promise<ConvertDocxResult> {
  const libreOfficeBin = getLibreOfficeBinary();
  if (!libreOfficeBin) {
    console.error('LibreOffice binary not found on server.');
    return {
      success: false,
      error: 'LibreOffice is not installed or accessible on this server.',
    };
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'turnitin-docx-'));
  const profileDir = path.join(tmpDir, 'profile');
  fs.mkdirSync(profileDir, { recursive: true });

  const inputDocxPath = path.join(tmpDir, 'document.docx');
  const outputPdfPath = path.join(tmpDir, 'document.pdf');

  try {
    const cleanBase64 = docxBase64.includes(',') ? docxBase64.split(',')[1] : docxBase64;
    const docxBuffer = Buffer.from(cleanBase64, 'base64');
    fs.writeFileSync(inputDocxPath, docxBuffer);

    // Run headless LibreOffice conversion with an isolated user profile
    const args = [
      '--headless',
      `-env:UserInstallation=file://${profileDir}`,
      '--convert-to',
      'pdf',
      '--outdir',
      tmpDir,
      inputDocxPath,
    ];

    await execFileAsync(libreOfficeBin, args, { timeout: 60000 });

    // Find the generated PDF in the output directory
    let generatedPdfPath = outputPdfPath;
    if (!fs.existsSync(generatedPdfPath)) {
      const files = fs.readdirSync(tmpDir);
      const pdfFile = files.find(f => f.toLowerCase().endsWith('.pdf'));
      if (pdfFile) {
        generatedPdfPath = path.join(tmpDir, pdfFile);
      } else {
        throw new Error('LibreOffice did not produce any PDF output.');
      }
    }

    const pdfBuffer = fs.readFileSync(generatedPdfPath);
    let pageCount = 1;
    try {
      const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
      pageCount = pdfDoc.getPageCount() || 1;
    } catch (e) {
      console.warn('PDFDocument could not read pageCount, defaulting to 1', e);
    }

    return {
      success: true,
      pdfBase64: pdfBuffer.toString('base64'),
      pageCount,
    };
  } catch (err: any) {
    console.error('LibreOffice DOCX to PDF conversion error:', err);
    return {
      success: false,
      error: err?.message || 'LibreOffice conversion failed',
    };
  } finally {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch (cleanupErr) {
      console.warn('Temp cleanup warning:', cleanupErr);
    }
  }
}

