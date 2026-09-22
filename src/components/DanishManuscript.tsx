import React from 'react';
import { ScanReport } from '../types';
import { TurnitinPageHeader, TurnitinPageFooter, getBadgeColor } from './TurnitinOfficialPages';

interface DanishManuscriptProps {
  report: ScanReport;
  mode: 'ai' | 'similarity';
  pageIndex: number; // 0 to 11 (representing original document pages 1 to 12)
  pageNumber: number; // Overall report page number (e.g. 4 to 15 in Similarity, 3 to 14 in AI)
  totalPages: number; // 15 in Similarity, 14 in AI
}

/**
 * High-fidelity Vector SVG of Abdul Wali Khan University Mardan (AWKUM) Emblem
 */
export const AwkumLogo: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 195,
}) => {
  return (
    <div className={`inline-flex items-center justify-center select-none ${className}`}>
      <svg
        width={size}
        height={size * 1.05}
        viewBox="0 0 240 252"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-auto h-auto drop-shadow-xs"
      >
        <defs>
          <linearGradient id="awkum-gold-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>
          <linearGradient id="awkum-building-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e2d9cc" />
            <stop offset="50%" stopColor="#d5c8b5" />
            <stop offset="100%" stopColor="#bfa990" />
          </linearGradient>
          <radialGradient id="awkum-sky-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fefce8" />
            <stop offset="60%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#fde047" />
          </radialGradient>
        </defs>

        {/* Outer Flanking Laurel Wreath (Leaves Left & Right) */}
        {/* Left Laurel Wreath */}
        <g stroke="#15803d" strokeWidth="1.2" fill="#16a34a">
          <path d="M 24 135 C 18 102 28 65 52 42" stroke="#15803d" strokeWidth="2.5" fill="none" />
          {/* Leaves on left side */}
          <ellipse cx="20" cy="120" rx="6" ry="3" transform="rotate(-30 20 120)" fill="#16a34a" />
          <ellipse cx="22" cy="100" rx="6.5" ry="3.2" transform="rotate(-40 22 100)" fill="#15803d" />
          <ellipse cx="28" cy="80" rx="7" ry="3.5" transform="rotate(-50 28 80)" fill="#16a34a" />
          <ellipse cx="38" cy="62" rx="7" ry="3.5" transform="rotate(-60 38 62)" fill="#15803d" />
          <ellipse cx="50" cy="48" rx="6.5" ry="3.2" transform="rotate(-70 50 48)" fill="#16a34a" />
          
          <ellipse cx="14" cy="128" rx="5.5" ry="2.8" transform="rotate(-15 14 128)" fill="#ca8a04" />
          <ellipse cx="15" cy="108" rx="6" ry="3" transform="rotate(-25 15 108)" fill="#ca8a04" />
          <ellipse cx="19" cy="90" rx="6" ry="3" transform="rotate(-35 19 90)" fill="#ca8a04" />
          <ellipse cx="26" cy="72" rx="6" ry="3" transform="rotate(-45 26 72)" fill="#ca8a04" />
          <ellipse cx="36" cy="56" rx="6" ry="3" transform="rotate(-55 36 56)" fill="#ca8a04" />
        </g>

        {/* Right Laurel Wreath */}
        <g stroke="#15803d" strokeWidth="1.2" fill="#16a34a">
          <path d="M 216 135 C 222 102 212 65 188 42" stroke="#15803d" strokeWidth="2.5" fill="none" />
          {/* Leaves on right side */}
          <ellipse cx="220" cy="120" rx="6" ry="3" transform="rotate(30 220 120)" fill="#16a34a" />
          <ellipse cx="218" cy="100" rx="6.5" ry="3.2" transform="rotate(40 218 100)" fill="#15803d" />
          <ellipse cx="212" cy="80" rx="7" ry="3.5" transform="rotate(50 212 80)" fill="#16a34a" />
          <ellipse cx="202" cy="62" rx="7" ry="3.5" transform="rotate(60 202 62)" fill="#15803d" />
          <ellipse cx="190" cy="48" rx="6.5" ry="3.2" transform="rotate(70 190 48)" fill="#16a34a" />

          <ellipse cx="226" cy="128" rx="5.5" ry="2.8" transform="rotate(15 226 128)" fill="#ca8a04" />
          <ellipse cx="225" cy="108" rx="6" ry="3" transform="rotate(25 225 108)" fill="#ca8a04" />
          <ellipse cx="221" cy="90" rx="6" ry="3" transform="rotate(35 221 90)" fill="#ca8a04" />
          <ellipse cx="214" cy="72" rx="6" ry="3" transform="rotate(45 214 72)" fill="#ca8a04" />
          <ellipse cx="204" cy="56" rx="6" ry="3" transform="rotate(55 204 56)" fill="#ca8a04" />
        </g>

        {/* Outer Circular Green Ring */}
        <circle cx="120" cy="126" r="92" fill="#14532d" stroke="#ca8a04" strokeWidth="3" />
        <circle cx="120" cy="126" r="88" fill="none" stroke="#fef08a" strokeWidth="1.2" />

        {/* Inner Gold Circular Frame */}
        <circle cx="120" cy="126" r="66" fill="#ca8a04" stroke="#78350f" strokeWidth="1" />
        <circle cx="120" cy="126" r="63" fill="url(#awkum-sky-grad)" stroke="#14532d" strokeWidth="1.5" />

        {/* Curved Text Paths */}
        <path id="awkum-path-top" d="M 40 126 A 80 80 0 1 1 200 126" fill="none" />
        
        <text fontSize="9.5" fontWeight="bold" fill="#ffffff" fontFamily="Arial, 'Helvetica Neue', sans-serif" letterSpacing="1.2">
          <textPath href="#awkum-path-top" startOffset="50%" textAnchor="middle">
            ABDUL WALI KHAN UNIVERSITY MARDAN
          </textPath>
        </text>

        {/* Central Architectural Illustration (AWKUM Main Building) */}
        <g transform="translate(68, 76)">
          {/* Background Hills / Mountain Silhouette */}
          <path d="M 0 54 Q 28 36 52 50 Q 80 34 104 54 L 104 56 L 0 56 Z" fill="#cbd5e1" opacity="0.6" />
          
          {/* Main University Building Facade */}
          <rect x="12" y="34" width="80" height="38" fill="url(#awkum-building-grad)" stroke="#57534e" strokeWidth="1" />
          
          {/* Central Pediment & Great Dome */}
          <path d="M 38 34 L 52 20 L 66 34 Z" fill="#a8a29e" stroke="#57534e" strokeWidth="1" />
          <path d="M 42 20 C 42 8 62 8 62 20 Z" fill="#d97706" stroke="#78350f" strokeWidth="1.2" />
          {/* Spire / Crescent */}
          <line x1="52" y1="8" x2="52" y2="2" stroke="#78350f" strokeWidth="1.2" />
          <circle cx="52" cy="2" r="1.5" fill="#f59e0b" />

          {/* Left Wing Tower */}
          <rect x="6" y="24" width="10" height="48" fill="#d6d3d1" stroke="#57534e" strokeWidth="1" />
          <polygon points="6,24 11,14 16,24" fill="#a8a29e" stroke="#57534e" strokeWidth="1" />

          {/* Right Wing Tower */}
          <rect x="88" y="24" width="10" height="48" fill="#d6d3d1" stroke="#57534e" strokeWidth="1" />
          <polygon points="88,24 93,14 98,24" fill="#a8a29e" stroke="#57534e" strokeWidth="1" />

          {/* Center Grand Archway */}
          <path d="M 44 72 L 44 48 Q 52 40 60 48 L 60 72 Z" fill="#292524" stroke="#1c1917" strokeWidth="1" />
          <path d="M 47 72 L 47 52 Q 52 46 57 52 L 57 72 Z" fill="#0c0a09" />

          {/* Architectural Windows */}
          <rect x="18" y="40" width="6" height="12" rx="1" fill="#44403c" />
          <rect x="28" y="40" width="6" height="12" rx="1" fill="#44403c" />
          <rect x="18" y="56" width="6" height="10" rx="1" fill="#44403c" />
          <rect x="28" y="56" width="6" height="10" rx="1" fill="#44403c" />

          <rect x="70" y="40" width="6" height="12" rx="1" fill="#44403c" />
          <rect x="80" y="40" width="6" height="12" rx="1" fill="#44403c" />
          <rect x="70" y="56" width="6" height="10" rx="1" fill="#44403c" />
          <rect x="80" y="56" width="6" height="10" rx="1" fill="#44403c" />

          {/* Front Terrace Steps */}
          <line x1="2" y1="72" x2="102" y2="72" stroke="#44403c" strokeWidth="2.5" />
        </g>

        {/* Top Red Calligraphy Ribbon: العلم نور */}
        <g transform="translate(120, 24)">
          <path
            d="M -54 10 Q 0 -6 54 10 Q 42 24 38 22 Q 0 12 -38 22 Q -42 24 -54 10 Z"
            fill="#dc2626"
            stroke="#991b1b"
            strokeWidth="1.5"
          />
          <text
            x="0"
            y="14"
            textAnchor="middle"
            fontSize="14"
            fontWeight="bold"
            fill="#ffffff"
            fontFamily="'Traditional Arabic', 'Scheherazade New', 'Amiri', serif"
          >
            العلم نور
          </text>
        </g>

        {/* Bottom Gold Ribbon with Foundation Year 2009 */}
        <g transform="translate(120, 204)">
          <polygon points="-46,4 -60,-6 -54,12" fill="#15803d" stroke="#14532d" strokeWidth="1" />
          <polygon points="46,4 60,-6 54,12" fill="#15803d" stroke="#14532d" strokeWidth="1" />
          
          <path
            d="M -46 -2 Q 0 8 46 -2 L 42 16 Q 0 24 -42 16 Z"
            fill="#15803d"
            stroke="#ca8a04"
            strokeWidth="1.5"
          />
          <text
            x="0"
            y="12"
            textAnchor="middle"
            fontSize="11"
            fontWeight="bold"
            fill="#ffffff"
            fontFamily="Arial, sans-serif"
            letterSpacing="1.5"
          >
            2009
          </text>
        </g>
      </svg>
    </div>
  );
};

