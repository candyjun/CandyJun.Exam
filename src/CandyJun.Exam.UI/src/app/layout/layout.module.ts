import { NgModule } from '@angular/core';
import { GrowlModule, MenubarModule } from 'primeng/primeng';
import { SharedModule } from '../shared/shared.module';
import { PageNotFoundComponent } from './not-found.component';

@NgModule({
    imports: [
        SharedModule,
        MenubarModule,
        GrowlModule
    ],
    declarations: [
        PageNotFoundComponent
    ],
    exports: [
        PageNotFoundComponent
    ]
})
export class LayoutModule {}
