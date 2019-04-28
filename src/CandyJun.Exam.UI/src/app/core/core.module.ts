// https://angular.io/docs/ts/latest/guide/style-guide.html#!#04-11

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { ConfirmationService } from 'primeng/primeng';
import { DynamicComponentLoaderModule } from '../components/dynamic-component-loader/dynamic-component-loader.module';
import { SharedModule } from '../shared/shared.module';
import { AppErrorHandler } from './app-error-handler';
import { CustomHttpInterceptor } from './custom-http-interceptor';
import { MessageService } from './message.service';
import { throwIfAlreadyLoaded } from './module-import-guard';

@NgModule({
    imports: [
        SharedModule,
        DynamicComponentLoaderModule,
    ],
    exports: [],
    declarations: [],
    providers: [
        MessageService,
        { provide: ErrorHandler, useClass: AppErrorHandler },
        { provide: HTTP_INTERCEPTORS, useClass: CustomHttpInterceptor, multi: true },
        ConfirmationService,
    ]
})
export class CoreModule {
    public constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }

    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: []
        };
    }
}
