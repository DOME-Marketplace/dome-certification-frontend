import { UserRole } from './user.role.model';

export interface User {
  id: string;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  organization_name: string;
  organization_email: string;
  organization_country_code: string;
  organization_id: string;
  role: UserRole;
  last_seen: string;
}
