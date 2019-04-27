import { ComponentFactoryResolver, Type } from '@angular/core';

export interface DynamicComponentItem {
    component: Type<any>;
    data?: any;
    title: string;
    componentFactoryResolver: ComponentFactoryResolver;

    outputEvent?(value?: any): void;
}
