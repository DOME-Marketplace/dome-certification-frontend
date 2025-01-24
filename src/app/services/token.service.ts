import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor() {}

  saveToken(token: string) {
    sessionStorage.setItem('token', token);
  }
  saveOAuthToken(token: string) {
    sessionStorage.setItem('oauth_token', token);
  }

  saveOAuthRefreshToken(token: string) {
    sessionStorage.setItem('oauth_refresh_token', token);
  }
  saveClientAssertion(value: string) {
    sessionStorage.setItem('client_assertion', value);
  }

  getToken() {
    return sessionStorage.getItem('token');
  }

  getOAuthToken() {
    return sessionStorage.getItem('oauth_token');
  }
  getOAuthRefreshToken() {
    return sessionStorage.getItem('oauth_refresh_token');
  }
  getClientAssertion() {
    return sessionStorage.getItem('client_assertion');
  }

  clearToken() {
    sessionStorage.removeItem('token');
  }
  clearOAuthToken() {
    sessionStorage.removeItem('oauth_token');
  }

  clearOAuthRefreshToken() {
    sessionStorage.removeItem('oauth_refresh_token');
  }

  clearClientAssertion() {
    sessionStorage.removeItem('client_assertion');
  }
}
