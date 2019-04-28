import { Environment } from './environment.model';

const config = new Environment();

config.env = 'PRODUCTION';
config.apiUrl = 'api';
config.authUrl = 'Login';

export const environment: Environment = config;
