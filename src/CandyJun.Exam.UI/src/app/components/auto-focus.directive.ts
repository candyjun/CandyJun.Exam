/**
 * @File: 获取焦点
 * @Author: wush
 */
import { AfterViewInit, Directive, ElementRef, Input, NgModule } from '@angular/core';

@Directive({
    selector: '[appAutoFocus]'
})
export class AutofocusDirective implements AfterViewInit {
    private autofocus: boolean;

    public constructor(private el: ElementRef) {
        //
    }

    @Input()
    public set Autofocus(condition: boolean) {
        this.autofocus = condition !== false;
    }

    public ngAfterViewInit() {
        if (this.autofocus || typeof this.autofocus === 'undefined') {
            this.el.nativeElement.focus();
        }
    }
}

@NgModule({
    declarations: [AutofocusDirective],
    exports: [AutofocusDirective]
})
export class AutofocusDirectiveModule {
}
