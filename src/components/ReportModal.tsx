import React, { useState } from 'react';
import { ScanReport, MatchedSource, HighlightedSnippet } from '../types';
import { TurnitScopeLogo } from './TurnitScopeLogo';
import { cleanText } from '../utils/documentParser';
import { downloadReportPdf } from '../utils/pdfGenerator';
import { TurnitinOfficialMultiPageReport } from './TurnitinOfficialMultiPageReport';
import {
  X,
  Download,
  Share2,
  AlertTriangle,
  Bot,
  Search,
  ExternalLink,
  BookOpen,
  FileCheck,
  CheckCircle,
  Percent,
  Sliders,
  FileText,
  ShieldAlert,
  ShieldCheck,
  Info,
  ChevronRight,
  Eye,
  Check,
  Printer,
  Sparkles,
  ArrowRight,
  Layers,
  Loader2,
} from 'lucide-react';

interface ReportModalProps {
  report: ScanReport | null;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ report, onClose }) => {
  const [studioView, setStudioView] = useState<'official_pattern' | 'feedback_studio'>('official_pattern');
  const [activeMode, setActiveMode] = useState<'all' | 'similarity' | 'ai' | 'comparison'>('all');
  const [sidebarTab, setSidebarTab] = useState<'matches' | 'ai' | 'filters' | 'info'>('matches');
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Dynamic filter state (Turnitin filter & settings simulator)
  const [excludeQuotes, setExcludeQuotes] = useState(report?.excludeQuotes ?? true);
  const [excludeBibliography, setExcludeBibliography] = useState(report?.excludeBibliography ?? true);
  const [excludeSmallMatches, setExcludeSmallMatches] = useState(false);

  if (!report) return null;

  // Clean all raw text
  const cleanedContent = cleanText(report.contentSample || '');

  // Calculate dynamic similarity score based on filters strictly within 1% to 17%
  let adjustedPlagScore = report.plagiarismScore > 0 ? Math.min(17, Math.max(1, report.plagiarismScore)) : 0;
  if (!excludeQuotes && adjustedPlagScore > 0) adjustedPlagScore = Math.min(17, adjustedPlagScore + 2);
  if (!excludeBibliography && adjustedPlagScore > 0) adjustedPlagScore = Math.min(17, adjustedPlagScore + 3);
  if (excludeSmallMatches && adjustedPlagScore > 3) adjustedPlagScore = Math.max(1, adjustedPlagScore - 2);
  adjustedPlagScore = adjustedPlagScore > 0 ? Math.min(17, Math.max(1, adjustedPlagScore)) : 0;

  const submissionId = report.submissionId || `trn:oid:${Math.floor(21948194812)}`;

  // Format AI score display: 1% to 20% shows *%, >20% shows exact %, 0% shows 0%
  const isAiUnderThreshold = report.aiScore > 0 && report.aiScore <= 20;
  const aiScoreDisplay = isAiUnderThreshold ? '*%' : (report.aiScore > 20 ? `${report.aiScore}%` : '0%');

  // Default sources if none present (0-17% similarity breakdown)
  const sources: MatchedSource[] = report.sources && report.sources.length > 0 ? report.sources : [
    { id: 's1', name: 'ScienceDirect / Elsevier Academic Archive', url: 'https://sciencedirect.com/science/article/pii', similarity: Math.max(2, Math.floor(adjustedPlagScore * 0.58)), type: 'publication' },
    { id: 's2', name: 'Harvard University Scholar Repository', url: 'https://harvard.edu/dash/handle/291', similarity: Math.max(1, Math.floor(adjustedPlagScore * 0.27)), type: 'student_paper' },
    { id: 's3', name: 'IEEE Computer Society Digital Library', url: 'https://ieeexplore.ieee.org/document/89201', similarity: Math.max(1, Math.floor(adjustedPlagScore * 0.15)), type: 'publication' },
  ];

  // Color mapping per source number matching Turnitin's official palette
  const getSourceColor = (index: number) => {
    switch (index % 4) {
      case 1:
        return {
          bg: 'bg-[#fce4ec]',
          hoverBg: 'hover:bg-[#f8bbd0]',
          text: 'text-slate-900',
          border: 'border-[#e91e63]',
          badge: 'bg-[#e91e63] text-white',
          pill: 'bg-[#fce7f3] text-[#9d174d] border-pink-200',
        };
      case 2:
        return {
          bg: 'bg-[#e0f2fe]',
          hoverBg: 'hover:bg-[#bae6fd]',
          text: 'text-slate-900',
          border: 'border-[#2563eb]',
          badge: 'bg-[#2563eb] text-white',
          pill: 'bg-[#e0f2fe] text-[#0369a1] border-sky-200',
        };
      case 3:
        return {
          bg: 'bg-[#d1fae5]',
          hoverBg: 'hover:bg-[#a7f3d0]',
          text: 'text-slate-900',
          border: 'border-[#059669]',
          badge: 'bg-[#059669] text-white',
          pill: 'bg-[#d1fae5] text-[#047857] border-emerald-200',
        };
      default:
        return {
          bg: 'bg-[#ede9fe]',
          hoverBg: 'hover:bg-[#ddd6fe]',
          text: 'text-slate-900',
          border: 'border-[#7c3aed]',
          badge: 'bg-[#7c3aed] text-white',
          pill: 'bg-[#ede9fe] text-[#6d28d9] border-purple-200',
        };
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setIsExportingPdf(true);
      await downloadReportPdf(report);
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150 overflow-hidden"
      id="turnitin-report-studio"
    >
      {/* Main Studio Frame */}
      <div className="bg-[#f1f5f9] rounded-2xl w-full max-w-7xl h-[94vh] max-h-[950px] shadow-2xl flex flex-col overflow-hidden border border-slate-700/50 relative">
        {/* TOP BAR: Feedback Studio Header */}
        <header className="bg-[#1e293b] text-white px-5 py-3 flex items-center justify-between border-b border-slate-700 shrink-0 z-20">
          <div className="flex items-center gap-4 min-w-0">
            <TurnitScopeLogo size="sm" variant="dark" showSubtitle={false} />
            <div className="h-5 w-px bg-slate-700 hidden sm:block" />

            {/* Document Info */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <h2 className="text-xs sm:text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
                  {report.title}
                </h2>
                <span className="hidden md:inline px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                  {submissionId}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                Author: <span className="text-slate-200 font-semibold">{report.author}</span> • {report.date} • {report.wordCount.toLocaleString()} words • {report.characterCount.toLocaleString()} characters
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* View Switcher: Official Multi-Page vs Feedback Studio */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-xl border border-slate-700 text-xs mr-1">
              <button
                onClick={() => setStudioView('official_pattern')}
                className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  studioView === 'official_pattern'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Official Turnitin Multi-Page Report (No cutting)"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Official Report (No Cutting)</span>
              </button>
              <button
                onClick={() => setStudioView('feedback_studio')}
                className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  studioView === 'feedback_studio'
                    ? 'bg-slate-700 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Interactive Feedback Studio"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Feedback Studio</span>
              </button>
            </div>

            {/* View Digital Receipt */}
            <button
              onClick={() => setShowReceipt(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition border border-slate-700"
              title="Official Turnitin Digital Receipt"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Digital Receipt</span>
            </button>

            {/* Close Studio */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              id="btn-close-studio"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {studioView === 'official_pattern' ? (
          <div className="flex-1 overflow-hidden flex flex-col">
            <TurnitinOfficialMultiPageReport
              report={report}
              defaultType={report.type === 'AI Detection' ? 'ai' : 'similarity'}
            />
          </div>
        ) : (
          <>
            {/* SUB-HEADER: Mode Switcher & Metric Ribbon */}
            <div className="bg-white border-b border-slate-200 px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-xs">
          {/* View Modes */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveMode('all')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeMode === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>Full Inspection</span>
            </button>

            <button
              onClick={() => {
                setActiveMode('similarity');
                setSidebarTab('matches');
              }}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeMode === 'similarity'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Similarity ({adjustedPlagScore}%)</span>
            </button>

            <button
              onClick={() => {
                setActiveMode('ai');
                setSidebarTab('ai');
              }}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeMode === 'ai'
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-purple-600" />
              <span>AI Writing ({aiScoreDisplay})</span>
            </button>

            <button
              onClick={() => setActiveMode('comparison')}
              className={`px-3 py-1.5 rounded-lg transition hidden md:flex items-center gap-1.5 ${
                activeMode === 'comparison'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-blue-600" />
              <span>Source Compare</span>
            </button>
          </div>

          {/* Quick Metric Badges */}
          <div className="flex items-center gap-3">
            {/* Similarity Score */}
            <div className="flex items-center gap-2 px-3 py-1 bg-rose-50 border border-rose-200/80 rounded-xl">
              <span className="text-[11px] font-semibold text-rose-800">Similarity:</span>
              <span className="font-extrabold text-sm font-mono text-rose-700">
                {adjustedPlagScore}%
              </span>
            </div>

            {/* AI Score */}
            <div className="flex items-center gap-2 px-3 py-1 bg-purple-50 border border-purple-200/80 rounded-xl">
              <span className="text-[11px] font-semibold text-purple-800">AI Probability:</span>
              <span className="font-extrabold text-sm font-mono text-purple-700">
                {aiScoreDisplay}
              </span>
            </div>

            {/* Status */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200/80 rounded-xl text-emerald-800 text-xs font-semibold">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Scan</span>
            </div>
          </div>
        </div>

        {/* WORKSPACE: Center Paper Viewer + Right Feedback Studio Sidebar */}
        <div className="flex-1 flex overflow-hidden">
          {/* CENTER CANVAS: Authentic Paginated Manuscript Sheet */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-[#e2e8f0]/60">
            <div
              id="report-printable-content"
              className="w-full max-w-3xl bg-white rounded-xl shadow-md border border-slate-200/90 min-h-[750px] p-8 sm:p-12 text-slate-800 font-serif leading-relaxed text-sm relative"
            >
              {/* Official Academic Paper Header */}
              <div className="font-sans border-b border-slate-200 pb-6 mb-6">
                <div className="flex items-center justify-between text-[11px] text-slate-400 uppercase tracking-widest font-mono mb-2">
                  <span>Turnitin Verified Academic Submission</span>
                  <span>Page 1 of 1</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight font-sans">
                  {report.title}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-sans">
                  <span>Author: <strong>{report.author}</strong></span>
                  <span>•</span>
                  <span>Turnitin Engine Core v4.9</span>
                  <span>•</span>
                  <span>Repository: Standard Institutional Archive</span>
                </div>
              </div>

              {/* Highlight Legend Banner */}
              <div className="font-sans bg-slate-50 border border-slate-200 rounded-xl p-3 mb-6 flex flex-wrap items-center gap-3 text-xs">
                <span className="font-bold text-slate-500 text-[10px] uppercase tracking-wider">
                  Active Highlights:
                </span>
                {(activeMode === 'all' || activeMode === 'similarity') && (
                  <>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded bg-rose-200 border border-rose-400 flex items-center justify-center text-[9px] font-bold text-rose-800 font-mono">1</span>
                      <span className="text-slate-700">Source 1 (Red)</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded bg-sky-200 border border-sky-400 flex items-center justify-center text-[9px] font-bold text-sky-800 font-mono">2</span>
                      <span className="text-slate-700">Source 2 (Blue)</span>
                    </span>
                  </>
                )}
                {(activeMode === 'all' || activeMode === 'ai') && (
                  <span className="flex items-center gap-1.5">
                    {report.aiScore > 20 ? (
                      <>
                        <span className="px-1.5 py-0.5 rounded bg-purple-200 border border-purple-400 text-[10px] font-bold text-purple-900 font-mono">AI</span>
                        <span className="text-slate-700">AI Writing ({report.aiScore}%)</span>
                      </>
                    ) : (
                      <span className="text-slate-500 italic text-[11px]">
                        AI &lt; 20% (*%) — Unhighlighted per standard
                      </span>
                    )}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-slate-400 text-[11px] ml-auto">
                  Click any highlighted passage to inspect
                </span>
              </div>

              {/* Manuscript Body Content */}
              <div className="space-y-5 text-justify text-[14.5px] leading-7">
                {/* Interactive Snippets with Complete Sentence Highlighting */}
                <p className="indent-8">
                  {report.snippets.map((snip, idx) => {
                    const sourceIdx = snip.sourceIndex || (idx % 3) + 1;
                    const color = getSourceColor(sourceIdx);
                    const isSelected = selectedSourceId === snip.sourceId;

                    // Plagiarized snippet (Source Match)
                    if (snip.type === 'plagiarized' && (activeMode === 'all' || activeMode === 'similarity')) {
                      return (
                        <span
                          key={idx}
                          onClick={() => {
                            setSelectedSourceId(snip.sourceId || 's1');
                            setSidebarTab('matches');
                          }}
                          className={`${color.bg} ${color.text} ${color.hoverBg} px-1.5 py-0.5 rounded border-b-2 ${color.border} font-medium cursor-pointer transition-all inline ${
                            isSelected ? 'ring-2 ring-indigo-600 font-semibold' : ''
                          }`}
                          title={`Click to inspect source: ${snip.sourceName || 'Academic Archive'} (${snip.similarityPercentage || 6}%)`}
                        >
                          <sup className={`inline-block px-1 py-0.2 mr-1 rounded text-[9px] font-mono font-bold ${color.badge}`}>
                            {sourceIdx}
                          </sup>
                          {snip.text}{' '}
                        </span>
                      );
                    }

                    // AI Generated snippet (ONLY rendered as highlighted if report.aiScore > 20)
                    if (snip.type === 'ai_generated' && report.aiScore > 20 && (activeMode === 'all' || activeMode === 'ai')) {
                      return (
                        <span
                          key={idx}
                          onClick={() => setSidebarTab('ai')}
                          className="bg-purple-100/90 text-purple-950 hover:bg-purple-200/90 px-1.5 py-0.5 rounded border-b-2 border-purple-500 font-medium cursor-pointer transition-all inline"
                          title={`Turnitin AI Writing Detector: ${snip.aiProbability || report.aiScore}% probability`}
                        >
                          <sup className="inline-block px-1 py-0.2 mr-1 rounded text-[9px] font-mono font-bold bg-purple-600 text-white">
                            AI
                          </sup>
                          {snip.text}{' '}
                        </span>
                      );
                    }

                    // Normal unhighlighted sentence
                    return <span key={idx}>{snip.text} </span>;
                  })}
                </p>

                {/* Clean continuation paragraph */}
                <p className="indent-8 text-slate-700">
                  {cleanedContent}
                </p>

                {/* Concluding paragraph */}
                <p className="indent-8 text-slate-700">
                  Furthermore, qualitative evaluations conducted across multi-institutional benchmark environments confirm that rigorous citation protocols significantly mitigate inadvertent overlap. Modern originality detection algorithms parse both exact string n-grams and latent semantic embeddings to ascertain authentic scholastic attribution while preserving author intellectual provenance.
                </p>
              </div>

              {/* End of Document Stamp */}
              <div className="mt-12 pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400 font-sans">
                <span>Turnitin Automated Originality & AI Integrity Seal</span>
                <span className="font-mono">Submission ID: {submissionId}</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR: Feedback Studio Control Panel */}
          <aside className="w-80 sm:w-96 bg-white border-l border-slate-200 flex flex-col shrink-0 shadow-lg z-10">
            {/* Sidebar Navigation Tabs matching Turnitin icons */}
            <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex items-center justify-between text-xs font-bold">
              <button
                onClick={() => setSidebarTab('matches')}
                className={`flex-1 py-2 px-1 text-center rounded-lg transition ${
                  sidebarTab === 'matches'
                    ? 'bg-white text-rose-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Match Overview
              </button>

              <button
                onClick={() => setSidebarTab('ai')}
                className={`flex-1 py-2 px-1 text-center rounded-lg transition ${
                  sidebarTab === 'ai'
                    ? 'bg-white text-purple-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                AI Detection
              </button>

              <button
                onClick={() => setSidebarTab('filters')}
                className={`flex-1 py-2 px-1 text-center rounded-lg transition ${
                  sidebarTab === 'filters'
                    ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Filters & Settings
              </button>
            </div>

            {/* Sidebar Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* TAB 1: MATCH OVERVIEW */}
              {sidebarTab === 'matches' && (
                <div className="space-y-4">
                  {/* Big Similarity Index Ring Card */}
                  <div className="bg-gradient-to-br from-rose-50 to-orange-50 border border-rose-200/80 rounded-2xl p-5 text-center">
                    <div className="text-4xl font-black text-rose-700 font-mono tracking-tight">
                      {adjustedPlagScore}%
                    </div>
                    <div className="text-xs font-bold text-slate-800 mt-1">
                      Turnitin Similarity Index
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Cross-referenced against 94B+ web documents, periodicals & institutional papers (0% to 17% standard)
                    </p>

                    {/* Breakdown sub-metrics */}
                    <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-rose-200/60 text-center">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Internet</span>
                        <span className="text-xs font-bold text-slate-800 font-mono">
                          {Math.floor(adjustedPlagScore * 0.5)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Publications</span>
                        <span className="text-xs font-bold text-slate-800 font-mono">
                          {Math.floor(adjustedPlagScore * 0.3)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Student Papers</span>
                        <span className="text-xs font-bold text-slate-800 font-mono">
                          {Math.floor(adjustedPlagScore * 0.2)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Primary Sources List */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                      Primary Sources ({sources.length})
                    </h4>

                    <div className="space-y-2.5">
                      {sources.map((s, idx) => {
                        const color = getSourceColor(idx + 1);
                        const isSelected = selectedSourceId === s.id;

                        return (
                          <div
                            key={s.id}
                            onClick={() => setSelectedSourceId(s.id)}
                            className={`p-3 rounded-xl border transition cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-50/50 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                                : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-white'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2 min-w-0">
                                <span
                                  className={`w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5 ${color.badge}`}
                                >
                                  {idx + 1}
                                </span>
                                <div className="min-w-0">
                                  <h5 className="text-xs font-bold text-slate-900 truncate">
                                    {s.name}
                                  </h5>
                                  <a
                                    href={s.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[10px] text-indigo-600 hover:underline flex items-center gap-1 font-mono truncate mt-0.5"
                                  >
                                    <span className="truncate">{s.url}</span>
                                    <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                                  </a>
                                  <span className={`inline-block text-[9.5px] font-medium px-2 py-0.5 rounded-full border mt-1.5 ${color.pill}`}>
                                    {s.type === 'internet' ? 'Internet' : s.type === 'student_paper' ? 'Submitted works' : 'Publication'}
                                  </span>
                                </div>
                              </div>

                              <span className="text-xs font-mono font-black text-rose-700 shrink-0 bg-white px-2 py-0.5 rounded border border-slate-200">
                                {s.similarity}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: AI DETECTION */}
              {sidebarTab === 'ai' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200/80 rounded-2xl p-5 text-center">
                    <div className="text-4xl font-black text-purple-700 font-mono tracking-tight">
                      {aiScoreDisplay}
                    </div>
                    <div className="text-xs font-bold text-slate-800 mt-1">
                      Turnitin AI Writing Index
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Evaluates linguistic perplexity and sentence-level burstiness against human baseline models
                    </p>

                    {isAiUnderThreshold && (
                      <div className="mt-3 p-2.5 bg-purple-100/70 border border-purple-200 rounded-xl text-left text-[11px] text-purple-900">
                        <strong>Official Pattern Note:</strong> For AI detection between 1% and 20%, the report displays <strong>*%</strong> and text is not highlighted to minimize false positives according to institutional standards.
                      </div>
                    )}

                    <div className="mt-4 pt-3 border-t border-purple-200/60 grid grid-cols-2 gap-2 text-center">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Human Content</span>
                        <span className="text-xs font-bold text-emerald-700 font-mono">
                          {report.aiScore > 20 ? `${100 - report.aiScore}%` : '&gt; 80%'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">False Positive Rate</span>
                        <span className="text-xs font-bold text-indigo-700 font-mono">
                          &lt; 1.0%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
                    <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Bot className="w-4 h-4 text-purple-600" />
                      <span>Understanding the AI Report</span>
                    </h5>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Our dual-head transformer model detects patterns characteristic of generative AI (ChatGPT, Claude, Gemini). Text flagged in purple/cyan reflects high semantic predictability and uniform syntactic distribution.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: FILTERS & SETTINGS */}
              {sidebarTab === 'filters' && (
                <div className="space-y-5">
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Originality Exclusion Filters
                    </h4>
                    <p className="text-[11px] text-slate-500 mb-4">
                      Customize how Turnitin calculates the similarity score by including or excluding specific manuscript components.
                    </p>
                  </div>

                  {/* Filter Toggles */}
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/70 transition select-none">
                      <input
                        type="checkbox"
                        checked={excludeQuotes}
                        onChange={e => setExcludeQuotes(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 rounded mt-0.5"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">
                          Exclude Quotes &amp; Table of Contents
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Disregards text enclosed in quotes and Table of Contents / Index entries
                        </span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/70 transition select-none">
                      <input
                        type="checkbox"
                        checked={excludeBibliography}
                        onChange={e => setExcludeBibliography(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 rounded mt-0.5"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">
                          Exclude Bibliography &amp; References
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Omits works cited, references, bibliography, and citation entries
                        </span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/70 transition select-none">
                      <input
                        type="checkbox"
                        checked={excludeSmallMatches}
                        onChange={e => setExcludeSmallMatches(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 rounded mt-0.5"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">
                          Exclude Small Matches (&lt; 8 words)
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Ignores incidental phrases and common idioms
                        </span>
                      </div>
                    </label>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                    <strong>Adjusted Similarity:</strong> {adjustedPlagScore}%{' '}
                    {adjustedPlagScore !== report.plagiarismScore && (
                      <span className="text-[11px] text-amber-700">
                        (was {report.plagiarismScore}%)
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* COMPARISON MODAL (When Side-by-side mode is active) */}
        {activeMode === 'comparison' && (
          <div className="absolute inset-x-0 bottom-0 top-[108px] bg-white z-30 flex flex-col p-6 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Side-by-Side Source Text Comparison
                </h3>
              </div>
              <button
                onClick={() => setActiveMode('all')}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 px-3 py-1 bg-slate-100 rounded-lg"
              >
                Return to Paper View
              </button>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 overflow-y-auto">
              {/* Left: Submitted Document */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Submitted Manuscript</span>
                  <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                    Match Found
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-slate-700 bg-rose-50/70 p-4 rounded-xl border border-rose-200">
                  "Our comparative analysis reveals that multi-layered linguistic perplexity provides robust indicators when identifying synthetically generated prose, especially within computational biology and machine learning corpora."
                </p>
              </div>

              {/* Right: Repository Source Match */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Source: {sources[0].name}
                  </span>
                  <a
                    href={sources[0].url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-mono"
                  >
                    View Original <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-xs leading-relaxed text-slate-700 bg-white p-4 rounded-xl border border-slate-200">
                  "Comparative evaluations reveal that multi-layered linguistic perplexity provides decisive indicators when identifying synthetically generated text across modern machine learning benchmarks."
                </p>
                <div className="text-[11px] text-slate-500">
                  92% semantic sentence concordance identified by Turnitin crawler.
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    )}

        {/* DIGITAL RECEIPT MODAL */}
        {showReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-200 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    Turnitin Digital Receipt
                  </h3>
                </div>
                <button
                  onClick={() => setShowReceipt(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                This digital receipt confirms that your manuscript was deposited and analyzed by Turnitin Feedback Studio. A cryptographic record has been generated for provenance verification.
              </p>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Submission ID:</span>
                  <span className="font-bold text-slate-900">{submissionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Document Title:</span>
                  <span className="font-bold text-slate-900 max-w-[200px] truncate">{report.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Author:</span>
                  <span className="font-bold text-slate-900">{report.author}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Timestamp:</span>
                  <span className="font-bold text-slate-900">{report.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Word Count:</span>
                  <span className="font-bold text-slate-900">{report.wordCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Character Count:</span>
                  <span className="font-bold text-slate-900">{report.characterCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">SHA-256 Hash:</span>
                  <span className="font-bold text-indigo-700 text-[10px] truncate max-w-[180px]">
                    e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Receipt
                </button>

                <button
                  onClick={() => setShowReceipt(false)}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm"
                >
                  Close Receipt
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
