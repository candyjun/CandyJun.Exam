// https://angular.io/docs/ts/latest/guide/style-guide.html#!#04-11

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { ConfirmationService } from 'primeng/primeng';
import { DynamicComponentLoaderModule } from '../components/dynamic-component-loader/dynamic-component-loader.module';
import { SharedModule } from '../shared/shared.module';
import { AppErrorHandler } from './app-error-handler';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { CustomHttpInterceptor } from './custom-http-interceptor';
import { MessageService } from './message.service';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { SignalRService } from './signalr.service';
import { SystemMessageService } from './system-message.service';

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
        AuthGuard,
        AuthService,
        SignalRService,
    ]
})
export class CoreModule {
    public constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }

    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [SystemMessageService]
        };
    }
}
