import React, { useMemo } from 'react';
import { ScanReport, MatchedSource } from '../types';
import {
  TurnitinPageHeader,
  TurnitinPageFooter,
  getBadgeColor,
} from '../components/TurnitinOfficialPages';
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
import { isDanishDocument } from '../data/danishReport';

export interface FormattedSegment {
  text: string;
  isPlagiarized?: boolean;
  sourceIndex?: number;
  isBlueUnderlined?: boolean;
  isAi?: boolean;
}

export interface FormattedParagraph {
  segments: FormattedSegment[];
  badges: number[];
  isAiParagraph?: boolean;
  isHeading?: boolean;
}

export interface ManuscriptPageData {
  pageIndex: number; // 0-based
  paragraphs: FormattedParagraph[];
  wordCount: number;
}

/**
 * Generates realistic, domain-tailored matched sources for any uploaded document.
 * Strictly clamps total plagiarism similarity within 1% to 17% (never exceeding 17%).
 */
export function generateSourcesForDocument(
  fileName: string,
  title: string,
  plagiarismScore: number
): MatchedSource[] {
  const cleanTitle = (title || fileName || '').toLowerCase();
  const clampedPlag = Math.min(17, Math.max(0, plagiarismScore));

  let domainSources: Array<{ name: string; url: string; type: 'internet' | 'publication' | 'student_paper' }> = [];

  if (cleanTitle.includes('risk') || cleanTitle.includes('cyber') || cleanTitle.includes('security') || cleanTitle.includes('cyb')) {
    domainSources = [
      { name: 'Computer security - Wikipedia', url: 'https://en.wikipedia.org/wiki/Computer_security', type: 'internet' },
      { name: 'WannaCry ransomware attack - Wikipedia', url: 'https://en.wikipedia.org/wiki/WannaCry_ransomware_attack', type: 'internet' },
      { name: 'NIST SP 800-30 Rev 1: Guide for Conducting Risk Assessments', url: 'https://csrc.nist.gov/publications/detail/sp/800-30/rev-1/final', type: 'publication' },
      { name: 'IEEE Transactions on Dependable and Secure Computing', url: 'https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=8858', type: 'publication' },
      { name: 'Submitted to University of Technology, Sydney', url: 'https://uts.edu.au/student-repository/archive', type: 'student_paper' },
      { name: 'SANS Institute InfoSec Reading Room', url: 'https://sans.org/white-papers/risk-management', type: 'internet' },
    ];
  } else if (cleanTitle.includes('clinic') || cleanTitle.includes('health') || cleanTitle.includes('medic') || cleanTitle.includes('diagnost')) {
    domainSources = [
      { name: 'The Lancet Digital Health: Machine Learning in Clinical Care', url: 'https://thelancet.com/journals/landig/article/PIIS2589-7500(23)00112-X', type: 'publication' },
      { name: 'Nature Medicine - Clinical Predictive Diagnostics', url: 'https://nature.com/articles/s41591-023-02482-1', type: 'publication' },
      { name: 'NCBI PMC National Library of Medicine', url: 'https://ncbi.nlm.nih.gov/pmc/articles/PMC8901234', type: 'internet' },
      { name: 'Submitted to Johns Hopkins University', url: 'https://jhu.edu/scholarworks/student-papers', type: 'student_paper' },
      { name: 'BioMed Central Medical Informatics and Decision Making', url: 'https://bmcmedinformdecismak.biomedcentral.com', type: 'publication' },
    ];
  } else if (cleanTitle.includes('learn') || cleanTitle.includes('ai') || cleanTitle.includes('neural') || cleanTitle.includes('comput')) {
    domainSources = [
      { name: 'arXiv.org - Computer Science: Artificial Intelligence', url: 'https://arxiv.org/abs/2304.09871', type: 'internet' },
      { name: 'IEEE Transactions on Pattern Analysis and Machine Intelligence', url: 'https://ieeexplore.ieee.org/document/945281', type: 'publication' },
      { name: 'ScienceDirect / Elsevier Cognitive Computation Archive', url: 'https://sciencedirect.com/science/article/pii/S18770509210087', type: 'publication' },
      { name: 'Submitted to Stanford University', url: 'https://stanford.edu/academics/repository/cs229', type: 'student_paper' },
      { name: 'Journal of Artificial Intelligence Research (JAIR)', url: 'https://jair.org/index.php/jair/article/view/11890', type: 'publication' },
    ];
  } else if (cleanTitle.includes('econ') || cleanTitle.includes('financ') || cleanTitle.includes('market') || cleanTitle.includes('trade')) {
    domainSources = [
      { name: 'Journal of Financial Economics (Elsevier)', url: 'https://sciencedirect.com/journal/journal-of-financial-economics', type: 'publication' },
      { name: 'NBER Working Paper Series - Macroeconomics & Quantitative Finance', url: 'https://nber.org/papers/w29810', type: 'publication' },
      { name: 'Federal Reserve Bank Economic Research Repository', url: 'https://federalreserve.gov/econres/feds/2023.htm', type: 'internet' },
      { name: 'Submitted to London School of Economics', url: 'https://lse.ac.uk/library/repository', type: 'student_paper' },
      { name: 'The American Economic Review', url: 'https://aeaweb.org/articles?id=10.1257/aer.20210982', type: 'publication' },
    ];
  } else {
    domainSources = [
      { name: 'ScienceDirect / Elsevier Academic Archive', url: 'https://sciencedirect.com/science/article/pii', type: 'publication' },
      { name: 'Harvard University Scholar Repository', url: 'https://harvard.edu/dash/handle/291', type: 'student_paper' },
      { name: 'Springer Nature Academic Publications', url: 'https://link.springer.com/chapter/10.1007/978-3-030', type: 'publication' },
      { name: 'Wikipedia - Academic Research & Empirical Methodology', url: 'https://en.wikipedia.org/wiki/Empirical_research', type: 'internet' },
      { name: 'Submitted to University of California, Berkeley', url: 'https://escholarship.org/uc/item/7pk8r91', type: 'student_paper' },
      { name: 'JSTOR Digital Archival Library', url: 'https://jstor.org/stable/2578912', type: 'publication' },
    ];
  }

  if (clampedPlag <= 0) {
    return [];
  }

  // Distribute the clampedPlag (1% to 17%) proportionally across the sources
  const count = Math.min(domainSources.length, Math.max(2, Math.min(4, Math.ceil(clampedPlag / 3.5))));
  const selected = domainSources.slice(0, count);

  // Weights for decreasing distribution (e.g. 60%, 25%, 15%)
  const rawWeights = [0.58, 0.28, 0.14, 0.08].slice(0, count);
  const weightSum = rawWeights.reduce((a, b) => a + b, 0);

  let remaining = clampedPlag;
  return selected.map((s, idx) => {
    let sim: number;
    if (idx === count - 1) {
      sim = Math.max(idx === 0 ? 1 : 0, remaining);
    } else {
      const normalizedWeight = rawWeights[idx] / weightSum;
      sim = Math.max(1, Math.round(clampedPlag * normalizedWeight));
      if (sim > remaining) sim = remaining;
      remaining -= sim;
    }

    return {
      id: `src-${idx + 1}`,
      name: s.name,
      url: s.url,
      similarity: sim,
      type: s.type,
    };
  });
}

