import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ScanMode, ScanReport } from '../types';
import { extractDocumentDataFromFile, ExtractedDocumentData } from '../utils/documentParser';
import {
  Bot,
  Search,
  ShieldCheck,
  UploadCloud,
  FileText,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  Plus,
  Coins,
  CheckCircle2,
  FileUp,
} from 'lucide-react';

interface DashboardViewProps {
  onOpenReport: (report: ScanReport) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenReport }) => {
  const {
    currentUser,
    reports,
    runScan,
    isScanning,
    setActiveTab,
    setActivePanel,
  } = useApp();

  const [selectedMode, setSelectedMode] = useState<ScanMode>('both');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [excludeBibliography, setExcludeBibliography] = useState(true);
  const [excludeQuotes, setExcludeQuotes] = useState(true);

  // File Upload State
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
    docData?: ExtractedDocumentData;
  } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [pasteMode, setPasteMode] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [inputTitle, setInputTitle] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const modeCosts: Record<ScanMode, number> = {
    ai: 2,
    plagiarism: 3,
    both: 5,
  };

  const currentCost = modeCosts[selectedMode];
  const hasSufficientCredits = currentUser.credits >= currentCost;

  // Handle file selection
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);

    try {
      const docData = await extractDocumentDataFromFile(file);
      setUploadedFile({
        name: file.name,
        size: `${sizeInMB} MB`,
        docData,
      });
    } catch (err) {
      console.error('File parsing error:', err);
      setUploadedFile({
        name: file.name,
        size: `${sizeInMB} MB`,
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Trigger analysis
  const handleAnalyze = async () => {
    let fileName = uploadedFile ? uploadedFile.name : (inputTitle.trim() || 'Untitled_Document.docx');
    let content = uploadedFile?.docData?.text || pastedText;

    if (!uploadedFile && !pastedText) {
      // Auto-sample if nothing entered for rapid testing
      fileName = 'Sample_Academic_Manuscript_2026.docx';
      content = 'The rapid proliferation of large language models poses unique attribution challenges in scientific literature. Our empirical benchmarks demonstrate that syntactic perplexity shifts provide decisive signals during originality audits.';
    }

    await runScan({
      fileName,
      mode: selectedMode,
      authorFirst: firstName,
      authorLast: lastName,
      excludeBibliography,
      excludeQuotes,
      fileContent: content,
      fileData: uploadedFile?.docData?.fileData,
      fileMimeType: uploadedFile?.docData?.fileMimeType,
      htmlContent: uploadedFile?.docData?.htmlContent,
      htmlPages: uploadedFile?.docData?.htmlPages,
      pageCount: uploadedFile?.docData?.pageCount,
    });

    // Reset file form
    setUploadedFile(null);
    setPastedText('');
  };

  return (
    <div className="space-y-6 pb-12" id="dashboard-view">
      {/* 3 Top Mode Cards matching screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="mode-selector-grid">
        {/* Card 1: AI Detection */}
        <div
          id="mode-card-ai"
          onClick={() => setSelectedMode('ai')}
          className={`relative rounded-2xl p-5 cursor-pointer transition-all border text-center flex flex-col items-center justify-center gap-2 ${
            selectedMode === 'ai'
              ? 'border-indigo-600 bg-indigo-50/30 ring-2 ring-indigo-500/20 shadow-sm'
              : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/50'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-2xl mb-1">
            🤖
          </div>
          <h3 className="font-bold text-sm text-slate-800">AI Detection</h3>
          <span className="text-xs text-slate-500 font-medium">Uses 2 Credits</span>
        </div>

        {/* Card 2: Plagiarism Check */}
        <div
          id="mode-card-plagiarism"
          onClick={() => setSelectedMode('plagiarism')}
          className={`relative rounded-2xl p-5 cursor-pointer transition-all border text-center flex flex-col items-center justify-center gap-2 ${
            selectedMode === 'plagiarism'
              ? 'border-indigo-600 bg-indigo-50/30 ring-2 ring-indigo-500/20 shadow-sm'
              : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/50'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-2xl mb-1">
            🔍
          </div>
          <h3 className="font-bold text-sm text-slate-800">Plagiarism Check</h3>
          <span className="text-xs text-slate-500 font-medium">Uses 3 Credits</span>
        </div>

        {/* Card 3: Both */}
        <div
          id="mode-card-both"
          onClick={() => setSelectedMode('both')}
          className={`relative rounded-2xl p-5 cursor-pointer transition-all border text-center flex flex-col items-center justify-center gap-2 ${
            selectedMode === 'both'
              ? 'border-indigo-600 bg-indigo-50/30 ring-2 ring-indigo-500/20 shadow-sm'
              : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/50'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-2xl mb-1">
            🛡️
          </div>
          <h3 className="font-bold text-sm text-slate-800">Both</h3>
          <span className="text-xs text-slate-500 font-medium">Uses 5 Credits</span>
        </div>
      </div>

      {/* Main Upload / Configuration Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-5" id="upload-panel-card">
        {/* Author Name Section */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-2">
            Author Name (Optional)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="First Name"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              id="input-author-firstname"
            />
            <input
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder="Last Name"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              id="input-author-lastname"
            />
          </div>
        </div>

        {/* Optional Checkboxes (Visible for Plagiarism or Both) */}
        {selectedMode !== 'ai' && (
          <div className="flex flex-wrap items-center gap-6 pt-1 text-xs text-slate-700">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={excludeBibliography}
                onChange={e => setExcludeBibliography(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                id="check-exclude-bib"
              />
              <span className="font-medium">Exclude Bibliography</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={excludeQuotes}
                onChange={e => setExcludeQuotes(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                id="check-exclude-quotes"
              />
              <span className="font-medium">Exclude Quotes</span>
            </label>
          </div>
        )}

        {/* Mode switcher tabs (Drop file vs Paste text) */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPasteMode(false)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                !pasteMode ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Upload Document
            </button>
            <button
              onClick={() => setPasteMode(true)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                pasteMode ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Paste Text
            </button>
          </div>

          {/* Credits requirement badge */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500">Cost:</span>
            <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
              {currentCost} Credits
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-500">Balance:</span>
            <span
              className={`font-bold ${
                hasSufficientCredits ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {currentUser.credits} Credits
            </span>
          </div>
        </div>

        {/* Dropzone Container */}
        {!pasteMode ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[190px] ${
              dragActive
                ? 'border-indigo-500 bg-indigo-50/40'
                : 'border-slate-200/90 bg-slate-50/30 hover:border-indigo-400 hover:bg-slate-50'
            }`}
            id="file-dropzone"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={e => handleFiles(e.target.files)}
            />

            {uploadedFile ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl">
                  📄
                </div>
                <div className="font-bold text-sm text-slate-900">
                  {uploadedFile.name}
                </div>
                <div className="text-xs text-slate-500">
                  {uploadedFile.size} • Click or drag to replace
                </div>
              </div>
            ) : (
              <>
                <div className="w-14 h-14 rounded-2xl bg-amber-50/80 flex items-center justify-center text-3xl mb-2">
                  📁
                </div>
                <p className="text-sm font-bold text-slate-800 mb-1">
                  Drop your file here
                </p>
                <p className="text-xs text-slate-500 mb-4">
                  or click to browse 📁
                </p>

                {/* Accepted types pills matching screenshot */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-lg shadow-2xs">
                    📄 PDF
                  </span>
                  <span className="text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-lg shadow-2xs">
                    📝 DOCX
                  </span>
                  <span className="text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-lg shadow-2xs">
                    📃 TXT
                  </span>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              value={inputTitle}
              onChange={e => setInputTitle(e.target.value)}
              placeholder="Document Title (e.g., Literature_Review.docx)"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <textarea
              value={pastedText}
              onChange={e => setPastedText(e.target.value)}
              rows={6}
              placeholder="Paste article, essay, or dissertation text here to scan..."
              className="w-full bg-white border border-slate-200 rounded-xl p-4 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        )}

        {/* Warning banner: matches user screenshot */}
        {!hasSufficientCredits && (
          <div
            className="bg-red-50/80 border border-red-200/90 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-red-800"
            id="credits-limit-warning"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base shrink-0">⚠️</span>
              <div>
                <span className="font-semibold">
                  You've reached your daily upload limit or have insufficient credits ({currentUser.credits}/{currentCost}).
                </span>
                <span className="block sm:inline text-red-600 text-[11px] sm:ml-1">
                  Redeem a code below or ask Admin to allocate credits.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setActiveTab('redeem')}
                className="bg-white hover:bg-red-100 text-red-700 font-bold px-3 py-1.5 rounded-lg border border-red-200 shadow-2xs transition"
              >
                Redeem Code 🎫
              </button>
              <button
                onClick={() => setActivePanel('admin')}
                className="bg-red-700 hover:bg-red-800 text-white font-bold px-3 py-1.5 rounded-lg shadow-2xs transition"
              >
                + Give Credits in Admin
              </button>
            </div>
          </div>
        )}

        {/* Bottom Actions: Analyze Button */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-400">
            {uploadedFile ? `Selected: ${uploadedFile.name}` : 'Click Analyze to generate full Turnitin-grade report'}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!hasSufficientCredits || isScanning}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md ${
              hasSufficientCredits && !isScanning
                ? 'bg-gradient-to-r from-[#4f46e5] to-[#6366f1] hover:from-[#4338ca] hover:to-[#4f46e5] text-white shadow-indigo-500/25 cursor-pointer active:scale-98'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
            id="btn-analyze"
          >
            <span>Analyze</span>
            <span>📊</span>
          </button>
        </div>
      </div>

      {/* Recent Reports Table matching screenshot */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm" id="recent-reports-section">
        {/* Table Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">📁</span>
            <h2 className="text-sm font-bold text-slate-900">Recent Reports</h2>
          </div>
          <button
            onClick={() => setActiveTab('reports')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
            id="link-view-all-reports"
          >
            View all →
          </button>
        </div>

        {/* Content: Empty state or Table */}
        {reports.length === 0 ? (
          <div className="py-16 px-4 text-center flex flex-col items-center justify-center gap-3">
            <div className="text-4xl mb-1">📬</div>
            <p className="text-xs text-slate-500 font-medium">
              No reports yet. Upload a document above to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs" id="recent-reports-table">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-5">Title</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Plagiarism</th>
                  <th className="py-3 px-4">AI Score</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-5 text-right">View Report</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {reports.slice(0, 5).map(rep => (
                  <tr key={rep.id} className="hover:bg-slate-50/60 transition group">
                    <td className="py-3.5 px-5 font-semibold text-slate-900 max-w-xs truncate">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span className="truncate">{rep.title}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 font-medium text-[11px]">
                        {rep.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {rep.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`font-bold text-xs ${
                          rep.plagiarismScore > 20
                            ? 'text-rose-600'
                            : rep.plagiarismScore > 10
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {rep.type === 'AI Detection' ? '—' : `${rep.plagiarismScore}%`}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`font-bold text-xs ${
                          rep.aiScore > 50
                            ? 'text-rose-600'
                            : rep.aiScore > 20
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {rep.type === 'Plagiarism Check' ? '—' : `${rep.aiScore}%`}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                      {rep.date}
                    </td>
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <button
                        onClick={() => onOpenReport(rep)}
                        className="text-indigo-600 hover:text-indigo-800 font-bold text-xs hover:underline inline-flex items-center gap-1"
                      >
                        View
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
