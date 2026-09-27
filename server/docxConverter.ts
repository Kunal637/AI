import fs from 'fs';
import os from 'os';
import path from 'path';
import { pathToFileURL } from 'url';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';

const execFileAsync = promisify(execFile);

export interface ConvertDocxResult {
  success: boolean;
  pdfBase64?: string;
  pageCount?: number;
  error?: string;
}

// Locate the soffice/libreoffice binary across common Linux, macOS, and Windows paths.
function getLibreOfficeBinary(): string | null {
  const candidates = new Set<string>([
    process.env.LIBREOFFICE_BIN,
    process.env.SOFFICE_BIN,
    'soffice',
    'soffice.exe',
    'libreoffice',
    'libreoffice.exe',
    '/usr/bin/soffice',
    '/usr/bin/libreoffice',
    '/usr/local/bin/soffice',
    '/usr/local/bin/libreoffice',
    'C:/Program Files/LibreOffice/program/soffice.exe',
    'C:/Program Files/LibreOffice/program/libreoffice.exe',
    'C:/Program Files (x86)/LibreOffice/program/soffice.exe',
    'C:/Program Files (x86)/LibreOffice/program/libreoffice.exe',
  ]);

  const pathEntries = (process.env.PATH || '')
    .split(path.delimiter)
    .filter(Boolean)
    .map(entry => entry.trim());

  for (const entry of pathEntries) {
    candidates.add(path.join(entry, 'soffice'));
    candidates.add(path.join(entry, 'soffice.exe'));
    candidates.add(path.join(entry, 'libreoffice'));
    candidates.add(path.join(entry, 'libreoffice.exe'));
  }

  for (const candidate of candidates) {
    if (!candidate) continue;

    const normalized = candidate.trim();
    if (!normalized) continue;

    const isCommandOnPath = !normalized.includes('/') && !normalized.includes('\\') && !normalized.includes('Program Files');
    if (isCommandOnPath) {
      try {
        const { execFileSync } = require('child_process');
        execFileSync('where', [normalized], { stdio: 'ignore' });
        return normalized;
      } catch {
        continue;
      }
    }

    if (fs.existsSync(normalized)) {
      return normalized;
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
export async function convertDocxToPdf(docxBase64: string, originalFileName = 'document.docx'): Promise<ConvertDocxResult> {
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

  const extension = path.extname(originalFileName).toLowerCase() === '.doc' ? '.doc' : '.docx';
  const inputDocxPath = path.join(tmpDir, `source${extension}`);
  const outputPdfPath = path.join(tmpDir, `source.pdf`);

  try {
    const cleanBase64 = docxBase64.includes(',') ? docxBase64.split(',')[1] : docxBase64;
    const docxBuffer = Buffer.from(cleanBase64, 'base64');
    if (docxBuffer.length < 4) {
      throw new Error('The uploaded Word file is empty or invalid.');
    }
    if (extension === '.docx' && docxBuffer.subarray(0, 2).toString() !== 'PK') {
      throw new Error('The uploaded file is not a valid DOCX package. Please upload the original DOCX file.');
    }
    let sourceBuffer = docxBuffer;
    if (extension === '.docx') {
      // Repair empty table-property extensions that some Word exporters place
      // inside table rows; LibreOffice rejects these nodes while Word/Mammoth tolerate them.
      const docxZip = await JSZip.loadAsync(docxBuffer);
      const documentXml = docxZip.file('word/document.xml');
      if (documentXml) {
        const xml = await documentXml.async('string');
        const repairedXml = xml
          .split('<w:tblPrEx></w:tblPrEx>').join('')
          .split('<w:tblPrEx/>').join('');
        if (repairedXml !== xml) {
          docxZip.file('word/document.xml', repairedXml);
          sourceBuffer = await docxZip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
        }
      }
    }
    fs.writeFileSync(inputDocxPath, sourceBuffer);

    // Run headless LibreOffice conversion with an isolated user profile.
    // On Windows, the profile path must be a valid file:// URL, not a raw Windows path.
    const userInstallationUrl = pathToFileURL(profileDir).href;
    const args = [
      '--headless',
      '--nologo',
      '--norestore',
      `-env:UserInstallation=${userInstallationUrl}`,
      '--convert-to',
      'pdf:writer_pdf_Export',
      '--outdir',
      tmpDir,
      inputDocxPath,
    ];

    try {
      await execFileAsync(libreOfficeBin, args, { timeout: 60000 });
    } catch (firstError: any) {
      // Some Windows LibreOffice builds reject the explicit export filter for a
      // document that the default Writer importer can still load.
      console.warn('LibreOffice explicit PDF filter failed; retrying with default filter:', firstError?.message);
      const retryProfileDir = path.join(tmpDir, 'retry-profile');
      fs.mkdirSync(retryProfileDir, { recursive: true });
      const retryArgs = [
        '--headless',
        '--nologo',
        '--norestore',
        `-env:UserInstallation=${pathToFileURL(retryProfileDir).href}`,
        '--convert-to',
        'pdf',
        '--outdir',
        tmpDir,
        inputDocxPath,
      ];
      await execFileAsync(libreOfficeBin, retryArgs, { timeout: 60000 });
    }

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