/**
 * Paginates text cleanly into academic manuscript pages for an inserted document.
 * Strictly obeys:
 * - Plagiarism Similarity 1%–17% clamp.
 * - Exclude Quotes: Table of Contents & Quotes are excluded from plagiarism highlighting.
 * - Exclude Bibliography: References & Bibliography sections are excluded from plagiarism highlighting.
 */
export function paginateDocumentForTurnitin(
  report: ScanReport,
  mode: 'similarity' | 'ai'
): ManuscriptPageData[] {
  const isSimilarity = mode === 'similarity';
  const rawText = (report.text || report.contentSample || '').trim();
  const title = report.title || report.fileName || 'Academic Manuscript';
  const cleanTitle = title.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
  const excludeQuotes = report.excludeQuotes !== false;
  const excludeBibliography = report.excludeBibliography !== false;
  const isDanish = isDanishDocument(report.fileName || report.title);

  // Determine number of manuscript pages matching layout plan
  const targetManuscriptPages = isDanish
    ? 12
    : Math.max(1, report.pageCount || 1);

  // Split into raw paragraphs
  let rawParagraphs = rawText
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 10);

  // If we have text but fewer paragraphs than pages, subdivide paragraphs by sentences so each page has real text
  if (rawParagraphs.length > 0 && rawParagraphs.length < targetManuscriptPages) {
    const subdivided: string[] = [];
    for (const p of rawParagraphs) {
      const sentences = p.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g) || [p];
      if (sentences.length > 2 && subdivided.length + rawParagraphs.length <= targetManuscriptPages * 2) {
        const mid = Math.ceil(sentences.length / 2);
        subdivided.push(sentences.slice(0, mid).join('').trim());
        subdivided.push(sentences.slice(mid).join('').trim());
      } else {
        subdivided.push(p);
      }
    }
    rawParagraphs = subdivided;
  }

  // Only if document text is completely absent or trivial, provide standard academic sections
  if (rawParagraphs.length === 0) {
    const fallbackSections = [
      `Abstract: This document investigates key methodological frameworks, empirical assessments, and systemic implications regarding ${cleanTitle}. Academic integrity standards dictate that all research citations maintain transparent provenance, structured verifiability, and traceable lineage across institutional repositories.`,
      `1. Introduction & Background: The systematic study of ${cleanTitle} has gained substantial attention across modern institutional peer review ecosystems. Forensic evaluation demonstrates that linguistic entropy and cross-corpus attribution provide vital signals when analyzing scholastic prose. As demonstrated in comparative literature, rigorous citation integrity safeguards academic original authorship.`,
      `2. Theoretical Framework & Problem Formulation: Academic authorship models require explicit operational definitions to distinguish genuine synthesis from automated generation. In this section, we formulate the mathematical constraints governing structural lexical distribution and cross-document similarity verification.`,
      `3. Literature Review & Historical Evolution: Prior investigations by Anderson & Moore (2023) established foundational benchmarks for institutional originality checking. Further comparative studies by Cavusoglu & Mishra (2024) underscored the role of lexical burstiness and syntactic variability in automated integrity forensics.`,
      `4. Methodology & Analytical Architecture: We implemented rigorous attribution algorithms and multi-layered syntactic cross-matching. Computational pattern matching distinguishes direct textual overlap from authentic conceptual paraphrasing. Furthermore, token-level distribution curves highlight specific passages requiring close editorial review.`,
      `5. Data Acquisition & Corpus Preprocessing: A multi-institutional corpus comprising peer-reviewed papers, conference proceedings, and student submissions was normalized and parsed. All boilerplate headers, metadata descriptors, and standardized legal disclaimers were cataloged to ensure unbiased evaluation.`,
      `6. Empirical Observations & Quantitative Analysis: Comprehensive analysis across archival datasets indicates that standardized verification protocols significantly minimize accidental attribution errors. Controlled trials show that structured references allow academic researchers to maintain provenance while adhering to institutional integrity policies.`,
      `7. Model Benchmarking & Statistical Evaluation: Statistical testing revealed a 99.4% correlation between automated citation flags and human peer review determinations. Cross-validation across multiple disciplinary domains confirmed consistent precision across both STEM and humanities manuscripts.`,
      `8. Security & Text Manipulation Forensics: We evaluated document vulnerabilities against common obfuscation techniques, including zero-width character insertion, synonym swapping, and homoglyph substitution. Automated character-level normalization effectively neutralized these evasion strategies.`,
      `9. Case Study & Implementation Trials: In our pilot deployment across departmental examination committees, automated integrity reports reduced manual cross-verification time by 78% while increasing reviewer confidence in attribution veracity.`,
      `10. Discussion & Institutional Implications: The observed outcomes underline the necessity for automated integrity detection combined with human contextual evaluation. Institutional policies must emphasize formative educational feedback rather than punitive measures when interpreting similarity indices.`,
      `11. Limitations & Future Directions: While the presented architecture demonstrates high reliability across standard document formats, emerging multi-modal foundation models introduce novel attribution challenges that warrant ongoing empirical scrutiny.`,
      `12. Conclusion & Summary: This study confirms that transparent, multi-tiered originality assessment strengthens scholastic integrity while preserving academic freedom. Future research will explore real-time semantic provenance tracking across collaborative cloud authoring environments.`,
      `References\n[1] Anderson, R., & Moore, T. (2023). Empirical metrics in institutional peer verification. Journal of Academic Ethics, 18(4), 410–425.\n[2] Cavusoglu, H., & Mishra, B. (2024). Attribution integrity and forensic analysis in digital archives. Information Systems Research, 22(1), 89–104.\n[3] National Institute of Standards and Technology. (2022). Guidelines for Scholastic Provenance and Verification (NIST SP 800-160).\n[4] IEEE Computational Intelligence Society. (2025). Standards for Automated Text Attribution and Synthesis Classification. IEEE Std 2894-2025.\n[5] World Higher Education Consortium. (2024). Global Framework for Scholastic Authenticity in Higher Education. Geneva: WEC Publishing.`,
    ];

    const requiredParagraphs = Math.max(6, targetManuscriptPages * 2);
    while (rawParagraphs.length < requiredParagraphs) {
      for (const section of fallbackSections) {
        if (rawParagraphs.length >= requiredParagraphs) break;
        rawParagraphs.push(section);
      }
    }
  }

  // Target paragraphs per page (usually 2-3 per page)
  const paragraphsPerPage = Math.max(2, Math.ceil(rawParagraphs.length / targetManuscriptPages));

  // Determine plagiarism highlighting allocation strictly between 1% and 17%
  const plagScore = Math.min(17, Math.max(1, report.plagiarismScore || 1));
  const aiScore = report.aiScore || 0;

  // Track sentence index for consistent highlight assignment
  const sentenceList: { text: string; paraIdx: number; isToc: boolean; isQuote: boolean; isBib: boolean; isTable: boolean }[] = [];
  let inBibSection = false;
  let inTocSection = false;
  let inTableBlock = false;

  const splitParagraphs = rawParagraphs.map((paraText, pIdx) => {
    const trimmedPara = paraText.trim();
    // Check if paragraph is bibliography, TOC, or Table
    if (isBibliographyHeading(trimmedPara) || isBibliographyOrReferenceText(trimmedPara)) {
      inBibSection = true;
    }
    if (isTableOfContentsHeading(trimmedPara) || isTableOfContentsText(trimmedPara)) {
      inTocSection = true;
    } else if (
      inTocSection &&
      /^[0-9]+\.\s+[A-Za-z]/.test(trimmedPara) &&
      !trimmedPara.includes('....') &&
      !/\d+$/.test(trimmedPara)
    ) {
      // TOC section ended, body text started
      inTocSection = false;
    }

    if (isTableHeadingOrCaption(trimmedPara) || isTableText(trimmedPara)) {
      inTableBlock = true;
    } else if (inTableBlock && !trimmedPara.includes('|') && !trimmedPara.includes('\t')) {
      inTableBlock = false;
    }

    const isHeading =
      /^[0-9]\.\s|^Abstract:|^Conclusion:|^References:|^References$|^Bibliography|^Figure\s[0-9]/i.test(
        paraText
      );
    const sentences = paraText.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g) || [paraText];
    const cleanedSentences = sentences.map(s => s.trim()).filter(s => s.length > 5);

    cleanedSentences.forEach(s => {
      const isBib =
        inBibSection ||
        isBibliographyHeading(s) ||
        isCitationLine(s) ||
        isBibliographyOrReferenceText(s) ||
        isBibliographyOrReferenceText(paraText);
      const isToc =
        inTocSection ||
        isTableOfContentsHeading(s) ||
        isTableOfContentsEntry(s) ||
        isTableOfContentsText(s) ||
        isTableOfContentsText(paraText);
      const isTable =
        inTableBlock ||
        isTableHeadingOrCaption(s) ||
        isTableRowOrData(s) ||
        isTableText(s) ||
        isTableText(paraText);
      const isQuote = isQuoteText(s);
      sentenceList.push({ text: s, paraIdx: pIdx, isToc, isQuote, isBib, isTable });
    });

    return {
      rawText: paraText,
      isHeading,
      sentences: cleanedSentences,
    };
  });

  const totalSentences = sentenceList.length;

  // Identify eligible candidate sentences for highlighting:
  // Strictly NEVER highlight Table of Contents, Tables, or References!
  // Also exclude quotes if excludeQuotes is active.
  const eligibleIndices: number[] = [];
  for (let i = 0; i < totalSentences; i++) {
    const item = sentenceList[i];
    if (item.isToc || item.isTable || item.isBib || isExcludedFromHighlighting(item.text)) continue;
    if (excludeQuotes && item.isQuote) continue;
    eligibleIndices.push(i);
  }

  // Decide which sentences are plagiarized (proportional to clamped plagScore 1-17%, ensuring minimum coverage)
  const plagTargetCount =
    plagScore > 0 && eligibleIndices.length > 0
      ? Math.max(2, Math.min(eligibleIndices.length, Math.round((plagScore / 100) * totalSentences)))
      : 0;

  const plagSentenceIndices = new Map<number, { sourceIndex: number; isBlue: boolean }>();

  if (plagTargetCount > 0 && eligibleIndices.length > 0) {
    const step = Math.max(1, Math.floor(eligibleIndices.length / plagTargetCount));
    let assigned = 0;
    for (let i = 0; i < eligibleIndices.length && assigned < plagTargetCount; i += step) {
      const targetIdx = eligibleIndices[i];
      // 4-color highlighter rotation across 1, 2, 3, 4
      const srcIdx = (assigned % 4) + 1;
      const isBlue = srcIdx === 2;
      plagSentenceIndices.set(targetIdx, { sourceIndex: srcIdx, isBlue });
      assigned++;

      // Group next eligible sentence occasionally for paragraph match
      if (assigned < plagTargetCount && i + 1 < eligibleIndices.length && Math.random() > 0.4) {
        const nextTargetIdx = eligibleIndices[i + 1];
        plagSentenceIndices.set(nextTargetIdx, { sourceIndex: srcIdx, isBlue });
        assigned++;
      }
    }
  }

  // Decide which sentences are AI highlighted according to user criteria:
  // ai 1-20% result: (*%) no highlight in report (0% highlighted)
  // ai 21-70%: 15% data light blue highlighter
  // ai 0%: no highlighter
  let aiTargetCount = 0;
  if (aiScore >= 21 && aiScore <= 70) {
    aiTargetCount = Math.max(2, Math.min(eligibleIndices.length, Math.round(0.15 * eligibleIndices.length)));
  } else if (aiScore > 70) {
    aiTargetCount = Math.max(2, Math.min(eligibleIndices.length, Math.round((aiScore / 100) * totalSentences)));
  } else {
    aiTargetCount = 0;
  }

  const aiSentenceIndices = new Set<number>();

  if (aiTargetCount > 0 && eligibleIndices.length > 0) {
    const step = Math.max(1, Math.floor(eligibleIndices.length / aiTargetCount));
    let assigned = 0;
    for (let i = 0; i < eligibleIndices.length && assigned < aiTargetCount; i += step) {
      const targetIdx = eligibleIndices[i];
      if (!plagSentenceIndices.has(targetIdx) && !aiSentenceIndices.has(targetIdx)) {
        aiSentenceIndices.add(targetIdx);
        assigned++;
      }
    }
    // Fill remaining eligible sentences if step jumped or coincided with plagiarism
    for (let i = 0; i < eligibleIndices.length && assigned < aiTargetCount; i++) {
      const targetIdx = eligibleIndices[i];
      if (!plagSentenceIndices.has(targetIdx) && !aiSentenceIndices.has(targetIdx)) {
        aiSentenceIndices.add(targetIdx);
        assigned++;
      }
    }
  }

  // Build formatted paragraphs with segments
  let currentSentenceIndex = 0;
  const formattedParagraphs: FormattedParagraph[] = splitParagraphs.map(sp => {
    const segments: FormattedSegment[] = [];
    const badgesSet = new Set<number>();

    sp.sentences.forEach(sText => {
      const sIdx = currentSentenceIndex++;
      const item = sentenceList[sIdx];
      const isExcluded = item?.isToc || item?.isTable || item?.isBib || isExcludedFromHighlighting(sText) || isExcludedFromHighlighting(sp.rawText);

      const plagInfo = !isExcluded ? plagSentenceIndices.get(sIdx) : undefined;
      const isAi = !isExcluded && aiSentenceIndices.has(sIdx);

      if (isSimilarity && plagInfo) {
        badgesSet.add(plagInfo.sourceIndex);
        segments.push({
          text: sText + ' ',
          isPlagiarized: true,
          sourceIndex: plagInfo.sourceIndex,
          isBlueUnderlined: false,
        });
      } else if (!isSimilarity && isAi && aiScore > 0) {
        segments.push({
          text: sText + ' ',
          isAi: true,
        });
      } else {
        segments.push({
          text: sText + ' ',
        });
      }
    });

    return {
      segments,
      badges: Array.from(badgesSet).sort((a, b) => a - b),
      isHeading: sp.isHeading,
    };
  });

  // Distribute paragraphs into manuscript pages evenly
  const pages: ManuscriptPageData[] = [];
  const totalParas = formattedParagraphs.length;
  const parasPerBasePage = Math.floor(totalParas / targetManuscriptPages);
  const remainder = totalParas % targetManuscriptPages;

  let currentParaIdx = 0;
  for (let mIdx = 0; mIdx < targetManuscriptPages; mIdx++) {
    const count = parasPerBasePage + (mIdx < remainder ? 1 : 0);
    let pageParas = formattedParagraphs.slice(currentParaIdx, currentParaIdx + Math.max(1, count));
    currentParaIdx += Math.max(1, count);

    // Ensure every single manuscript page has at least one paragraph rendered
    if (pageParas.length === 0 && totalParas > 0) {
      const fallbackIdx = mIdx % totalParas;
      pageParas = [formattedParagraphs[fallbackIdx]];
    }

    const words = pageParas.reduce(
      (sum, p) => sum + p.segments.reduce((s2, seg) => s2 + seg.text.split(/\s+/).length, 0),
      0
    );

    pages.push({
      pageIndex: mIdx,
      paragraphs: pageParas,
      wordCount: words,
    });
  }

  return pages;
}

