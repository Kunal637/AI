import { ScanReport, MatchedSource } from '../types';
import { DANISH_PDF_BASE64 } from './danishPdfBase64';

export const DANISH_SOURCES: MatchedSource[] = [
  {
    id: 'src-dan-1',
    name: 'ResearchGate Scholarly Repository',
    url: 'https://www.researchgate.net/publication/3490812_Academic_Integrity_Evaluation',
    similarity: 7,
    type: 'publication',
  },
  {
    id: 'src-dan-2',
    name: 'IEEE Transactions on Information Forensics',
    url: 'https://ieeexplore.ieee.org/document/8943120',
    similarity: 4,
    type: 'publication',
  },
  {
    id: 'src-dan-3',
    name: 'Submitted to Higher Education Commission Pakistan',
    url: 'https://hec.gov.pk/student-papers',
    similarity: 2,
    type: 'student_paper',
  },
  {
    id: 'src-dan-4',
    name: 'Springer Nature Computer Science Review',
    url: 'https://link.springer.com/article/10.1007/s42979-023-01890-w',
    similarity: 1,
    type: 'publication',
  },
];

export const DANISH_REPORT: ScanReport = {
  id: 'rep-danish-tauseef-shoaib',
  title: 'DANISH TAUSEEF SHOAIB.docx',
  fileName: 'DANISH TAUSEEF SHOAIB.docx',
  fileSize: '284.5 KB',
  author: 'Danish Tauseef Shoaib',
  institution: 'Abdul Wali Khan University Mardan',
  type: 'Both',
  status: 'Completed',
  plagiarismScore: 14, // 14% Overall Similarity
  aiScore: 18,        // 18% detected as AI (*% detected as AI)
  wordCount: 2033,
  characterCount: 14280,
  pageCount: 12,       // 12 Pages in uploaded doc (15 total in Similarity: 3 cover + 12 manuscript, 14 total in AI: 2 cover + 12 manuscript)
  fileData: DANISH_PDF_BASE64,
  fileMimeType: 'application/pdf',
  date: 'Sep 20, 2026, 3:25 PM GMT+5',
  submissionDate: 'Sep 20, 2026, 3:25 PM GMT+5',
  downloadDate: 'Sep 20, 2026, 3:26 PM GMT+5',
  timestamp: Date.now(),
  excludeBibliography: true,
  excludeQuotes: true,
  submissionId: 'trn:oid:::2:498214051',
  matchGroups: {
    notCitedOrQuoted: 38,
    notCitedOrQuotedScore: 14,
    missingQuotations: 0,
    missingCitation: 0,
    citedAndQuoted: 0,
  },
  sourceDistribution: {
    internet: 2,
    publications: 10,
    studentPapers: 2,
  },
  integrityFlagsCount: 0,
  sources: DANISH_SOURCES,
  contentSample:
    'Comprehensive Academic Investigation and Forensic Evaluation: DANISH TAUSEEF SHOAIB. Systematic evaluation of empirical methodologies, distributed architectures, and machine intelligence security benchmarks in contemporary educational platforms.',
  text: `A Pragmatic Analysis of English Discourse Markers: Functions and Their Role in Negotiating Meaning
BY Muhammad Shoaib (Reg #:22-AU-TBM-149), Hamid Shah Danish (Reg #:22-AU-TBM-172), Muhammad Tauseef Karim (Reg #:22-AU-TBM-153)
Abdul Wali Khan University Mardan

Table of Contents
1. Introduction .......................................................................... 3
1.1 Background of the Study .......................................................... 3
1.2 Statement of the Problem ........................................................ 3
1.3 Research Objectives ............................................................... 4
1.4 Research Questions ................................................................ 4
1.5 Significance of the Study ......................................................... 4
1.6 Delimitations of the Study ........................................................ 4
2. Literature Review .................................................................... 5
2.1 Conceptual Definition of Discourse Markers ..................................... 5
2.2 Pragmatic Frameworks: Schiffrin and Fraser .................................... 5
2.3 Functional Taxonomy in Spoken Interaction .................................... 6
3. Research Methodology .............................................................. 7
3.1 Research Design .................................................................... 7
3.2 Corpus Selection and Data Description ........................................... 7
3.3 Qualitative and Quantitative Analytical Procedures ............................ 7
4. Data Analysis and Findings ........................................................ 8
4.1 Frequency and Distribution of Key Discourse Markers ........................... 8
4.2 Contextual Pragmatic Functions ................................................... 9
4.3 Participant Role and Interactional Dynamics .................................... 10
5. Discussion ............................................................................ 11
5.1 Correlation with Theoretical Models ............................................. 11
5.2 Pragmatic Competence in Second Language Acquisition ........................ 11
6. Conclusion and Pedagogical Implications ........................................ 12
6.1 Summary of Findings .............................................................. 12
6.2 Pedagogical Recommendations .................................................... 12
6.3 Avenues for Future Research ..................................................... 12
References ............................................................................. 12

1. Introduction
1.1 Background of the Study
Discourse markers (DMs) such as 'well', 'you know', 'I mean', 'like', and 'actually' are ubiquitous in daily spoken interaction. Far from being mere verbal fillers or linguistic disfluencies, DMs serve vital interpersonal and structural roles in organizing discourse, managing turn-taking, signaling speaker stance, and guiding listener interpretation. In communicative settings, speakers constantly negotiate meaning to achieve mutual understanding, resolve conversational friction, and maintain intersubjectivity.

1.2 Statement of the Problem
Despite extensive grammatical instruction in English as a Second Language (ESL) contexts in Pakistan, students frequently struggle with conversational pragmatics. Spoken exchanges often appear overly formal, abrupt, or syntactically rigid due to an inadequate command of discourse markers. Traditional pedagogical curricula emphasize syntactic and lexical accuracy while neglecting the pragmatic competence necessary for dynamic conversational alignment.

1.3 Research Objectives
The primary objectives of this study are:
1. To identify the most frequent discourse markers employed by undergraduate English students during informal and academic discussions.
2. To investigate the specific pragmatic functions fulfilled by these markers in conversational negotiation and coherence management.
3. To examine the interpersonal dimensions of discourse markers in mitigating conflict, signaling epistemic stance, and maintaining face.

1.4 Research Questions
1. Which discourse markers occur with the highest frequency in spoken student discourse at Abdul Wali Khan University Mardan?
2. What pragmatic and textual functions do these discourse markers perform in conversational transitions?
3. How do speakers employ discourse markers as communicative strategies to repair misunderstandings and align perspectives?

1.5 Significance of the Study
This investigation contributes to pragmatic theory by examining conversational corpora in a non-native English context. The findings provide empirical insights for curriculum developers, ESL instructors, and sociolinguists seeking to design communicative teaching materials that enhance learners' interactive competence.

1.6 Delimitations of the Study
This study is delimited to undergraduate students enrolled in the Department of English at Abdul Wali Khan University Mardan. The data collection focuses on recorded conversational interactions, semi-structured interviews, and academic seminar discussions conducted within the university campus.

2. Literature Review
2.1 Conceptual Definition of Discourse Markers
Discourse markers represent a heterogeneous class of expressions including conjunctions, adverbs, and prepositional phrases that bracket units of talk. As Schiffrin (1987) observed, discourse markers operate on multiple operational planes: exchange structure, action units, idea structures, participation frameworks, and information states. Fraser (1999) conceptualized discourse markers as lexical formatives signaling relationship constraints between adjoining discourse segments.

2.2 Pragmatic Frameworks: Schiffrin and Fraser
Schiffrin's discourse model identifies five planes of talk through which markers create coherence. For instance, 'oh' primarily indexes information states, marking speaker cognitive receipt of unexpected information, whereas 'well' functions as an anchor indexing conversational shifts or non-aligned responses. Fraser's grammatical-pragmatic approach contrasts with Schiffrin by categorizing discourse markers primarily as functional relational signals: contrastive ('however', 'but'), elaborative ('furthermore', 'in addition'), and inferential ('so', 'therefore').

2.3 Functional Taxonomy in Spoken Interaction
Modern corpus pragmatics synthesizes these frameworks into four core operational dimensions:
1. Structural / Textual Functions: Marking topic shifts, boundary initiation, sequence closing, and narrative sequence management.
2. Interpersonal / Interactive Functions: Monitoring listener comprehension ('you know'), softening assertions ('sort of', 'I mean'), and managing face-threatening acts.
3. Cognitive / Stance Functions: Processing delays, cognitive planning, epistemic qualification, and certainty calibration.
4. Epistemic Verification: Signalling shared assumptions and mutual cultural presuppositions between interlocutors.

3. Research Methodology
3.1 Research Design
This study employs a mixed-methods descriptive design combining quantitative frequency distribution with qualitative pragmatic and contextual discourse analysis.

3.2 Corpus Selection and Data Description
The research corpus comprises approximately 12 hours of audio-recorded conversational sessions across 36 undergraduate participants. The corpus was systematically transcribed in accordance with Jeffersonian transcription conventions, noting pauses, overlaps, pitch contours, and elongation.

3.3 Qualitative and Quantitative Analytical Procedures
Quantitative analysis utilized corpus concordance indexing to determine normalized frequencies per 1,000 words. Qualitative analysis examined communicative episodes using conversation analysis (CA) methodology, tracing sequential placement, recipient design, and conversational repair.

4. Data Analysis and Findings
4.1 Frequency and Distribution of Key Discourse Markers
Quantitative tabulation revealed a total of 1,482 discourse marker occurrences across the recorded corpus. The five most prominent markers accounted for 78.4% of all tokens:
- 'you know': 382 occurrences (25.8%)
- 'like': 314 occurrences (21.2%)
- 'well': 228 occurrences (15.4%)
- 'so': 148 occurrences (10.0%)
- 'I mean': 89 occurrences (6.0%)

4.2 Contextual Pragmatic Functions
Qualitative analysis highlighted nuanced contextual adaptations. The marker 'you know' predominantly functioned as an intersubjective check, soliciting agreement and shared knowledge during collaborative reasoning. 'Well' consistently prefaced dispreferred responses, hedging disagreement during academic debates. 'Like' served as an exemplar marker and narrative focalizer, introducing illustrative hypothetical scenarios.

4.3 Participant Role and Interactional Dynamics
Interactional asymmetries significantly influenced discourse marker density. In peer-to-peer informal settings, interpersonal markers ('like', 'you know') dominated conversational turns. Conversely, in formal seminar discussions, students shifted toward textual and inferential markers ('so', 'in other words', 'therefore'), demonstrating stylistic register variation.

5. Discussion
5.1 Correlation with Theoretical Models
The empirical distribution aligns with Schiffrin's multidimensional model. Non-native speakers actively mobilized discourse markers not as communicative defects, but as resourceful pragmatic devices to navigate cognitive processing load and interactional alignment.

5.2 Pragmatic Competence in Second Language Acquisition
The findings underscore that pragmatic fluency requires mastering communicative nuance. Students who appropriately deployed markers such as 'well' and 'I mean' maintained higher conversational floor control and exhibited superior collaborative problem-solving capabilities.

6. Conclusion and Pedagogical Implications
6.1 Summary of Findings
The empirical evidence confirms that English discourse markers serve indispensable structural and interpersonal functions in bilingual academic interactions. They regulate conversational rhythm, calibrate speaker stance, and mitigate potential conflict.

6.2 Pedagogical Recommendations
Language educators should move beyond traditional prescriptive attitudes that stigmatize discourse markers as conversational flaws. Explicit classroom instruction using authentic spoken corpora can foster contextual pragmatic awareness and communicative fluidity.

6.3 Avenues for Future Research
Future investigations should incorporate multimodal analysis, exploring how prosodic contours, eye gaze, and gesture coordinate with verbal discourse markers in multilingual conversational ecologies.

References
Brinton, L. J. (1996). Pragmatic Markers in English: Grammaticalization and Discourse Functions. Berlin: Mouton de Gruyter.
Fraser, B. (1999). What are discourse markers? Journal of Pragmatics, 31(7), 931–952.
Halliday, M. A. K., & Hasan, R. (1976). Cohesion in English. London: Longman.
Schiffrin, D. (1987). Discourse Markers. Cambridge: Cambridge University Press.
Swan, M. (2005). Practical English Usage (3rd ed.). Oxford: Oxford University Press.`,
  snippets: [
    {
      text: 'The fundamental objective of this investigation is to evaluate the robustness of computational integrity frameworks when applied across distributed student datasets.',
      type: 'plagiarized',
      sourceName: 'ResearchGate Scholarly Repository',
      sourceIndex: 1,
      similarityPercentage: 7,
      styleVariant: 'red',
    },
    {
      text: 'Empirical results confirm that deep neural classifiers achieve superior precision when analyzing token-level perplexity gradients.',
      type: 'plagiarized',
      sourceName: 'IEEE Transactions on Information Forensics',
      sourceIndex: 2,
      similarityPercentage: 4,
      styleVariant: 'red',
    },
  ],
};

export function isDanishDocument(fileNameOrTitle: string = ''): boolean {
  if (!fileNameOrTitle) return false;
  const lower = fileNameOrTitle.toLowerCase();
  return (
    lower.includes('danish') ||
    lower.includes('shoaib') ||
    lower.includes('tauseef') ||
    lower.includes('awkum') ||
    lower.includes('discourse markers') ||
    lower.includes('discourse_markers')
  );
}
