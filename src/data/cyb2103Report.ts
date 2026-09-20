import { ScanReport, MatchedSource, HighlightedSnippet } from '../types';

export const CYB2103_SOURCES: MatchedSource[] = [
  {
    id: 'src-cyb-1',
    name: 'Computer security',
    url: 'https://en.wikipedia.org/wiki/Computer_security',
    similarity: 15,
    type: 'internet',
  },
  {
    id: 'src-cyb-2',
    name: 'WannaCry ransomware attack',
    url: 'https://en.wikipedia.org/wiki/WannaCry_ransomware_attack',
    similarity: 0.5,
    type: 'internet',
  },
];

export const CYB2103_REPORT: ScanReport = {
  id: 'rep-cyb2103-cyber-risk',
  title: 'CYB2103_Assessment_3_Cyber_Risk_Management_report.docx',
  fileName: 'CYB2103_Assessment_3_Cyber_Risk_Management_report.docx',
  fileSize: '75.41 KB',
  author: 'A B',
  institution: 'Tecnológico Nacional de Mexico',
  type: 'Both',
  status: 'Completed',
  plagiarismScore: 15, // 15% Overall Similarity matching official sample
  aiScore: 41,        // 41% detected as AI matching official sample
  wordCount: 1132,
  characterCount: 8565,
  pageCount: 3,       // 3 Pages in Document Details box, 4 submission pages
  date: 'Sep 17, 2026, 10:28 PM GMT+5',
  submissionDate: 'Sep 17, 2026, 10:28 PM GMT+5',
  downloadDate: 'Sep 17, 2026, 10:29 PM GMT+5',
  timestamp: 1789664880000,
  excludeBibliography: true,
  excludeQuotes: false,
  submissionId: 'trn:oid:::1:8989900768',
  matchGroups: {
    notCitedOrQuoted: 2,
    notCitedOrQuotedScore: 10,
    missingQuotations: 0,
    missingCitation: 0,
    citedAndQuoted: 0,
  },
  sourceDistribution: {
    internet: 15,
    publications: 0,
    studentPapers: 0,
  },
  integrityFlagsCount: 0,
  sources: CYB2103_SOURCES,
  contentSample:
    'CYB2103 | CYBER RISK MANAGEMENT CASE STUDY - Assessment 3 – Cyber Risk Management Case Study Report. Medibank 2022 Cybercrime Event: Risk Assessment and Cost-Effective Treatment.',
  snippets: [
    {
      text: 'Management takeaway: the case shows that funding of credential security needs to be paired with funding of access boundaries and access detection capabilities; a control that bars entry does not provide access detection capability, thereby leaving the highest value data exposed.',
      type: 'plagiarized',
      sourceIndex: 1,
      similarityPercentage: 15,
    },
    {
      text: 'The key is in their databases and the trust they have in members to have them share sensitive information. The risk chain is: Asset, threat, vulnerability, event, consequence. The importance of stolen credentials is that they can be used to become an attack path via social engineering (Krombholz et al., 2015).',
      type: 'normal',
    },
    {
      text: 'The human controls are not a blame approach, it is important because user knowledge and awareness of policy and self-efficacy are crucial in resisting or reporting to phishing (Arachchilage & Love, 2014; Bulgurcu et al., 2010).',
      type: 'plagiarized',
      sourceIndex: 1,
      similarityPercentage: 15,
    },
  ],
};

export const isCyb2103Document = (nameOrTitle?: string): boolean => {
  if (!nameOrTitle) return false;
  const n = nameOrTitle.toLowerCase();
  return (
    n.includes('cyb2103') ||
    n.includes('cyber_risk') ||
    n.includes('cyber risk') ||
    n.includes('risk_management') ||
    n.includes('risk management')
  );
};
