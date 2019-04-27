/**
 * @File: 菜单-标签页权限控制指令
 * @Author: tianhd
 */
import { OnInit, Directive, ElementRef, NgModule, Renderer2 } from '@angular/core';
import { AuthService } from '../core/auth.service';

@Directive({
    selector: '[appMenuTabPermission]'
})
export class MenuTabPermissionDirective implements OnInit {
    public constructor(private el: ElementRef,
        private renderer: Renderer2,
        private authService: AuthService) {
        //
    }

    public ngOnInit() {
        this.authService.getMenus().subscribe(result => {
            // 获取需要控制的tab页
            const tabElements = this.el.nativeElement.querySelectorAll('[menuTabCode]');
            if (tabElements) {
                const elements = Array.from(tabElements);
                // 设置tab页编号
                Array.from((<Element>elements[0]).parentElement.children).forEach((ele: any, index) => {
                    this.renderer.setAttribute(ele, 'tabIndex', index.toString());
                });
                // 移除子内容
                for (const ele of tabElements) {
                    this.renderer.setStyle(ele, 'display', 'none');
                }
                let count = 0;
                let existFirstEle: any;
                elements.forEach((ele: any, index) => {
                    const menuTabCode = ele.getAttribute('menuTabCode');
                    const tabIndex = ele.getAttribute('tabIndex');
                    const hasEle = result.find(p => p.MenuAttribute.toLowerCase() === menuTabCode.toLowerCase());
                    if (hasEle) {
                        this.renderer.removeStyle(ele, 'display');
                        existFirstEle = ele;
                    } else {
                        // 删除标签页
                        ele.parentElement.parentElement.querySelectorAll('ul li')[+tabIndex - count].remove();
                        ele.remove();
                        count++;
                    }
                });
                if (existFirstEle && count !== elements.length) {
                    existFirstEle.parentElement.parentElement.querySelectorAll('ul li')[0].click();
                }
            }
        });
    }
}

@Directive({
    selector: '[appMainPageTabPermission]'
})
export class MainPageTabPermissionDirective implements OnInit {
    public constructor(private el: ElementRef,
        private renderer: Renderer2) {
        //
    }

    public ngOnInit() {
    }
}

@NgModule({
    declarations: [MenuTabPermissionDirective, MainPageTabPermissionDirective],
    exports: [MenuTabPermissionDirective, MainPageTabPermissionDirective]
})
export class MenuTabPermissionDirectiveModule {
}
