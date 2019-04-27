import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[appDynamicComponentHost]',
})
export class DynamicComponentHostDirective {
    public constructor(public viewContainerRef: ViewContainerRef) {
        //
    }
}
