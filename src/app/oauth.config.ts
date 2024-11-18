import { environment } from '@env/environment';
import { AuthConfig } from 'angular-oauth2-oidc';

export const authCodeFlowConfig: AuthConfig = {
  issuer: environment.VERIFIER_URL,
  // redirectUri: window.location.origin + '/auth/login',
  redirectUri:
    'https://dome-certification.dome-marketplace-sbx.org' + '/auth/login',

  clientId: environment.CLIENT_ID,
  responseType: 'code',

  customQueryParams: {
    client_assertion:
      'eyJhbGciOiJFUzI1NiJ9.eyJpc3MiOiJkaWQ6a2V5OnpEbmFlaG1rRWhveWJMZ1JrVmJLcEF2NDdWdTgxUnc1VG1MVUE1UHJSS3VXU2JoeG4iLCJzdWIiOiJkaWQ6a2V5OnpEbmFlaG1rRWhveWJMZ1JrVmJLcEF2NDdWdTgxUnc1VG1MVUE1UHJSS3VXU2JoeG4iLCJhdWQiOiJodHRwczovL3ZlcmlmaWVyLmRvbWUtbWFya2V0cGxhY2Utc2J4Lm9yZyIsImp0aSI6IjYyNWNjZTIyLTY2NGYtNDU2Yy04NWMzLWNhMGZjM2RhNjIzMyIsImlhdCI6MTczMTk1NTE3MywiZXhwIjoxNzMyMDQxNTczfQ.i-7qZ7uzmQEgcVy3dBIwTqgUobtsQQ5-wVuUSyuWXjdoib55JsjHTiVFmDhbI4DMYTdmQ2JHS9Of4AcvAn6Uaw',
  },

  scope: 'openid openid_learcredential',

  showDebugInformation: true,
};
