import { User } from './user.model';

export interface LoginRta {
  acces_token: string;
  user: User;
}
