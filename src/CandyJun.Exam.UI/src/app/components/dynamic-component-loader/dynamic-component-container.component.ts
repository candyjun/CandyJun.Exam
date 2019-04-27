import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges, ViewChild, } from '@angular/core';
import { DynamicComponentBase } from './dynamic-component-base';
import { DynamicComponentHostDirective } from './dynamic-component-host.directive';
import { DynamicComponentItem } from './dynamic-component-item';

@Component({
    selector: 'app-components-dynamic-component-container',
    template: `
        <ng-template appDynamicComponentHost></ng-template>
    `
})
export class ComponentContainerComponent implements OnChanges {
    @Input()
    public componentItem: DynamicComponentItem;

    @ViewChild(DynamicComponentHostDirective)
    public dynamicHost: DynamicComponentHostDirective;

    public constructor(/*private componentFactoryResolver: ComponentFactoryResolver,*/
                       private changeDetectorRef: ChangeDetectorRef) {
    }

    public loadComponent() {
        const item = this.componentItem;
        const componentFactory = item.componentFactoryResolver.resolveComponentFactory(this.componentItem.component);
        const viewContainerRef = this.dynamicHost.viewContainerRef;
        viewContainerRef.clear();
        const componentRef = viewContainerRef.createComponent(componentFactory);
        const component = (<DynamicComponentBase>componentRef.instance);
        component.data = this.componentItem.data;
        if (component.outputEvent) {
            if (item.outputEvent) {
                component.outputEvent.subscribe((v: any) => item.outputEvent(v));
            }
        }
        this.changeDetectorRef.detectChanges();
    }

    public ngOnChanges(changes: SimpleChanges) {
        const item = changes.componentItem;
        if (item) {
            if (!item.isFirstChange()) {
                if (item.currentValue) {
                    this.loadComponent();
                } else {
                    this.dynamicHost.viewContainerRef.clear();
                }
            }
        }
    }
}
