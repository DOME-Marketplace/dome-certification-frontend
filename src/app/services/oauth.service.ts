import { environment } from '@env/environment';
import { inject, Injectable } from '@angular/core';
import { authCodeFlowConfig, loginOptions } from 'src/app/oauth.config';
import { OAuthService as OAuth } from 'angular-oauth2-oidc';
import { AuthService } from './auth.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomOAuthService {
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private oauthService = inject(OAuth);
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

  exchangeToken(token: string) {
    if (!token) {
      return;
    }
    this.setLoading(true);

    this.authService.exchangeToken(token).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Login successful',
        });
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Token exchange failed:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: 'Unable to exchange token. Please try again.',
        });
      },
      complete: () => {
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
