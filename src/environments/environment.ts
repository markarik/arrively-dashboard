// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: false,
  baseApiUrl: 'https://0e94c824f594.ngrok-free.app/api/v1',
  apiUrl: 'https://0e94c824f594.ngrok-free.app/api/v1/admin'

  // baseApiUrl: 'https://api.arrively.s7works.io/api/v1',
  // apiUrl: 'https://api.arrively.s7works.io/api/v1/admin',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
