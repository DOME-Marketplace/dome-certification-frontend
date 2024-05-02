import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from '@env/environment';
import { LoginRta } from '@models/auth.model';
import { TokenService } from '@services/token.service';
import { LocalStorageService } from './localStorage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private localStorageService = inject(LocalStorageService);

  private authState = new BehaviorSubject<string | null>(null);
  authState$ = this.authState.asObservable();

  login(username: string, password: string) {
    const url = `${environment.API_URL}/auth/login`;
    return this.http.post<LoginRta>(url, { username, password }).pipe(
      tap((response) => {
        this.tokenService.saveToken(response.acces_token);
        this.authState.next(response.user);
        this.localStorageService.setLocalStorageItem('user', response.user);
      })
    );
  }

  setAuthState(user: string | null) {
    this.authState.next(user);
  }

  logout() {
    this.tokenService.clearToken();
  }
}
