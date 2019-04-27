import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, Optional, SkipSelf } from '@angular/core';
import { CustomMenuItem } from 'app/api/authorization-center/models/custom-menu-item.model';
import { MenuOutput } from 'app/api/authorization-center/models/menu.output.model';
import { TianRunIframeMessage } from 'app/components/tianrun/tianrun.enum';
import { authConfig, esdApiToken, PreUserInfo, StorageType, UserInfo } from 'app/core/auth.model';
import { toQueryString } from 'app/shared/http-param-serializer';
import { environment, environment as config } from 'environments/environment';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';
import { throwIfAlreadyLoaded } from './module-import-guard';

const USERINFO_KEY = 'userinfo';

export function getStorage() {
    let storage: Storage;
    if (authConfig.storageType === StorageType.localStorage) {
        storage = localStorage;
    } else {
        storage = sessionStorage;
    }
    return storage;
}

export function getToken(): any {
    const dataString = getStorage()[authConfig.storageName];
    if (dataString) {
        const data = JSON.parse(dataString);
        if (data && data.expires_at && new Date(data.expires_at) >= new Date()) {
            return data;
        }
    }
    return null;
}

export function getAuthorizationHeader(): string {
    const token = getToken();
    if (token) {
        const tokenType = token.token_type;
        const accessToken = token.access_token;
        return `${tokenType[0].toUpperCase() + tokenType.substr(1)} ${accessToken}`;
    }
    return '';
}

export function setToken(data: any) {
    getStorage()[authConfig.storageName] = JSON.stringify(data);
}

export function removeToken() {
    delete getStorage()[authConfig.storageName];
}

/**
 * 退出天润
 */
export function tianRunLogout() {
    try {
        window.top.postMessage({
            messageType: TianRunIframeMessage.退出登录
        }, '/');
    } catch (e) {
        console.error(e);
    }
}

export function logout() {
    const token = getToken();
    sessionStorage.clear();
    tianRunLogout();
    removeToken();
    window.top.location.href = `${authConfig.baseUrl + authConfig.logoutPath}?id_token_hint=${token.id_token}`;
}

export function getAuthorizationHeaderByUrl(url: string): string {
    if (url.startsWith(environment.esdApiUrl)) {
        return esdApiToken;
    } else {
        return getAuthorizationHeader();
    }
}

@Injectable()
export class AuthService {
    // 授权中心地址
    private authorizationCenterApiUrl = config.authorizationCenterApiUrl;

    public constructor(private http: HttpClient,
        @Optional() @SkipSelf() parentModule: AuthService) {
        if ('/' !== authConfig.baseUrl.substr(-1)) {
            authConfig.baseUrl += '/';
        }
        throwIfAlreadyLoaded(parentModule, 'AuthService');
    }

    /**
     *  获取当前登录用户Id
     */
    public get currentUserId(): number {
        return this.currentUserInfo.Id;
    }

    public get currentUserInfo(): UserInfo {
        return <UserInfo>(JSON.parse(sessionStorage.getItem(USERINFO_KEY)));
    }

    /**
     * 获取权限菜单信息
     */
    public get menuList(): MenuOutput[] {
        let result: MenuOutput[] = [];

        const tsMenuList = sessionStorage.getItem('tsMenuList');
        if (!tsMenuList) {
            this.getMenus().subscribe(data => {
                result = data;
            });
        } else {
            result = <MenuOutput[]>(JSON.parse(tsMenuList));
        }

        return result;
    }

    /**
     * 隐式授权流程
     */
    public initImplicitFlow(): boolean {
        // 检测地址中存在授权hash，并解析
        const hash = location.hash;
        if (hash.indexOf('#') === 0) {
            const token: any = {};
            const httpParams = new HttpParams({ fromString: hash.substr(1) });
            httpParams.keys().forEach(
                key => {
                    token[key] = httpParams.get(key);
                });
            if (token.access_token) {
                const expiresIn = token.expires_in;
                if (expiresIn) {
                    const expiresAt = new Date();
                    // 提前60s过期
                    expiresAt.setSeconds(expiresAt.getSeconds() + +expiresIn - 60);
                    token.expires_at = expiresAt;
                }
                setToken(token);
                location.hash = '';

                return true;
            }
        }

        // 未授权跳转至授权地址
        let redirectUri: string = authConfig.redirectUri;
        // 判断是否已'#'结尾，有则去除
        const redirectUriPartLength = redirectUri.length - 1;
        if (redirectUriPartLength >= 0 && redirectUri.lastIndexOf('#') === redirectUriPartLength) {
            redirectUri = redirectUri.substr(0, redirectUriPartLength);
        }
        const paramString = toQueryString({
            client_id: authConfig.clientId,
            response_type: 'id_token token',
            scope: authConfig.scope,
            redirect_uri: redirectUri,
            state: new Date().getTime().toString(),
            nonce: new Date().getTime().toString()
        });
        window.top.location.href = `${authConfig.baseUrl + authConfig.loginPath}?${paramString}`;

        return false;
    }

    /**
     * 获取个人信息
     */
    public getProfile(): Observable<boolean> {
        if (this.currentUserInfo) {
            return of(!!this.currentUserInfo);
        } else {
            const url = authConfig.baseUrl + authConfig.profileUri;
            const options = { headers: new HttpHeaders().set('Authorization', getAuthorizationHeader()) };
            return this.http.get<PreUserInfo>(url, options).pipe(
                map(preUserInfo => {
                    const userInfo = {
                        Id: preUserInfo.sub,
                        UserName: preUserInfo.name,
                        Name: preUserInfo.given_name,
                        RoleNames: preUserInfo.role,
                        OrganizeNames: preUserInfo.organize
                    };
                    sessionStorage.setItem(USERINFO_KEY, JSON.stringify(userInfo));
                    return (!!userInfo);
                })
            );
        }
    }

    // -----------授权中心菜单权限（开始）------------
    /**
     * 根据应用key获取工单系统-菜单列表
     */
    public getMenus(): Observable<MenuOutput[]> {
        const key = authConfig.clientId;
        const userId = this.currentUserId;
        const url = `${this.authorizationCenterApiUrl}/api/Menu/GetMenuList?key=${key}&userId=${userId}`;
        return this.http.get<MenuOutput[]>(url).pipe(
            map(data => {
                sessionStorage.setItem('tsMenuList', JSON.stringify(data));
                return (data);
            })
        );
    }

    /**
     * 获取用户权限菜单
     * @param items NavbarComponent组件配置的菜单列表
     */
    public getPermissionMenus(items: CustomMenuItem[]) {
        return this.getMenus().pipe(map(menus => {
            if (!(menus && menus.length)) {
                items.length = 0;
                return;
            }
            const menuCodes = menus.map(p => p.MenuAttribute.toLowerCase());
            const filterMenuItems = (menuItems: CustomMenuItem[]) => {
                if (!(menuItems && menuItems.length)) {
                    return;
                }
                for (let i = 0; i < menuItems.length; i++) {
                    if (menuCodes.includes(menuItems[i].code.toLowerCase())) {
                        filterMenuItems(menuItems[i].items);
                    } else {
                        menuItems.splice(i--, 1);
                    }
                }
            };
            filterMenuItems(items);
        }));
    }

    // -----------授权中心菜单权限（结束）------------
}
