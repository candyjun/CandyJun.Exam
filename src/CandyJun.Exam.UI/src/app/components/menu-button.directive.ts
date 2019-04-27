/**
 * @File: 菜单-按钮权限控制指令
 * @Author: zhangjl
 */
import { OnInit, Directive, ElementRef, NgModule, Renderer2, Input } from '@angular/core';

@Directive({
    selector: '[appMenuCode]'
})
export class MenuButtonDirective implements OnInit {
    @Input() public removeNoAnyButton = false;
    public constructor(private el: ElementRef,
        private renderer: Renderer2) {
        //
    }

    public ngOnInit() {
        const buttons = this.el.nativeElement.querySelectorAll('[buttonCode]');
        for (const button of buttons) {
            this.renderer.setStyle(button, 'display', 'none');
        }
    }
}

@NgModule({
    declarations: [MenuButtonDirective],
    exports: [MenuButtonDirective]
})
export class MenuButtonDirectiveModule {
}
