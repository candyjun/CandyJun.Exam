import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ComponentContainerComponent } from './dynamic-component-container.component';
import { DynamicComponentHostDirective } from './dynamic-component-host.directive';

@NgModule({
    imports: [
        FormsModule,
        CommonModule
    ],
    declarations: [
        DynamicComponentHostDirective,
        ComponentContainerComponent
    ],
    exports: [
        ComponentContainerComponent
    ]
})
export class DynamicComponentLoaderModule {
}

