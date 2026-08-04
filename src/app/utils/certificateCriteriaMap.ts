// Frontend cert->criteria mapping + document-classification helpers.
// The criteria themselves come from the backend (GET /api/v1/compliances-criteria) — this file only
// maps accepted certificates to the criteria they certify, and defines the document-classification types.
// Certificate mapping = the currently-validated DOME table. Extend once partners validate additions
// (see "Compliance Dome/PROPOSED_cert_criteria_mapping.md").

export type Domain = 'DP' | 'CS' | 'PT' | 'ST';
// 'discarded' = a document the certifier explicitly sets aside (e.g. an invalid certificate in a
// bundle). It contributes nothing to coverage but must NOT block validation — the label can still
// be issued from the remaining valid documents.
export type FileType = 'certificate' | 'self-attestation' | 'discarded';

export interface FileClassification {
  profileId: number;
  fileName: string;
  type: FileType | null;
  certName: string | null;
  coveredDomains: Domain[];
}

// A single document is "decided" when the certifier has classified it enough to act on:
//   certificate      -> a certificate is selected
//   self-attestation -> at least one domain is checked
//   discarded        -> explicitly set aside (always complete; excluded from coverage)
//   null             -> still undecided
export function isFileClassificationComplete(fc: FileClassification): boolean {
  if (fc.type === 'certificate') return !!fc.certName;
  if (fc.type === 'self-attestation') return fc.coveredDomains.length > 0;
  if (fc.type === 'discarded') return true;
  return false;
}

// Every uploaded document must be decided before the request can advance to / be confirmed on
// Validate. Discarded files count as decided; an empty document set is never complete.
export function allFilesClassified(list: FileClassification[]): boolean {
  if (list.length === 0) return false;
  return list.every(isFileClassificationComplete);
}

// Backend criterion `category` -> short domain code.
export const CATEGORY_TO_DOMAIN: Record<string, Domain> = {
  'DATA PROTECTION & MANAGEMENT': 'DP',
  CYBERSECURITY: 'CS',
  PORTABILITY: 'PT',
  SUSTAINABILITY: 'ST',
};

export const DOMAIN_LABELS: Record<Domain, string> = {
  DP: 'Data Protection & Management',
  CS: 'Cybersecurity',
  PT: 'Portability',
  ST: 'Sustainability',
};

export const ALL_DOMAINS: Domain[] = ['DP', 'CS', 'PT', 'ST'];

// Certificates the certifier can select when classifying a document as a certificate.
export const ACCEPTED_CERTIFICATES: string[] = [
  'EU Cloud CoC',
  'BSI C5',
  'CSA CCM',
  'SecNumCloud',
  'CISPE',
  'TISAX',
  'ISO/IEC 27001',
  'SWIPO IaaS',
  'CNDCP',
];

// certificate -> criterion NUMBERS it certifies, per domain (established DOME table).
export const CERTIFICATE_CRITERIA_MAP: Record<string, Partial<Record<Domain, number[]>>> = {
  'EU Cloud CoC':  { DP: [1, 2, 3, 4], CS: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20] },
  'BSI C5':        { DP: [3, 4],       CS: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20] },
  'CSA CCM':       { DP: [3, 4],       CS: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19] },
  SecNumCloud:     { DP: [1, 2, 3, 4], CS: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17], PT: [1] },
  CISPE:           { DP: [1, 2, 3, 4], CS: [1,2,3,4,5,6,8,10,15,18,19,20] },
  TISAX:           { DP: [3],          CS: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,17] },
  'ISO/IEC 27001': { DP: [3],          CS: [1,2,3,4,5,6,7,8,9,10,12,13,14,15,16,17] },
  'SWIPO IaaS':    { CS: [11],         PT: [1, 2] },
  CNDCP:           { ST: [1, 2, 3, 4] },
};

// Does the named certificate certify a given criterion (domain + number)?
export function certCovers(certName: string | null, domain: Domain | undefined, num: number): boolean {
  if (!certName || !domain) return false;
  const map = CERTIFICATE_CRITERIA_MAP[certName];
  return !!map && (map[domain] ?? []).includes(num);
}

// Parse "CS-20" -> 20 (the criterion number).
export function criterionNumber(code: string): number {
  const n = parseInt((code || '').split('-')[1], 10);
  return Number.isNaN(n) ? -1 : n;
}
