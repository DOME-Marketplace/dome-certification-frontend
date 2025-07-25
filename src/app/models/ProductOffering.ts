import { ComplianceProfile, Compliances } from '@models/compliances';

export interface PO {
  id?: number;
  service_name: string;
  service_version: string;
  request_date: string;
  issue_date?: string;
  expiration_date?: string;
  issuer?: string;
  id_PO: string;
  status: Status;
  image: string;
  name_organization: string;
  address_organization: string;
  vat_ID: string | null;
  comments: string | null;
  ISO_Country_Code: string;
  url_organization: string;
  email_organization: string;
  requestedComplianceLevel: { value: string };
  files?: File[];
}

interface Status {
  in_progress: string;
  rejected: string;
  validated: string;
  expired: string;
}

interface File {
  name: string;
  size: number;
  type: string;
  data: Blob;
}

export interface ResPO {
  id: number;
  id_PO: string;
  service_name: string;
  service_version: string;
  name_organization: string;
  address_organization: string;
  ISO_Country_Code: string;
  url_organization: string;
  email_organization: string;
  vat_ID: string | null;
  comments: string | null;
  issuer: Issuer;
  image: string | null;
  status: string;
  request_date: Date;
  issue_date: null;
  expiration_date: null;
  complianceProfiles: ComplianceProfile[];
  iso_Country_Code: string;
  compliances: Compliances[];
  requestedComplianceLevel: { value: string };
}

export interface Issuer {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  organization_country_code: string;
  organization_id: string;
  organization_name: string;
  last_seen: Date;
  role: null;
}
