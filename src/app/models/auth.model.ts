import { User } from './user.model';

export interface LoginRta {
  acces_token: string;
  user: User;
}

export interface ResM2MToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}
