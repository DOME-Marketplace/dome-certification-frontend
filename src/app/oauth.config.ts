import { environment } from '@env/environment';
import { AuthConfig, LoginOptions } from 'angular-oauth2-oidc';

export const authCodeFlowConfig: AuthConfig = {
  issuer: environment.VERIFIER_URL,
  redirectUri: environment.REDIRECT_URI,
  clientId: environment.CLIENT_ID,
  responseType: 'code',
  scope: 'openid learcredential',
  disablePKCE: true,
  checkOrigin: false,
  showDebugInformation: true,


};
export const loginOptions: LoginOptions = {
  disableNonceCheck: true

}
