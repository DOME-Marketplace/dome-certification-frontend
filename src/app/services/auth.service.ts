import { inject, Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from '@env/environment';
import { LoginRta } from '@models/auth.model';
import { TokenService } from '@services/token.service';
import { LocalStorageService } from './localStorage.service';
import { Router } from '@angular/router';
import { User } from '@models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private localStorageService = inject(LocalStorageService);
  private router = inject(Router);

  private authState = new BehaviorSubject<User | null>(null);
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

  register(user: any): Observable<any> {
    const url = `${environment.API_URL}/auth/register`;
    return this.http.post<any>(url, user).pipe(
      tap((response) => {
        this.tokenService.saveToken(response.acces_token);
        this.authState.next(response.user);
        this.localStorageService.setLocalStorageItem('user', response.user);
      })
    );
  }

  setAuthState(user: User | null) {
    this.authState.next(user);
  }

  isAuthenticated(): boolean {
    return !!this.tokenService.getToken();
  }

  getUserFromLocalStorage(): User | null {
    return this.localStorageService.getLocalStorageItem('user');
  }

  hasRole(role: string): boolean {
    return this.getUserFromLocalStorage()!.role === role;
  }
  logout() {
    this.tokenService.clearToken();
    this.setAuthState(null);
    this.localStorageService.removeLocalStorageItem('user');
    this.router.navigate(['/auth/login']);
  }
}
