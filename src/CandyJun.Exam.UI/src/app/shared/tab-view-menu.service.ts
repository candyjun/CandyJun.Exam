/**
 * @File: TabView菜单服务
 * @Author: zhangjl
 */
import { Injectable } from '@angular/core';
import { AuthService } from '../core/auth.service';

@Injectable()
export class TabViewMenuService {
    [menuCode: string]: any;
    public hashParams: any = {};
    public constructor(authService: AuthService) {
        this.getHashParams();
        onhashchange = e => {
            this.getHashParams(e.newURL);
        };
        onmessage = e => {
            if (e.data.switchTab === true) {
                this.getHashParams();
            }
        };
        authService.menuList.forEach(menu => this[menu.MenuAttribute] = true);
    }

    public activeIndex(menuCodes: string[]) {
        const index = menuCodes.findIndex(p => p === this.hashParams.menuCode);
        return index === -1 ? 0 : index;
    }

    private getHashParams(urlString = location.href) {
        const url = new URL(urlString);
        if (url.hash) {
            url.hash.substring(1).split('&').forEach(p => {
                const nameValue = p.split('=');
                if (nameValue.length === 2) {
                    this.hashParams[nameValue[0]] = nameValue[1];
                }
            });
        }
        if (this.hashParams.menuCode) {
            const tab = document.querySelector(`p-tabpanel[tabmenucode="${this.hashParams.menuCode}"]`);
            if (!tab) {
                return;
            }
            const getElementNodes = (siblings: NodeListOf<Node>) => {
                return Array.from(siblings).filter(p => p.nodeType === Node.ELEMENT_NODE && (<Element>p).tagName === 'P-TABPANEL');
            };
            const div = tab.parentElement;
            const index = [].indexOf.call(getElementNodes(div.childNodes), tab);
            (<HTMLLIElement>div.previousElementSibling.getElementsByTagName('LI')[index]).click();
        }
    }
}
