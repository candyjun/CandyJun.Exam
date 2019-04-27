import { Component, HostBinding, OnInit } from '@angular/core';
import { CustomMenuItem } from 'app/api/authorization-center/models/custom-menu-item.model';
import { EnumMenuCode } from 'app/api/authorization-center/enums/ts-menu-code.enum';
import { AuthService, logout } from '../core/auth.service';
import { MytabsRouteService } from '../mytabs/mytabs-route.service';
import { EnumMenuType, MenuOutput } from '../api/authorization-center/models/menu.output.model';

@Component({
    selector: 'app-layout-navbar',
    templateUrl: './navbar.component.html',
    styles: [`
        :host::ng-deep .ui-menu .ui-menu-parent .ui-submenu-icon {
            margin-top: 1.3rem;
        }
        :host::ng-deep .ui-menubar .ui-menuitem.ui-menuitem-custom {
            float: left;
        }

        .logo-container {
            position: relative;
            color: white;
            text-decoration: none;
            line-height: 1;
        }
        .logo-container:focus,
        .logo-container:active {
            color: inherit;
            text-decoration: none;
        }
        .logo-container::before,
        .logo-container::after {
            content: "";
            position: absolute;
            left: calc(100% + 10px);
            top: 50%;
            white-space: nowrap;
        }

        .logo-container::before {
            content: attr(data-platform);
            transform: translate3d(0, -110%, 0);
            font-weight: 900;
        }

        .logo-container::after {
            content: attr(data-system);
            opacity: .5;
        }
    `]
})
export class NavbarComponent implements OnInit {
    public items: CustomMenuItem[];

    @HostBinding('class.layout-navbar') public navbarPrimary = true;

    public hideTianRun: boolean = true;

    public constructor(private authService: AuthService, private mytabsRouteService: MytabsRouteService) {
        //
    }

    public ngOnInit() {
        const defaultMenuItem = {
            label: this.authService.currentUserInfo ? this.authService.currentUserInfo.UserName : '',
            icon: this.authService.currentUserInfo ? 'fa-user fa-lg' : 'fa-sign-in fa-lg',
            command: logout,
            code: EnumMenuCode.用户信息
        };

        // 现方法获取权限菜单
        const permissionMenus: CustomMenuItem[] = [];
        this.authService.getMenus().subscribe(menus => {
            if (menus) {
                const parents = menus.filter(m => m.ParentId === null);
                parents.forEach(parent => {
                    const parentMenu: CustomMenuItem = {};
                    parentMenu.id = parent.Id.toString();
                    parentMenu.label = parent.MenuName;
                    parentMenu.icon = parent.IconClass;
                    parentMenu.code = parent.MenuAttribute;
                    if (parent.MenuType !== EnumMenuType.菜单分组) {
                        if (parent.MenuAttribute.toLowerCase() === EnumMenuCode.电话.toLowerCase()) {
                            parentMenu.command = () => { this.hideTianRun = !this.hideTianRun; };
                        } else if (parent.MenuAttribute.toLowerCase() !== EnumMenuCode.新校验系统.toLowerCase()) {
                            parentMenu.command = () => { this.mytabsRouteService.newTab(parent.MenuName, parent.Url); };
                        }
                    }
                    if (parent.MenuAttribute.toLowerCase() === EnumMenuCode.新校验系统.toLowerCase()) {
                        parentMenu.url = parent.Url;
                        parentMenu.target = '_blank';
                    }
                    const newMenu: CustomMenuItem = parentMenu;
                    this.getChildMenus(newMenu, menus);
                    permissionMenus.push(newMenu);
                });
            }
            this.items = permissionMenus;
            this.items.push(defaultMenuItem);
        });
    }

    /**
     *  获取下级菜单
     * @param newMenu  有权限查看的菜单
     * @param menus 有权限查看的菜单
     */
    public getChildMenus(newMenu: CustomMenuItem, menus: MenuOutput[]) {
        const childMenus = menus.filter(m => m.ParentId === +newMenu.id && m.IsVisible === true);
        if (childMenus && childMenus.length) {
            newMenu.items = [];
            childMenus.forEach(item => {
                const childMenu: CustomMenuItem = {};
                childMenu.id = item.Id.toString();
                childMenu.label = item.MenuName;
                childMenu.icon = item.IconClass;
                childMenu.code = item.MenuAttribute;
                if (item.MenuType === EnumMenuType.菜单分组) {
                    if (item.MenuAttribute.toLowerCase() === EnumMenuCode.电话) {
                        childMenu.command = () => { this.hideTianRun = !this.hideTianRun; };
                    }
                } else if (item.MenuAttribute.toLowerCase() !== EnumMenuCode.新校验系统.toLowerCase()) {
                    const parentMenu = menus.find(p => p.Id === +newMenu.id);
                    const title = (item.Url && item.Url.split('#')[0] === parentMenu.Url) ? parentMenu.MenuName : item.MenuName;
                    childMenu.command = () => { this.mytabsRouteService.newTab(title, item.Url); };
                }
                if (item.MenuAttribute.toLowerCase() === EnumMenuCode.新校验系统.toLowerCase()) {
                    childMenu.url = item.Url;
                    childMenu.target = '_blank';
                }
                this.getChildMenus(childMenu, menus);
                newMenu.items.push(childMenu);
            });
        }
    }
}