/**
 * High-fidelity Dynamic Manuscript Page for ANY inserted document.
 * Follows the EXACT Turnitin pattern, typography, colors, left gutter badges, and highlight styling.
 */
export const DynamicTurnitinManuscriptPage: React.FC<{
  report: ScanReport;
  mode: 'similarity' | 'ai';
  pageIndex: number;
  pageNumber: number;
  totalPages: number;
}> = ({ report, mode, pageIndex, pageNumber, totalPages }) => {
  const isSimilarity = mode === 'similarity';
  const submissionId = report.submissionId || 'trn:oid:::2:445438161';
  const sectionTitle = isSimilarity ? 'Submission' : 'AI Writing Submission';

  // Compute pages dynamically from inserted file content
  const pagesData = useMemo(() => {
    return paginateDocumentForTurnitin(report, mode);
  }, [report, mode]);

  const currentPage = pagesData[pageIndex] || pagesData[0] || {
    pageIndex: 0,
    paragraphs: [],
    wordCount: 0,
  };

  const renderBadge = (num: number, keyId?: string | number) => {
    const color = getBadgeColor(num);
    return (
      <span
        key={keyId}
        className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold font-mono ${color.bg} ${color.text} shadow-xs shrink-0`}
      >
        {num}
      </span>
    );
  };

  // Rich HTML paragraph layout with 4-color highlighters and AI highlighters
  return (
    <div className="flex flex-col justify-between h-full min-h-[960px] font-sans p-6 sm:p-10 text-slate-900 bg-white relative select-text">
      <TurnitinPageHeader
        pageNumber={pageNumber}
        totalPages={totalPages}
        sectionTitle={sectionTitle}
        submissionId={submissionId}
      />

      <div className="flex-1 my-auto text-[12.5px] leading-relaxed relative pt-4 pb-4">
        {/* On First Manuscript Page: Prominent Paper Title and Author block */}
        {pageIndex === 0 && (
          <div className="text-center space-y-1 mb-6 pb-3 border-b border-slate-200">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug">
              {report.title}
            </h1>
            <div className="text-xs text-slate-600 font-medium">
              <span>{report.author || 'Author'}</span>
              {report.institution && <span> • {report.institution}</span>}
            </div>
          </div>
        )}

        {/* Paragraphs with left gutter badges and authentic Turnitin highlights */}
        <div className="space-y-4 text-justify">
          {currentPage.paragraphs.map((para, pIdx) => {
            const hasBadges = isSimilarity && para.badges.length > 0;

            return (
              <div
                key={`p-${pageIndex}-${pIdx}`}
                className="flex items-start gap-3 relative group"
              >
                {/* Left Gutter: Numbered Badges matching Turnitin official format */}
                <div className="w-8 shrink-0 flex flex-col items-end gap-1 pt-0.5 select-none">
                  {hasBadges &&
                    para.badges.map((bNum, bIdx) =>
                      renderBadge(bNum, `gutter-b-${pageIndex}-${pIdx}-${bIdx}`)
                    )}
                  {!isSimilarity && report.aiScore > 20 && para.segments.some(s => s.isAi) && (
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-[#0284c7] text-white">
                      AI
                    </span>
                  )}
                </div>

                {/* Paragraph Content */}
                <div
                  className={`flex-1 text-slate-800 ${
                    para.isHeading
                      ? 'font-bold text-slate-900 text-sm mt-2 mb-1 border-b border-slate-100 pb-1'
                      : 'text-[12px] sm:text-[12.5px] leading-[1.75]'
                  }`}
                >
                  {para.segments.map((seg, sIdx) => {
                    if (isSimilarity && seg.isPlagiarized) {
                      const srcNum = seg.sourceIndex || 1;

                      // 4-color highlighter: 1 (Pink/Red), 2 (Blue), 3 (Emerald/Green), 4 (Purple)
                      // Badges appear on the LEFT side of the highlighted text
                      if (srcNum === 1) {
                        return (
                          <span
                            key={`seg-${sIdx}`}
                            style={{ backgroundColor: '#fca5a5', color: '#991b1b' }}
                            className="rounded-xs px-1 py-0.5 inline font-normal"
                          >
                            <span className="inline-flex items-center justify-center w-3 h-3 rounded-full text-[7.5px] font-bold font-mono bg-[#dc2626] text-white mr-1 align-baseline">
                              {srcNum}
                            </span>
                            {seg.text}
                          </span>
                        );
                      } else if (srcNum === 2) {
                        return (
                          <span
                            key={`seg-${sIdx}`}
                            style={{ backgroundColor: '#93c5fd', color: '#1e3a8a' }}
                            className="rounded-xs px-1 py-0.5 inline font-normal"
                          >
                            <span className="inline-flex items-center justify-center w-3 h-3 rounded-full text-[7.5px] font-bold font-mono bg-[#2563eb] text-white mr-1 align-baseline">
                              {srcNum}
                            </span>
                            {seg.text}
                          </span>
                        );
                      } else if (srcNum === 3) {
                        return (
                          <span
                            key={`seg-${sIdx}`}
                            style={{ backgroundColor: '#86efac', color: '#064e3b' }}
                            className="rounded-xs px-1 py-0.5 inline font-normal"
                          >
                            <span className="inline-flex items-center justify-center w-3 h-3 rounded-full text-[7.5px] font-bold font-mono bg-[#059669] text-white mr-1 align-baseline">
                              {srcNum}
                            </span>
                            {seg.text}
                          </span>
                        );
                      } else {
                        return (
                          <span
                            key={`seg-${sIdx}`}
                            style={{ backgroundColor: '#d8b4fe', color: '#4c1d95' }}
                            className="rounded-xs px-1 py-0.5 inline font-normal"
                          >
                            <span className="inline-flex items-center justify-center w-3 h-3 rounded-full text-[7.5px] font-bold font-mono bg-[#7c3aed] text-white mr-1 align-baseline">
                              {srcNum}
                            </span>
                            {seg.text}
                          </span>
                        );
                      }
                    }

                    if (!isSimilarity && seg.isAi && report.aiScore >= 21) {
                      return (
                        <span
                          key={`seg-${sIdx}`}
                          style={{
                            backgroundColor: '#93c5fd', // prominent light blue highlight for AI detection
                            color: '#1e3a8a',           // dark blue text
                          }}
                          className="rounded-xs px-1 py-0.5 inline font-normal"
                        >
                          {seg.text}
                        </span>
                      );
                    }

                    return <span key={`seg-${sIdx}`}>{seg.text}</span>;
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <TurnitinPageFooter
        pageNumber={pageNumber}
        totalPages={totalPages}
        sectionTitle={sectionTitle}
        submissionId={submissionId}
      />
    </div>
  );
};
