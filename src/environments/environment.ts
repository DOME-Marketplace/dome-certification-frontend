// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_URL: 'http://localhost:8080',
  VERIFIER_URL: 'https://verifier.dome-marketplace-sbx.org',
  CLIENT_ID: 'did:key:zDnaehmkEhoybLgRkVbKpAv47Vu81Rw5TmLUA5PrRKuWSbhxn',
  REQUEST_URI:
    'https://dome-certification-api.dome-marketplace-sbx.org/auth/oauth-token',
  REDIRECT_URI:
    'https://dome-certification.dome-marketplace-sbx.org/auth/login',
  ISSUER_API: 'https://issuer.dome-marketplace-sbx.org',
  DOME_MARKETPLACE: 'https://dome-marketplace-sbx.org',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
