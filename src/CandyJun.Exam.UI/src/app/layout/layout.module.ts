import { NgModule } from '@angular/core';
import { GrowlModule, MenubarModule } from 'primeng/primeng';
import { DynamicComponentLoaderModule } from '../components/dynamic-component-loader/dynamic-component-loader.module';
import { TianrunModule } from '../components/tianrun/tianrun.module';
import { DialogComponent } from '../layout/dialog.component';
import { LoadingComponent } from '../layout/loading.component';
import { MessageComponent } from '../layout/message.component';
import { SharedModule } from '../shared/shared.module';
import { ConfirmComponent } from './confirm.component';
import { FooterComponent } from './footer.component';
import { LayoutIndexComponent } from './index.component';
import { NavbarComponent } from './navbar.component';
import { NavigationErrorComponent } from './navigation-error.component';
import { PageNotFoundComponent } from './not-found.component';
import { MessagePopupComponent } from './navbar.message-popup.component';
import { AutofocusDirectiveModule } from 'app/components/auto-focus.directive';

@NgModule({
    imports: [
        SharedModule,
        MenubarModule,
        GrowlModule,
        TianrunModule,
        AutofocusDirectiveModule,
        DynamicComponentLoaderModule,
    ],
    declarations: [
        FooterComponent,
        NavbarComponent,
        PageNotFoundComponent,
        NavigationErrorComponent,
        LoadingComponent,
        MessageComponent,
        MessagePopupComponent,
        DialogComponent,
        ConfirmComponent,
        LayoutIndexComponent
    ],
    exports: [
        PageNotFoundComponent,
        NavigationErrorComponent,
        LoadingComponent,
        MessageComponent,
        DialogComponent,
        ConfirmComponent
    ]
})
export class LayoutModule {}
