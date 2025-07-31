export interface CompliancesValidatedRes {
  id: number;
  productOfferingId: number;
  complianceCriteria: ComplianceCriteria;
  complianceProfile: ComplianceProfile;
  issuer: Issuer;
  createdAt: Date;
}

export interface ComplianceCriteria {
  id: number;
  labelLevel: string;
  rulesVersion: string;
  category: string;
  code: string;
  criteria: string;
  link: string;
}

export interface ComplianceProfile {
  id: number;
  fileName: string;
  url: string;
  hash: string;
}

export interface Issuer {
  id: string;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  organization_country_code: string;
  organization_name: string;
  organization_id: string;
  organization_email: string;
  last_seen: Date;
}
