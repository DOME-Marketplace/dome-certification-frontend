import { environment } from '@env/environment';
import { inject, Injectable } from '@angular/core';
import { authCodeFlowConfig, loginOptions } from 'src/app/oauth.config';
import { OAuthService as OAuth } from 'angular-oauth2-oidc';
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
          customQueryParams: {
            client_assertion: clientSecret,
            client_assertion_type:
              'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
            request_uri:
              `${environment.API_URL}/auth/oauth-token`,
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
  //   {
  //     "access_token": "eyJraWQiOiJkaWQ6a2V5OnpEbmFldk44NVo3VkpnY0JvUWVxUVU3ZDhrWnB1VmhEU2RtOGhRdEpZV2p2ZWszVkwiLCJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJkaWQ6a2V5OnpEbmFlaG1rRWhveWJMZ1JrVmJLcEF2NDdWdTgxUnc1VG1MVUE1UHJSS3VXU2JoeG4iLCJzdWIiOiJkaWQ6a2V5OnpEbmFlV1B0dUVoOWF1OUFTWDdyQktqbnJkd3AzS1Vha2tvN3dlTG00dGRhRWVwR3giLCJzY29wZSI6Im9wZW5pZCBsZWFyY3JlZGVudGlhbCIsImlzcyI6Imh0dHBzOi8vdmVyaWZpZXIuZG9tZS1tYXJrZXRwbGFjZS1zYngub3JnIiwiZXhwIjoxNzMyMTEwOTEzLCJpYXQiOjE3MzIxMDczMTMsImp0aSI6ImQwM2VlNGYwLTJmNjMtNDZkOS1hNmQ0LTNmMjNiZmMxNThlZCIsInZlcmlmaWFibGVDcmVkZW50aWFsIjp7ImNvbnRleHQiOlsiaHR0cHM6Ly93d3cudzMub3JnL25zL2NyZWRlbnRpYWxzL3YyIiwiaHR0cHM6Ly90cnVzdC1mcmFtZXdvcmsuZG9tZS1tYXJrZXRwbGFjZS5ldS9jcmVkZW50aWFscy9sZWFyY3JlZGVudGlhbGVtcGxveWVlL3YxIl0sImlkIjoiZjM0YmU2MDUtOGZkNy00YzM1LWI1ZGMtOGEwYjU4MjRhMzRmIiwidHlwZSI6WyJMRUFSQ3JlZGVudGlhbEVtcGxveWVlIiwiVmVyaWZpYWJsZUNyZWRlbnRpYWwiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsibWFuZGF0ZSI6eyJpZCI6IjFkMDQwNWFhLTZmZTEtNGY0My05NGViLTQ5OWIwMjE5NzRjNSIsImxpZmVTcGFuIjp7ImVuZERhdGVUaW1lIjoiMjAyNS0xMS0xOFQxMTowMjozNi4zOTAwMzE3MTZaIiwic3RhcnREYXRlVGltZSI6IjIwMjQtMTEtMThUMTE6MDI6MzYuMzkwMDMxNzE2WiJ9LCJtYW5kYXRlZSI6eyJpZCI6ImRpZDprZXk6ekRuYWVXUHR1RWg5YXU5QVNYN3JCS2pucmR3cDNLVWFra283d2VMbTR0ZGFFZXBHeCIsImVtYWlsIjoiYW50b25pby5hbHZhcmV6QGRla3JhLmNvbSIsImZpcnN0TmFtZSI6IkFudG9uaW8iLCJsYXN0TmFtZSI6IkFsdmFyZXogVEVTVCIsIm1vYmlsZVBob25lIjoiKzM0IDY2NDc0MDA2MSJ9LCJtYW5kYXRvciI6eyJjb21tb25OYW1lIjoiTm9lbGlhIEd1ZXJyYSBNZWxnYXJlcyIsImNvdW50cnkiOiJFUyIsImVtYWlsQWRkcmVzcyI6Im5vZWxpYS5ndWVycmFAZGVrcmEuY29tIiwib3JnYW5pemF0aW9uIjoiREVLUkEgVGVzdGluZyBhbmQgQ2VydGlmaWNhdGlvbiwgUy5BLlUuIiwib3JnYW5pemF0aW9uSWRlbnRpZmllciI6IlZBVEVTLUEyOTUwNzQ1NiIsInNlcmlhbE51bWJlciI6IjUzMzcxODg4QyJ9LCJwb3dlciI6W3siaWQiOiJlZmFiYmMwYi0xMWFlLTQ1MDgtODEzYS00N2Q1NjkzNmM2MmMiLCJ0bWZBY3Rpb24iOlsiQ3JlYXRlIiwiVXBkYXRlIiwiRGVsZXRlIl0sInRtZkRvbWFpbiI6IkRPTUUiLCJ0bWZGdW5jdGlvbiI6IlByb2R1Y3RPZmZlcmluZyIsInRtZlR5cGUiOiJEb21haW4ifV0sInNpZ25lciI6eyJjb21tb25OYW1lIjoiWkVVUyBPTElNUE9TIiwiY291bnRyeSI6IkVVIiwiZW1haWxBZGRyZXNzIjoiZG9tZXN1cHBvcnRAaW4yLmVzIiwib3JnYW5pemF0aW9uIjoiT0xJTVBPIiwib3JnYW5pemF0aW9uSWRlbnRpZmllciI6IlZBVEVVLUI5OTk5OTk5OSIsInNlcmlhbE51bWJlciI6IklEQ0VVLTk5OTk5OTk5UCJ9fX0sImV4cGlyYXRpb25EYXRlIjpudWxsLCJpc3N1YW5jZURhdGUiOm51bGwsImlzc3VlciI6ImRpZDplbHNpOlZBVEVVLUI5OTk5OTk5OSIsInZhbGlkRnJvbSI6IjIwMjQtMTEtMThUMTE6MDI6MzYuMzkwMDMxNzE2WiIsInZhbGlkVW50aWwiOiIyMDI1LTExLTE4VDExOjAyOjM2LjM5MDAzMTcxNloifX0.tYjrWdViumJB9e3pNy5VtDu8shPvgpbiSzy-KxMkPuXmRwWIxauQcXzpqjUY1wY39k_XSHSopgu9u9gcC1dhRQ",
  //     "id_token": "eyJraWQiOiJkaWQ6a2V5OnpEbmFldk44NVo3VkpnY0JvUWVxUVU3ZDhrWnB1VmhEU2RtOGhRdEpZV2p2ZWszVkwiLCJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJzdWIiOiJkaWQ6a2V5OnpEbmFlV1B0dUVoOWF1OUFTWDdyQktqbnJkd3AzS1Vha2tvN3dlTG00dGRhRWVwR3giLCJhdWQiOiJkaWQ6a2V5OnpEbmFlaG1rRWhveWJMZ1JrVmJLcEF2NDdWdTgxUnc1VG1MVUE1UHJSS3VXU2JoeG4iLCJhY3IiOiIwIiwiYXV0aF90aW1lIjoxNzMyMTA3MzEzLCJpc3MiOiJodHRwczovL3ZlcmlmaWVyLmRvbWUtbWFya2V0cGxhY2Utc2J4Lm9yZyIsImV4cCI6MTczMjEwNzYxMywiaWF0IjoxNzMyMTA3MzEzLCJ2YyI6IntcIkBjb250ZXh0XCI6W1wiaHR0cHM6Ly93d3cudzMub3JnL25zL2NyZWRlbnRpYWxzL3YyXCIsXCJodHRwczovL3RydXN0LWZyYW1ld29yay5kb21lLW1hcmtldHBsYWNlLmV1L2NyZWRlbnRpYWxzL2xlYXJjcmVkZW50aWFsZW1wbG95ZWUvdjFcIl0sXCJjcmVkZW50aWFsU3ViamVjdFwiOntcIm1hbmRhdGVcIjp7XCJpZFwiOlwiMWQwNDA1YWEtNmZlMS00ZjQzLTk0ZWItNDk5YjAyMTk3NGM1XCIsXCJsaWZlX3NwYW5cIjp7XCJlbmRfZGF0ZV90aW1lXCI6XCIyMDI1LTExLTE4VDExOjAyOjM2LjM5MDAzMTcxNlpcIixcInN0YXJ0X2RhdGVfdGltZVwiOlwiMjAyNC0xMS0xOFQxMTowMjozNi4zOTAwMzE3MTZaXCJ9LFwibWFuZGF0ZWVcIjp7XCJlbWFpbFwiOlwiYW50b25pby5hbHZhcmV6QGRla3JhLmNvbVwiLFwiZmlyc3RfbmFtZVwiOlwiQW50b25pb1wiLFwiaWRcIjpcImRpZDprZXk6ekRuYWVXUHR1RWg5YXU5QVNYN3JCS2pucmR3cDNLVWFra283d2VMbTR0ZGFFZXBHeFwiLFwibGFzdF9uYW1lXCI6XCJBbHZhcmV6IFRFU1RcIixcIm1vYmlsZV9waG9uZVwiOlwiKzM0IDY2NDc0MDA2MVwifSxcIm1hbmRhdG9yXCI6e1wiY29tbW9uTmFtZVwiOlwiTm9lbGlhIEd1ZXJyYSBNZWxnYXJlc1wiLFwiY291bnRyeVwiOlwiRVNcIixcImVtYWlsQWRkcmVzc1wiOlwibm9lbGlhLmd1ZXJyYUBkZWtyYS5jb21cIixcIm9yZ2FuaXphdGlvblwiOlwiREVLUkEgVGVzdGluZyBhbmQgQ2VydGlmaWNhdGlvbiwgUy5BLlUuXCIsXCJvcmdhbml6YXRpb25JZGVudGlmaWVyXCI6XCJWQVRFUy1BMjk1MDc0NTZcIixcInNlcmlhbE51bWJlclwiOlwiNTMzNzE4ODhDXCJ9LFwicG93ZXJcIjpbe1wiaWRcIjpcImVmYWJiYzBiLTExYWUtNDUwOC04MTNhLTQ3ZDU2OTM2YzYyY1wiLFwidG1mX2FjdGlvblwiOltcIkNyZWF0ZVwiLFwiVXBkYXRlXCIsXCJEZWxldGVcIl0sXCJ0bWZfZG9tYWluXCI6XCJET01FXCIsXCJ0bWZfZnVuY3Rpb25cIjpcIlByb2R1Y3RPZmZlcmluZ1wiLFwidG1mX3R5cGVcIjpcIkRvbWFpblwifV0sXCJzaWduZXJcIjp7XCJjb21tb25OYW1lXCI6XCJaRVVTIE9MSU1QT1NcIixcImNvdW50cnlcIjpcIkVVXCIsXCJlbWFpbEFkZHJlc3NcIjpcImRvbWVzdXBwb3J0QGluMi5lc1wiLFwib3JnYW5pemF0aW9uXCI6XCJPTElNUE9cIixcIm9yZ2FuaXphdGlvbklkZW50aWZpZXJcIjpcIlZBVEVVLUI5OTk5OTk5OVwiLFwic2VyaWFsTnVtYmVyXCI6XCJJRENFVS05OTk5OTk5OVBcIn19fSxcImlkXCI6XCJmMzRiZTYwNS04ZmQ3LTRjMzUtYjVkYy04YTBiNTgyNGEzNGZcIixcImlzc3VlclwiOlwiZGlkOmVsc2k6VkFURVUtQjk5OTk5OTk5XCIsXCJ0eXBlXCI6W1wiTEVBUkNyZWRlbnRpYWxFbXBsb3llZVwiLFwiVmVyaWZpYWJsZUNyZWRlbnRpYWxcIl0sXCJ2YWxpZEZyb21cIjpcIjIwMjQtMTEtMThUMTE6MDI6MzYuMzkwMDMxNzE2WlwiLFwidmFsaWRVbnRpbFwiOlwiMjAyNS0xMS0xOFQxMTowMjozNi4zOTAwMzE3MTZaXCJ9In0.AL3_P6QA_XbM4OtnGRak2RcIlc_zUV5JOjSMCshfXsSf8rM20yu54AHq6GX2HAH41VSKiOOZ7y3p7avUaiI-lA",
  //     "token_type": "Bearer",
  //     "expires_in": 3599
  // }

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


    this.authService.exchangeToken(token).subscribe({
      next: (response) => {
        this.oauthService.logOut(true);
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
