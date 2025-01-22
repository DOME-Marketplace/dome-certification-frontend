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
    sessionStorage.setItem('OAuthToken', token);
  }

  getToken() {
    return sessionStorage.getItem('token');
  }

  getOAuthToken() {
    return sessionStorage.getItem('OAuthToken');
  }

  clearToken() {
    sessionStorage.removeItem('token');
  }
  clearOAuthToken() {
    sessionStorage.removeItem('OAuthToken');
  }
}
