import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '@env/environment';
import { LoginRta } from '@models/auth.model';
import { TokenService } from '@services/token.service';
import { Router } from '@angular/router';
import { User } from '@models/user.model';
import { SessionStorageService } from '@services/sessionStorate.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private sessionStorageService = inject(SessionStorageService);
  private router = inject(Router);

  private authState = new BehaviorSubject<User | null>(null);
  authState$ = this.authState.asObservable();

  login(username: string, password: string) {
    const url = `${environment.API_URL}/auth/login`;
    return this.http.post<LoginRta>(url, { username, password }).pipe(
      tap((response) => {
        this.tokenService.saveToken(response.acces_token);
        this.authState.next(response.user);
        this.sessionStorageService.setSessionStorageItem('user', response.user);
      })
    );
  }

  register(user: any): Observable<any> {
    const url = `${environment.API_URL}/auth/register`;
    return this.http.post<any>(url, user).pipe(
      tap((response) => {
        this.tokenService.saveToken(response.acces_token);
        this.authState.next(response.user);
        this.sessionStorageService.setSessionStorageItem('user', response.user);
      })
    );
  }

  setAuthState(user: User | null) {
    this.authState.next(user);
  }

  exchangeToken(token: string): Observable<any> {
    const url = `${environment.API_URL}/auth/exchange-token`;
    return this.http.post<any>(url, token).pipe(
      tap((response) => {
        this.tokenService.saveToken(response.acces_token);
        this.authState.next(response.user);
        this.sessionStorageService.setSessionStorageItem('user', response.user);
      })
    );
  }

  getClientSecret(): Observable<any> {
    const url = `${environment.API_URL}/auth/client-assertion-token`;
    return this.http.get<any>(url, { responseType: 'text' as 'json' });
  }

  isAuthenticated(): boolean {
    return !!this.tokenService.getToken();
  }

  getUserFromSessionStorage(): User | null {
    return this.sessionStorageService.getSessionStorageItem('user');
  }

  hasRole(role: string): boolean {
    return this.getUserFromSessionStorage()!.role === role;
  }
  logout() {
    this.tokenService.clearToken();
    this.setAuthState(null);
    this.sessionStorageService.removeSessionStorageItem('user');
    this.router.navigate(['/auth/login']);
  }
}