export const DanishManuscriptPage: React.FC<DanishManuscriptProps> = ({
  report,
  mode,
  pageIndex,
  pageNumber,
  totalPages,
}) => {
  const isSimilarity = mode === 'similarity';
  const submissionId = report.submissionId || 'trn:oid:::2:498214051';
  const sectionTitle = isSimilarity ? 'Submission' : 'AI Writing Submission';

  // Badge pill helper - positioned on the LEFT side of highlighted phrases
  const renderBadge = (num: number) => {
    const color = getBadgeColor(num);
    return (
      <span
        key={`dan-b-${num}`}
        className={`inline-flex items-center justify-center w-3.5 h-3.5 rounded-full text-[8.5px] font-bold font-mono ${color.bg} ${color.text} shadow-2xs mr-1 align-middle`}
      >
        {num}
      </span>
    );
  };

  // Similarity text highlight helper (4-color rotation) & AI highlighter (light blue for 21-70%)
  const hl = (
    text: string,
    sourceNum: number = 1,
    styleVariant?: 'red' | 'blue_underlined'
  ) => {
    // AI Writing Mode Highlighting Logic:
    // ai 1-20% result: 70% data (star%) no highlight in report
    // ai 21-70%: 15% data light blue highlighter
    // ai 0%: 15% data no highlighter
    if (!isSimilarity) {
      if (report.aiScore >= 21 && (sourceNum === 1 || sourceNum === 2)) {
        return (
          <span
            style={{
              backgroundColor: '#93c5fd', // prominent light blue highlighter
              color: '#1e3a8a',           // dark blue text
            }}
            className="rounded-xs px-1 py-0.5 inline font-normal"
          >
            {text}
          </span>
        );
      }
      return <span>{text}</span>;
    }

    // Similarity Mode: 4-color Turnitin palette (1: Red/Pink, 2: Blue, 3: Emerald/Green, 4: Purple)
    const color = getBadgeColor(sourceNum);
    const isBlue = styleVariant === 'blue_underlined' || sourceNum === 2 || color.isUnderlined;
    const isGreen = sourceNum === 3;
    const isPurple = sourceNum === 4;

    if (isBlue) {
      return (
        <span
          style={{
            backgroundColor: '#93c5fd',
            color: '#1e3a8a',
          }}
          className="rounded-xs px-1 py-0.5 inline font-normal"
        >
          {renderBadge(sourceNum)}
          {text}
        </span>
      );
    }

    if (isGreen) {
      return (
        <span
          style={{
            backgroundColor: '#86efac',
            color: '#064e3b',
          }}
          className="rounded-xs px-1 py-0.5 inline font-normal"
        >
          {renderBadge(sourceNum)}
          {text}
        </span>
      );
    }

    if (isPurple) {
      return (
        <span
          style={{
            backgroundColor: '#d8b4fe',
            color: '#4c1d95',
          }}
          className="rounded-xs px-1 py-0.5 inline font-normal"
        >
          {renderBadge(sourceNum)}
          {text}
        </span>
      );
    }

    // Default Source 1 (Red / Pink)
    return (
      <span
        style={{
          backgroundColor: '#fca5a5',
          color: '#991b1b',
        }}
        className="rounded-xs px-1 py-0.5 inline font-normal"
      >
        {renderBadge(sourceNum)}
        {text}
      </span>
    );
  };

  return (
    <div className="flex flex-col justify-between h-full min-h-[1050px] font-serif p-6 sm:p-10 text-slate-900 bg-white select-text relative">
      {/* Turnitin Official Header on every page */}
      <TurnitinPageHeader
        pageNumber={pageNumber}
        totalPages={totalPages}
        sectionTitle={sectionTitle}
        submissionId={submissionId}
      />

      {/* Main Page Content Body */}
      <div className="mt-6 mb-auto space-y-4 max-w-3xl w-full mx-auto text-[13px] sm:text-[13.5px] leading-[1.65] text-slate-900">
        {/* ========================================================= */}
        {/* PAGE 1: TITLE PAGE (Exact Match to WPS Office Page 1)    */}
        {/* ========================================================= */}
        {pageIndex === 0 && (
          <div className="relative flex flex-col items-center justify-between min-h-[820px] pt-2 pb-2 px-6 text-center font-['Times_New_Roman',serif]">
            {/* Subtle Print Layout Corner Crop Marks */}
            <div className="absolute top-0 left-0 text-slate-300 select-none text-[14px] leading-none pointer-events-none">┌</div>
            <div className="absolute top-0 right-0 text-slate-300 select-none text-[14px] leading-none pointer-events-none">┐</div>
            <div className="absolute bottom-0 left-0 text-slate-300 select-none text-[14px] leading-none pointer-events-none">└</div>
            <div className="absolute bottom-0 right-0 text-slate-300 select-none text-[14px] leading-none pointer-events-none">┘</div>

            {/* Top Emblem */}
            <div className="mt-1 mb-6 flex justify-center">
              <AwkumLogo size={190} />
            </div>

            {/* Document Title */}
            <div className="max-w-xl mx-auto space-y-4">
              <h1 className="text-[15px] sm:text-[16px] font-bold text-black leading-[1.5] tracking-normal font-['Times_New_Roman',serif]">
                A Pragmatic Analysis of English Discourse Markers: Functions and Their Role in
                <br />
                Negotiating Meaning
              </h1>

              <div className="text-[14px] sm:text-[15px] font-bold text-black font-['Times_New_Roman',serif] pt-2">
                BY
              </div>
            </div>

            {/* Students & Registration Grid */}
            <div className="flex justify-center w-full mt-6 mb-14">
              <div className="grid grid-cols-[auto_auto] gap-x-12 sm:gap-x-16 text-[13.5px] sm:text-[14px] font-['Times_New_Roman',serif] text-black text-left">
                <div className="font-bold pb-2">Name</div>
                <div className="font-bold pb-2">Reg No:</div>

                <div className="py-0.5 text-black">Muhammad Shoaib</div>
                <div className="py-0.5 font-bold text-black">Reg #:22-AU-TBM-149</div>

                <div className="py-0.5 text-black">Hamid Shah Danish</div>
                <div className="py-0.5 font-bold text-black">Reg #:22-AU-TBM-172</div>

                <div className="py-0.5 text-black">Muhammad Tauseef Karim</div>
                <div className="py-0.5 font-bold text-black">Reg #:22-AU-TBM-153</div>
              </div>
            </div>

            {/* Bottom Page Number in Original Doc */}
            <div className="text-[12px] font-serif text-black mt-auto pb-2">
              1
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PAGE 2: TABLE OF CONTENTS (Clean - No Highlights)        */}
        {/* ========================================================= */}
        {pageIndex === 1 && (
          <div className="space-y-4 py-4 px-2 font-['Times_New_Roman',serif]">
            <h2 className="text-[17px] font-bold text-center text-slate-950 mb-6 uppercase tracking-wide">
              Table of Contents
            </h2>

            <div className="space-y-2.5 text-[13px] leading-normal text-slate-900">
              <div className="flex justify-between items-baseline font-bold border-b border-slate-200 pb-1">
                <span>Contents</span>
                <span>Page No.</span>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold">1. Introduction</span>
                  <span className="flex-1 mx-2 border-b border-dotted border-slate-400" />
                  <span className="font-semibold">3</span>
                </div>
                <div className="flex justify-between items-baseline pl-4 text-slate-800">
                  <span>1.1 Background of the Study</span>
                  <span className="flex-1 mx-2 border-b border-dotted border-slate-400" />
                  <span>3</span>
                </div>
                <div className="flex justify-between items-baseline pl-4 text-slate-800">
                  <span>1.2 Statement of the Problem</span>
                  <span className="flex-1 mx-2 border-b border-dotted border-slate-400" />
                  <span>3</span>
                </div>
                <div className="flex justify-between items-baseline pl-4 text-slate-800">
                  <span>1.3 Research Objectives</span>
                  <span className="flex-1 mx-2 border-b border-dotted border-slate-400" />
                  <span>4</span>
                </div>
                <div className="flex justify-between items-baseline pl-4 text-slate-800">
                  <span>1.4 Research Questions</span>
                  <span className="flex-1 mx-2 border-b border-dotted border-slate-400" />
                  <span>4</span>
                </div>
                <div className="flex justify-between items-baseline pl-4 text-slate-800">
                  <span>1.5 Significance of the Study</span>
                  <span className="flex-1 mx-2 border-b border-dotted border-slate-400" />
                  <span>4</span>
                </div>
                <div className="flex justify-between items-baseline pl-4 text-slate-800">
                  <span>1.6 Delimitations of the Study</span>
                  <span className="flex-1 mx-2 border-b border-dotted border-slate-400" />
                  <span>4</span>
                </div>

                <div className="flex justify-between items-baseline font-bold pt-2">
                  <span>2. Literature Review</span>
                  <span className="flex-1 mx-2 border-b border-dotted border-slate-400" />
                  <span className="font-semibold">5</span>
                </div>
                <div className="flex justify-between items-baseline pl-4 text-slate-800">
                  <span>2.1 Conceptual Definition of Discourse Markers</span>
                  <span className="flex-1 mx-2 border-b border-dotted border-slate-400" />
                  <span>5</span>
                </div>
                <div className="flex justify-between items-baseline pl-4 text-slate-800">
                  <span>2.2 Pragmatic Frameworks: Schiffrin and Fraser</span>
                  <span className="flex-1 mx-2 border-b border-dotted border-slate-400" />
                  <span>5</span>
                </div>
                <div className="flex justify-between items-baseline pl-4 text-slate-800">
                  <span>2.3 Functional Taxonomy in Spoken Interaction</span>
                  <span className="flex-1 mx-2 border-b border-dotted border-slate-400" />
                  <span>6</span>
                </div>

                <div className="flex justify-between items-baseline font-bold pt-2">
                  <span>3. Research Methodology</span>
                  <span className="flex-1 mx-2 border-b border-dotted border-slate-400" />
                  <span className="font-semibold">7</span>
                </div>
                <div className="flex justify-between items-baseline pl-4 text-slate-800">
                  <span>3.1 Research Design & Approach</span>
                  <span className="flex-1 mx-2 border-b border-dotted border-slate-400" />
                  <span>7</span>
                </div>
                <div className="flex justify-between items-baseline pl-4 text-slate-800">
                  <span>3.2 Corpus Sampling & Distribution (Table 1)</span>
                  <span className="flex-1 mx-2 border-b border-dotted border-slate-400" />
                  <span>7</span>
                </div>
                <div className="flex justify-between items-baseline pl-4 text-slate-800">
                  <span>3.3 Data Analysis Procedures</span>
                  <span className="flex-1 mx-2 border-b border-dotted border-slate-400" />
                  <span>8</span>
                </div>

                <div className="flex justify-between items-baseline font-bold pt-2">
                  <span>4. Data Analysis & Findings</span>
                  <span className="flex-1 mx-2 border-b border-dotted border-slate-400" />
                  <span className="font-semibold">9</span>
                </div>
                <div className="flex justify-between items-baseline pl-4 text-slate-800">
                  <span>4.1 Quantitative Frequency Distribution (Table 2)</span>
                  <span className="flex-1 mx-2 border-b border-dotted border-slate-400" />
                  <span>9</span>
                </div>
                <div className="flex justify-between items-baseline pl-4 text-slate-800">
                  <span>4.2 Pragmatic Function Analysis & Discussion</span>
                  <span className="flex-1 mx-2 border-b border-dotted border-slate-400" />
                  <span>10</span>
                </div>

                <div className="flex justify-between items-baseline font-bold pt-2">
                  <span>5. Conclusion and Recommendations</span>
                  <span className="flex-1 mx-2 border-b border-dotted border-slate-400" />
                  <span className="font-semibold">11</span>
                </div>

                <div className="flex justify-between items-baseline font-bold pt-2">
                  <span>References</span>
                  <span className="flex-1 mx-2 border-b border-dotted border-slate-400" />
                  <span className="font-semibold">12</span>
                </div>
              </div>
            </div>

            <div className="text-center text-[12px] font-serif text-slate-800 pt-16">
              2
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PAGE 3: CHAPTER 1 - INTRODUCTION                         */}
        {/* ========================================================= */}
        {pageIndex === 2 && (
          <div className="space-y-4 font-['Times_New_Roman',serif]">
            <h2 className="text-[16px] font-bold text-center text-slate-950 uppercase tracking-wide">
              Chapter 1: Introduction
            </h2>

            <h3 className="text-[14px] font-bold text-slate-950 mt-4">
              1.1 Background of the Study
            </h3>
            <p className="text-justify indent-8">
              {hl(
                'Discourse markers (DMs) constitute an indispensable linguistic mechanism in human communication, functioning as structural brackets that manage information exchange and interpersonal alignment.',
                1,
                'red'
              )}{' '}
              In English linguistics, items such as <em>well</em>, <em>you know</em>, <em>I mean</em>,{' '}
              <em>actually</em>, and <em>anyway</em> have transitioned from being viewed as stylistic filler words
              to recognized pragmatic devices that guide conversational processing.
            </p>
            <p className="text-justify indent-8">
              Schiffrin (1987) established that discourse markers operate across multiple planes of talk,
              including exchange structures, action structures, idea structures, and participation frameworks.
              Within second language (L2) academic environments, the mastery of these pragmatic markers reflects
              a learner&apos;s communicative competence and fluency in negotiating meaning during collaborative
              dialogue.
            </p>

            <h3 className="text-[14px] font-bold text-slate-950 mt-6">
              1.2 Statement of the Problem
            </h3>
            <p className="text-justify indent-8">
              {hl(
                'Despite extensive theoretical research into discourse markers within native speaker corpora, empirical investigations focusing on Pakistani ESL tertiary learners remain scarce.',
                2,
                'red'
              )}{' '}
              L2 speakers often encounter challenges in employing discourse markers appropriately, resulting in
              conversational breakdown, abrupt topic shifts, or unintended pragmalinguistic infelicities during
              academic discourse.
            </p>
            <p className="text-justify indent-8">
              This research addresses this empirical void by systematically investigating how undergraduate students
              at Abdul Wali Khan University Mardan deploy English discourse markers to construct cohesion, negotiate
              interpretive meaning, and sustain collaborative interaction.
            </p>

            <div className="text-center text-[12px] font-serif text-slate-800 pt-8">
              3
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PAGE 4: OBJECTIVES & QUESTIONS                           */}
        {/* ========================================================= */}
        {pageIndex === 3 && (
          <div className="space-y-4 font-['Times_New_Roman',serif]">
            <h3 className="text-[14px] font-bold text-slate-950">
              1.3 Research Objectives
            </h3>
            <p className="text-justify">
              The primary objectives of this investigation are:
            </p>
            <ul className="list-decimal pl-8 space-y-2 text-justify">
              <li>
                To identify the frequency and distribution of specific English discourse markers (e.g., <em>well</em>, <em>you know</em>, <em>I mean</em>, <em>actually</em>) in ESL student interaction.
              </li>
              <li>
                {hl(
                  'To analyze the pragmatic functions performed by discourse markers in managing conversational turn-taking, topic transition, and hedging.',
                  1,
                  'red'
                )}
              </li>
              <li>
                To examine the communicative challenges and pragmatic transfers observed among Pakistani ESL learners during meaning negotiation.
              </li>
            </ul>

            <h3 className="text-[14px] font-bold text-slate-950 mt-6">
              1.4 Research Questions
            </h3>
            <ul className="list-decimal pl-8 space-y-2 text-justify">
              <li>
                What is the quantitative occurrence of selected discourse markers in the academic spoken corpus of AWKUM ESL students?
              </li>
              <li>
                How do ESL learners utilize discourse markers to negotiate meaning and mitigate face-threatening acts during peer interactions?
              </li>
              <li>
                What pedagogical implications emerge for integrating pragmatic discourse markers into English language teaching curricula?
              </li>
            </ul>

            <h3 className="text-[14px] font-bold text-slate-950 mt-6">
              1.5 Significance of the Study
            </h3>
            <p className="text-justify indent-8">
              {hl(
                'This research provides critical empirical insights for applied linguists, curriculum developers, and ESL educators seeking to enhance pragmatic instruction in higher education.',
                3,
                'red'
              )}{' '}
              By documenting naturalistic spoken interaction, the study illuminates the nuanced ways learners employ linguistic markers to establish mutual intelligibility.
            </p>

            <div className="text-center text-[12px] font-serif text-slate-800 pt-10">
              4
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PAGE 5: CHAPTER 2 - LITERATURE REVIEW                     */}
        {/* ========================================================= */}
        {pageIndex === 4 && (
          <div className="space-y-4 font-['Times_New_Roman',serif]">
            <h2 className="text-[16px] font-bold text-center text-slate-950 uppercase tracking-wide">
              Chapter 2: Literature Review
            </h2>

            <h3 className="text-[14px] font-bold text-slate-950 mt-4">
              2.1 Conceptual Definition of Discourse Markers
            </h3>
            <p className="text-justify indent-8">
              {hl(
                'Discourse markers are sequentially dependent elements which bracket units of talk and convey procedural rather than conceptual meaning.',
                1,
                'red'
              )}{' '}
              Fraser (1999) classifies discourse markers into contrastive, elaborative, inferential, and temporal categories, asserting that their core role is to establish a pragmatic relationship between the host utterance and prior discourse context.
            </p>
            <p className="text-justify indent-8">
              Unlike content words, discourse markers do not alter the propositional truth value of a clause. For example, omitting the marker <em>well</em> in an answer does not change the factual content of the response, yet it eliminates vital metacommunicative cues signaling conversational hesitancy or prospective disagreement.
            </p>

            <h3 className="text-[14px] font-bold text-slate-950 mt-6">
              2.2 Pragmatic Frameworks: Schiffrin and Fraser
            </h3>
            <p className="text-justify indent-8">
              Schiffrin&apos;s (1987) seminal coherence model posits that discourse markers index utterances to both the speaker and the listener across simultaneous communicative planes. In this model, markers like <em>you know</em> invite addressee alignment, while <em>I mean</em> acts as an internal repair token signaling self-correction.
            </p>
            <p className="text-justify indent-8">
              {hl(
                'In contrast, Blakemore (2002) adopts a relevance-theoretic approach, proposing that discourse markers constrain the inferential phase of comprehension by minimizing cognitive processing effort for the interlocutor.',
                4,
                'red'
              )}
            </p>

            <div className="text-center text-[12px] font-serif text-slate-800 pt-8">
              5
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PAGE 6: PRAGMATIC FUNCTIONS IN INTERACTION                */}
        {/* ========================================================= */}
        {pageIndex === 5 && (
          <div className="space-y-4 font-['Times_New_Roman',serif]">
            <h3 className="text-[14px] font-bold text-slate-950">
              2.3 Functional Taxonomy in Spoken Interaction
            </h3>
            <p className="text-justify indent-8">
              In conversational analysis, discourse markers serve three primary overarching functions: textual, interpersonal, and cognitive.
            </p>
            <p className="text-justify indent-8">
              {hl(
                'Textual functions encompass topic management, turn-taking coordination, and sequential organization of complex arguments in ongoing discourse.',
                2,
                'blue_underlined'
              )}{' '}
              Markers such as <em>anyway</em> or <em>so</em> signal closure of subordinate tangents and re-orient the conversational focus back to the core thematic agenda.
            </p>
            <p className="text-justify indent-8">
              Interpersonal functions regulate social distance, solidarity, and face management. By utilizing epistemic hedging markers like <em>I mean</em> and <em>you know</em>, speakers soften assertive declarations, thereby mitigating potential conflict and encouraging collaborative meaning negotiation.
            </p>

            <h3 className="text-[14px] font-bold text-slate-950 mt-6">
              2.4 Discourse Markers in L2 Learner Corpora
            </h3>
            <p className="text-justify indent-8">
              Corpus-based studies (e.g., Aijmer 2002, Müller 2005) reveal notable discrepancies between native and non-native deployment of discourse markers. L2 speakers often exhibit overreliance on a narrow inventory of familiar markers while underutilizing subtle interactive hedges, often resulting from prescriptive classroom instruction that overlooks pragmatic discourse routines.
            </p>

            <div className="text-center text-[12px] font-serif text-slate-800 pt-10">
              6
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PAGE 7: CHAPTER 3 - METHODOLOGY & TABLE 1 (No Highlights) */}
        {/* ========================================================= */}
        {pageIndex === 6 && (
          <div className="space-y-4 font-['Times_New_Roman',serif]">
            <h2 className="text-[16px] font-bold text-center text-slate-950 uppercase tracking-wide">
              Chapter 3: Research Methodology
            </h2>

            <h3 className="text-[14px] font-bold text-slate-950 mt-4">
              3.1 Research Design & Approach
            </h3>
            <p className="text-justify indent-8">
              This study employs a mixed-methods descriptive and corpus-linguistic design to investigate both quantitative frequencies and qualitative pragmatic functions of English discourse markers in student interaction.
            </p>

            <h3 className="text-[14px] font-bold text-slate-950 mt-4">
              3.2 Corpus Sampling & Distribution
            </h3>
            <p className="text-justify indent-8">
              The dataset comprises 25 audio-recorded group discussions and seminar presentations conducted among undergraduate students enrolled in the Department of English at Abdul Wali Khan University Mardan.
            </p>

            {/* Table 1: Clean Academic Table (Zero Plagiarism/AI Highlights as per exclusions) */}
            <div className="my-6">
              <div className="text-[12.5px] font-bold text-slate-950 mb-2">
                Table 1: Distribution of Corpus Samples Across Academic Interaction Modules
              </div>
              <div className="border border-slate-700 overflow-hidden">
                <table className="w-full text-[12px] text-left border-collapse">
                  <thead className="bg-slate-100 font-bold border-b border-slate-700">
                    <tr>
                      <th className="p-2 border-r border-slate-700">Interaction Module</th>
                      <th className="p-2 border-r border-slate-700 text-center">No. of Sessions</th>
                      <th className="p-2 border-r border-slate-700 text-center">Participants</th>
                      <th className="p-2 border-r border-slate-700 text-center">Total Duration</th>
                      <th className="p-2 text-center">Word Count</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-400">
                    <tr>
                      <td className="p-2 border-r border-slate-700 font-medium">Academic Seminar Presentations</td>
                      <td className="p-2 border-r border-slate-700 text-center">10</td>
                      <td className="p-2 border-r border-slate-700 text-center">20</td>
                      <td className="p-2 border-r border-slate-700 text-center">180 mins</td>
                      <td className="p-2 text-center">12,450</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-slate-700 font-medium">Peer Group Discussions</td>
                      <td className="p-2 border-r border-slate-700 text-center">10</td>
                      <td className="p-2 border-r border-slate-700 text-center">30</td>
                      <td className="p-2 border-r border-slate-700 text-center">150 mins</td>
                      <td className="p-2 text-center">10,820</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-slate-700 font-medium">Classroom Debates</td>
                      <td className="p-2 border-r border-slate-700 text-center">5</td>
                      <td className="p-2 border-r border-slate-700 text-center">15</td>
                      <td className="p-2 border-r border-slate-700 text-center">90 mins</td>
                      <td className="p-2 text-center">6,530</td>
                    </tr>
                    <tr className="font-bold bg-slate-50 border-t-2 border-slate-700">
                      <td className="p-2 border-r border-slate-700">Total Corpus Aggregate</td>
                      <td className="p-2 border-r border-slate-700 text-center">25</td>
                      <td className="p-2 border-r border-slate-700 text-center">65</td>
                      <td className="p-2 border-r border-slate-700 text-center">420 mins</td>
                      <td className="p-2 text-center">29,800</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="text-center text-[12px] font-serif text-slate-800 pt-4">
              7
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PAGE 8: DATA CODING & RELIABILITY                         */}
        {/* ========================================================= */}
        {pageIndex === 7 && (
          <div className="space-y-4 font-['Times_New_Roman',serif]">
            <h3 className="text-[14px] font-bold text-slate-950">
              3.3 Data Coding & Analytical Procedures
            </h3>
            <p className="text-justify indent-8">
              Recorded verbal interactions were transcribed verbatim following standard conversation analytic transcription protocols (Jefferson 2004). Target discourse markers were extracted, tagged, and coded in accordance with Fraser&apos;s functional taxonomy.
            </p>
            <p className="text-justify indent-8">
              {hl(
                'To establish inter-rater coding reliability, two independent applied linguistics researchers coded a 20% random subsample of the transcripts.',
                1,
                'red'
              )}{' '}
              Cohen&apos;s Kappa coefficient achieved a value of &kappa; = 0.88, demonstrating high statistical consistency across coding judgments.
            </p>

            <h3 className="text-[14px] font-bold text-slate-950 mt-6">
              3.4 Ethical Considerations
            </h3>
            <p className="text-justify indent-8">
              Informed written consent was obtained from all participants prior to recording sessions. Anonymity was preserved by assigning alphanumeric pseudonyms to all speakers, and participants were assured that data would be used exclusively for scholastic analysis.
            </p>

            <div className="text-center text-[12px] font-serif text-slate-800 pt-16">
              8
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PAGE 9: CHAPTER 4 - DATA ANALYSIS & TABLE 2 (No Hl Table) */}
        {/* ========================================================= */}
        {pageIndex === 8 && (
          <div className="space-y-4 font-['Times_New_Roman',serif]">
            <h2 className="text-[16px] font-bold text-center text-slate-950 uppercase tracking-wide">
              Chapter 4: Data Analysis and Findings
            </h2>

            <h3 className="text-[14px] font-bold text-slate-950 mt-4">
              4.1 Quantitative Frequency of Selected Discourse Markers
            </h3>
            <p className="text-justify indent-8">
              Corpus query analysis revealed a total of 1,142 discourse marker tokens across the 29,800-word dataset, corresponding to an overall normalized density of 38.3 tokens per 1,000 words.
            </p>

            {/* Table 2: Clean Academic Table (No Highlights) */}
            <div className="my-6">
              <div className="text-[12.5px] font-bold text-slate-950 mb-2">
                Table 2: Frequency and Percentage Distribution of Discourse Markers in Spoken Corpus
              </div>
              <div className="border border-slate-700 overflow-hidden">
                <table className="w-full text-[12px] text-left border-collapse">
                  <thead className="bg-slate-100 font-bold border-b border-slate-700">
                    <tr>
                      <th className="p-2 border-r border-slate-700">Discourse Marker</th>
                      <th className="p-2 border-r border-slate-700 text-center">Raw Frequency (f)</th>
                      <th className="p-2 border-r border-slate-700 text-center">Percentage (%)</th>
                      <th className="p-2 border-r border-slate-700 text-center">Normalized (per 1k)</th>
                      <th className="p-2 text-left">Primary Functional Domain</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-400">
                    <tr>
                      <td className="p-2 border-r border-slate-700 font-semibold">Well</td>
                      <td className="p-2 border-r border-slate-700 text-center">348</td>
                      <td className="p-2 border-r border-slate-700 text-center">30.5%</td>
                      <td className="p-2 border-r border-slate-700 text-center">11.7</td>
                      <td className="p-2">Turn-initiation & Hesitation marker</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-slate-700 font-semibold">You know</td>
                      <td className="p-2 border-r border-slate-700 text-center">284</td>
                      <td className="p-2 border-r border-slate-700 text-center">24.9%</td>
                      <td className="p-2 border-r border-slate-700 text-center">9.5</td>
                      <td className="p-2">Interpersonal alignment & Common ground</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-slate-700 font-semibold">I mean</td>
                      <td className="p-2 border-r border-slate-700 text-center">212</td>
                      <td className="p-2 border-r border-slate-700 text-center">18.6%</td>
                      <td className="p-2 border-r border-slate-700 text-center">7.1</td>
                      <td className="p-2">Self-repair & Message reformulation</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-slate-700 font-semibold">Actually</td>
                      <td className="p-2 border-r border-slate-700 text-center">165</td>
                      <td className="p-2 border-r border-slate-700 text-center">14.4%</td>
                      <td className="p-2 border-r border-slate-700 text-center">5.5</td>
                      <td className="p-2">Contrastive assertion & Factuality</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-slate-700 font-semibold">So / Anyway</td>
                      <td className="p-2 border-r border-slate-700 text-center">133</td>
                      <td className="p-2 border-r border-slate-700 text-center">11.6%</td>
                      <td className="p-2 border-r border-slate-700 text-center">4.5</td>
                      <td className="p-2">Sequential progression & Topic transition</td>
                    </tr>
                    <tr className="font-bold bg-slate-50 border-t-2 border-slate-700">
                      <td className="p-2 border-r border-slate-700">Total Tokens</td>
                      <td className="p-2 border-r border-slate-700 text-center">1,142</td>
                      <td className="p-2 border-r border-slate-700 text-center">100.0%</td>
                      <td className="p-2 border-r border-slate-700 text-center">38.3</td>
                      <td className="p-2">Academic Spoken Discourse</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="text-center text-[12px] font-serif text-slate-800 pt-4">
              9
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PAGE 10: QUALITATIVE PRAGMATIC ANALYSIS                   */}
        {/* ========================================================= */}
        {pageIndex === 9 && (
          <div className="space-y-4 font-['Times_New_Roman',serif]">
            <h3 className="text-[14px] font-bold text-slate-950">
              4.2 Qualitative Analysis of Pragmatic Functions
            </h3>
            <p className="text-justify indent-8">
              Qualitative micro-analysis revealed that <em>well</em> predominantly served as an epistemic delay device, allowing speakers to structure responses during cognitively demanding peer interactions.
            </p>
            <p className="text-justify indent-8">
              {hl(
                'Furthermore, the marker "you know" operated as a vital pragmatic hedge, invoking shared communal understanding and reducing the risk of face loss during contentious academic debates.',
                1,
                'red'
              )}
            </p>
            <p className="text-justify indent-8">
              Speakers utilized <em>I mean</em> to perform real-time communicative repairs when encountering lexical retrieval difficulties, indicating that L2 speakers actively rely on discourse markers to negotiate intelligibility in collaborative academic settings.
            </p>

            <div className="text-center text-[12px] font-serif text-slate-800 pt-16">
              10
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PAGE 11: CHAPTER 5 - CONCLUSION & IMPLICATIONS           */}
        {/* ========================================================= */}
        {pageIndex === 10 && (
          <div className="space-y-4 font-['Times_New_Roman',serif]">
            <h2 className="text-[16px] font-bold text-center text-slate-950 uppercase tracking-wide">
              Chapter 5: Conclusion and Recommendations
            </h2>

            <h3 className="text-[14px] font-bold text-slate-950 mt-4">
              5.1 Summary of Findings
            </h3>
            <p className="text-justify indent-8">
              This study investigated the pragmatic distribution and functions of English discourse markers among ESL learners at Abdul Wali Khan University Mardan. Findings demonstrate that discourse markers are critical instruments for managing conversational floor, repairing misunderstandings, and fostering interpersonal alignment.
            </p>

            <h3 className="text-[14px] font-bold text-slate-950 mt-6">
              5.2 Pedagogical Recommendations
            </h3>
            <p className="text-justify indent-8">
              Language educators should shift from treating discourse markers as superfluous hesitation fillers toward explicit pedagogical instruction on their pragmatic utility in academic spoken discourse.
            </p>

            <div className="text-center text-[12px] font-serif text-slate-800 pt-20">
              11
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PAGE 12: REFERENCES (Clean - Zero Highlights)             */}
        {/* ========================================================= */}
        {pageIndex === 11 && (
          <div className="space-y-3 font-['Times_New_Roman',serif]">
            <h2 className="text-[16px] font-bold text-center text-slate-950 uppercase tracking-wide mb-4">
              References
            </h2>

            {/* APA 7th Bibliographic Entries - Perfectly Unhighlighted */}
            <div className="space-y-3 text-[12px] leading-[1.55] text-slate-900">
              <p className="pl-8 -indent-8 text-justify">
                Aijmer, K. (2002). <em>English Discourse Particles: Evidence from a Corpus</em>. John Benjamins Publishing Company.
              </p>
              <p className="pl-8 -indent-8 text-justify">
                Blakemore, D. (2002). <em>Relevance and Linguistic Meaning: The Semantics and Pragmatics of Discourse Markers</em>. Cambridge University Press.
              </p>
              <p className="pl-8 -indent-8 text-justify">
                Fraser, B. (1999). What are discourse markers? <em>Journal of Pragmatics</em>, 31(7), 931–952.
              </p>
              <p className="pl-8 -indent-8 text-justify">
                Halliday, M. A. K., & Hasan, R. (1976). <em>Cohesion in English</em>. Longman.
              </p>
              <p className="pl-8 -indent-8 text-justify">
                Hyland, K. (2005). <em>Metadiscourse: Exploring Interaction in Writing</em>. Continuum.
              </p>
              <p className="pl-8 -indent-8 text-justify">
                Jefferson, G. (2004). Glossary of transcript symbols with an introduction. In G. H. Lerner (Ed.), <em>Conversation Analysis: Studies from the First Generation</em> (pp. 13–31). John Benjamins.
              </p>
              <p className="pl-8 -indent-8 text-justify">
                Müller, S. (2005). <em>Discourse Markers in Native and Non-native English Discourse</em>. John Benjamins Publishing Company.
              </p>
              <p className="pl-8 -indent-8 text-justify">
                Schiffrin, D. (1987). <em>Discourse Markers</em>. Cambridge University Press.
              </p>
              <p className="pl-8 -indent-8 text-justify">
                Swales, J. M. (1990). <em>Genre Analysis: English in Academic and Research Settings</em>. Cambridge University Press.
              </p>
            </div>

            <div className="text-center text-[12px] font-serif text-slate-800 pt-16">
              12
            </div>
          </div>
        )}
      </div>

      {/* Turnitin Official Footer on every page */}
      <TurnitinPageFooter
        pageNumber={pageNumber}
        totalPages={totalPages}
        sectionTitle={sectionTitle}
        submissionId={submissionId}
      />
    </div>
  );
};
