import { inject, Injectable, OnInit } from '@angular/core';
import { authCodeFlowConfig } from 'src/app/oauth.config';
import { OAuthService as OAuth } from 'angular-oauth2-oidc';
import { environment } from '@env/environment';
import { AuthService } from './auth.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomOAuthService {
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private oauthService = inject(OAuth);

  constructor() {
    this.configureOAuth();
  }
  private async configureOAuth() {
    try {
      const clientSecret = await firstValueFrom(
        this.authService.getClientSecret()
      );

      if (clientSecret) {
        const config = {
          ...authCodeFlowConfig,
          customQueryParams: { client_assertion: clientSecret },
        };
        this.oauthService.configure(config);
        console.log(config);

        const loggedIn =
          await this.oauthService.loadDiscoveryDocumentAndTryLogin();
        if (!loggedIn) {
          console.log('No code and state found. ');
          return;
        }

        this.exchangeToken();
      }
    } catch (error) {
      console.error('Error during discovery or login:', error);
    }
  }

  // Método para iniciar el flujo de autenticación
  login() {
    this.oauthService.initCodeFlow();
  }

  // Método para cerrar sesión
  logout() {
    this.oauthService.logOut();
  }

  getUser() {
    const claims = this.oauthService.getIdentityClaims();
    if (!claims) return null;

    return claims;
  }

  exchangeToken() {
    if (!this.oauthService.hasValidAccessToken()) return;
    const token = this.oauthService.getIdToken();

    if (!token) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No ID token available for exchange.',
      });
      return;
    }

    this.authService.exchangeToken(token).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Login successful',
        });
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Token exchange failed:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: 'Unable to exchange token. Please try again.',
        });
      },
    });
  }
  // Obtener el estado de autenticación (si está autenticado)
  isAuthenticated(): boolean {
    return this.oauthService.hasValidAccessToken();
  }
}
