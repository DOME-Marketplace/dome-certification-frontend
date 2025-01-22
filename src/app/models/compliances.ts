export interface CompliancesStandards {
  id: number;
  standard: string;
  description: string;
}

export interface CompliancesToValidate {
  standardId: number;
  standard: string;
  description: string;
  profileId: number;
  hash: string;
}

export interface IssuerCompliance {
  hash: string;
  scope: string;
  standard: string;
}
export interface IssuerPOCompany {
  address: string;
  commonName: string;
  country: string;
  email: string;
  id: string;
  organization: string;
}

export interface IssuerProduct {
  productId: string;
  productNam: string;
  productVersion: string;
}

export interface Compliances {
  id: number;
  complianceProfile: ComplianceProfile;
  complianceStandard: CompliancesStandards;
}
export interface ComplianceProfile {
  id: number;
  fileName: string;
  url: string;
  hash: string;
}
