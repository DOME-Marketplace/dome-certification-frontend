import { UserRole } from './user.role.model';

export interface User {
  id: string;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  location: string;
  organization_name: string;
  position: string;
  role: UserRole;
  last_seen: string;
}
