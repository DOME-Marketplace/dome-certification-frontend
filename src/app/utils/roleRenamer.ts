import { UserRole } from '@models/user.role.model';

export function roleRenamer(role: UserRole) {
  switch (role) {
    case 'EMPLOYEE':
      return 'Certification Entity';
    case 'CUSTOMER':
      return 'Cloud Service Provider';
    case 'ADMIN':
      return 'Admin';
    default:
      return role;
  }
}
