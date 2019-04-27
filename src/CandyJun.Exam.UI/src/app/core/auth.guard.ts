import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { AuthService, getToken } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
    public constructor(private authService: AuthService) {
        //
    }

    public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
        return true;
    }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        if (!!getToken() || this.authService.initImplicitFlow()) {
            return this.authService.getProfile();
        }
        // 判断当前用户是否具有-当前路由权限
        let tabUrl = state.url.toLowerCase();
        if (tabUrl !== '/mytabs') {
            const menus = this.authService.menuList;
            if (!menus) {
                return of(false);
            }
            const index = menus.findIndex((menuItem): boolean => {
                if (menuItem.Url) {
                    tabUrl = tabUrl.replace(/^\/secret\//, '/custom/');
                    return menuItem.Url.toLowerCase().startsWith(tabUrl);
                }
                return false;
            });
            if (index < 0) {
                return of(false);
            }
        }
        return of(false);
    }
}
