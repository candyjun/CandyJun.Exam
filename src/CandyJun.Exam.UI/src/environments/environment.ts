// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


import { Environment } from './environment.model';

const config = new Environment();

config.env = 'DEBUG';
config.apiUrl = 'api';
config.authUrl = 'Login';

export const environment: Environment = config;
