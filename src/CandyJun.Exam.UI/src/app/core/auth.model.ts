import { environment } from 'environments/environment';

export enum StorageType {
    localStorage = 0,
    sessionStorage = 1
}

export class AuthConfig {
    public storageType: StorageType = StorageType.localStorage;
    public storageName = 'oauthToken';
    public baseUrl: string;
    public clientId: string;
    public scope: string;
    public redirectUri: string;
    public profileUri: string;
    public loginPath = 'connect/authorize';
    public logoutPath = 'connect/endsession';
}

// tslint:disable:variable-name
export class UserInfo {
    public Id: number;
    public Name: string;
    public EmailAddress: string;
    public UserName: string;
    public OrganizeName: string;
    public Sex: boolean;
    public SsoTicket: string;
}

// tslint:disable:variable-name
export class PreUserInfo {
    public sub: string;
    public name: string;
    public given_name: string;
    public role: string;
    public organize: string;
}

// tslint:enable:variable-name

export const authConfig: AuthConfig = {
    storageType: StorageType.localStorage,
    storageName: 'oauthToken',
    baseUrl: environment.authorizationCenterUrl,
    clientId: 'Zac.TicketSystem.Admin',
    scope: 'openid profile default-api',
    redirectUri: window.top.location.origin,
    profileUri: 'connect/userinfo',
    loginPath: 'connect/authorize',
    logoutPath: 'connect/endsession',
};

export const esdApiToken = 'Bearer buLeqCMjUZweS8wBSV8C4gCSZ06UeF7dErH_VYuFxuNthWTsi8opr0pjVxIe6'
    + '-AgVuS6xGQ86Z04rm80ELIyWICdafRUCXU9f6ph_Wk1L76dpIgdrkHfAvdbSRGVvONmBtYDzyquVOE1ORf'
    + 'q1hQZNo99RN_RicCYvyNhklm1RdOplUZRIi6QkEkaKoeZEpr0k3imnZ3qQJUJXn0qhJQb17KtpYZMSWfUN'
    + 'R0bP1xLBgDXiJ-YM1eVj0dGb6nmP7yuEb7HtA';
