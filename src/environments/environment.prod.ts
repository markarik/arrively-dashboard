import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
        apiUrl: 'https://api.arrively.s7works.io/api/v1/',

};
