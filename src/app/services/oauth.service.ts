import { environment } from '@env/environment';
import { inject, Injectable } from '@angular/core';
import { authCodeFlowConfig, loginOptions } from 'src/app/oauth.config';
import { OAuthService as OAuth } from 'angular-oauth2-oidc';
import { AuthService } from '@services/auth.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { TokenService } from '@services/token.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CustomOAuthService {
  private httpClient = inject(HttpClient);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private oauthService = inject(OAuth);
  private tokenService = inject(TokenService);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  constructor() {
    this.configureOAuth();
  }
  private async configureOAuth() {
    try {
      const clientSecret = await firstValueFrom(
        this.authService.getClientSecret()
      );

      if (clientSecret) {
        this.tokenService.saveClientAssertion(clientSecret);
        const config = {
          ...authCodeFlowConfig,
          customQueryParams: {
            client_assertion: clientSecret,
            client_assertion_type:
              'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
            request_uri: environment.REQUEST_URI,
          },
        };
        this.oauthService.configure(config);

        await this.oauthService.loadDiscoveryDocument();

        await this.oauthService.tryLoginCodeFlow(loginOptions);
        const accessToken = this.oauthService.getAccessToken();

        if (!accessToken) {
          return;
        }
        this.tokenService.saveOAuthToken(accessToken);
        this.exchangeToken(accessToken);
      }
    } catch (error) {
      console.error('Error during discovery or login:', error);
      const idtoken = this.oauthService.getAccessToken();
      console.log(idtoken);
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
  refreshToken() {
    const clientSecret = this.tokenService.getClientAssertion();
    const url = `${environment.VERIFIER_URL}/oidc/token`;
    if (clientSecret) {
      this.httpClient
        .post<any>(url, {
          clientId: environment.CLIENT_ID,
          grant_type: 'refresh_token',
          client_assertion: clientSecret,
          client_assertion_type:
            'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
          refresh_token: this.tokenService.getOAuthRefreshToken(),
          scope: 'openid learcredential',
        })
        .subscribe({
          next: (response) => {
            this.tokenService.saveOAuthToken(response.access_token);
            this.tokenService.saveOAuthRefreshToken(response.refresh_token);
          },
          error: (error) => {
            console.error('Error retrieving refresh token:', error);
          },
        });
    }
  }

  exchangeToken(token: string) {
    if (!token) {
      return;
    }
    this.setLoading(true);

    this.authService.exchangeToken(token).subscribe({
      complete: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Login successful',
        });
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Token exchange failed:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: 'Unable to exchange token. Please try again.',
        });
      },

      next: (response) => {
        this.oauthService.logOut(true);
        this.setLoading(false);
      },
    });
  }
  // Obtener el estado de autenticación (si está autenticado)
  isAuthenticated(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  private setLoading(isLoading: boolean): void {
    this.loadingSubject.next(isLoading);
  }
}
