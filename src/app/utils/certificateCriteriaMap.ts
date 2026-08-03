// Frontend cert->criteria mapping + document-classification helpers.
// The criteria themselves come from the backend (GET /api/v1/compliances-criteria) — this file only
// maps accepted certificates to the criteria they certify, and defines the document-classification types.
// Certificate mapping = the currently-validated DOME table. Extend once partners validate additions
// (see "Compliance Dome/PROPOSED_cert_criteria_mapping.md").

export type Domain = 'DP' | 'CS' | 'PT' | 'ST';
export type FileType = 'certificate' | 'self-attestation';

export interface FileClassification {
  profileId: number;
  fileName: string;
  type: FileType | null;
  certName: string | null;
  coveredDomains: Domain[];
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
