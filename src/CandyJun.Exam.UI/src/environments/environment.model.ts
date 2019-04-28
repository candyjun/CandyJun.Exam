export class Environment {
    public env: ENV;
    public apiUrl: string;
    public authUrl: string;
}

// STAGING相当于dev
export type ENV = 'DEBUG' | 'STAGING' | 'TEST' | 'PRERELEASE' | 'UAT' | 'PRODUCTION';
