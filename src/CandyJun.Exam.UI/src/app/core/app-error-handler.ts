import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { NavigationError, Router } from '@angular/router';

import { MessageService } from './message.service';

@Injectable()
export class AppErrorHandler implements ErrorHandler {
    public constructor(private injector: Injector,
                       private messageService: MessageService) {
        this.handleRouterError();
    }

    public handleError(error: any) {
        this.messageService.hideLoading();

        console.error(error);

        // NavigationError
        if (error.rejection && error.task && error.promise) {
            return;
        }

        if (error instanceof Error) {
            this.unhandledError(error);
            return;
        }
        if (error instanceof HttpErrorResponse) {
            this.handleHttpResponseError(<HttpErrorResponse>error);
            return;
        }
    }

    private unhandledError(error: Error) {
        if (error.message.toString().indexOf('ExpressionChangedAfterItHasBeenCheckedError') !== -1) {
            return;
        }
        this.messageService.error(error.message);
    }

    // tslint:disable-next-line:cyclomatic-complexity
    private handleHttpResponseError(error: HttpErrorResponse) {
        let currentError: any = error.error;
        if (currentError instanceof Error) {
            this.messageService.error(currentError.message);
            return;
        }

        if (currentError instanceof String || typeof currentError === 'string') {
            try {
                currentError = JSON.parse(currentError.toString());
            } catch (e) {
                //
            }
        }

        if (error.status <= 0) {
            setTimeout(() => {
                const router = this.injector.get(Router);
                router.navigate(['/error/navigation'], {
                    skipLocationChange: true,
                    queryParams: { url: '/', message: '请求api时出现网络错误! 请按F5键刷新页面重试!' },
                });
            });
            return;
        }

        if (error.status >= 400) {
            const translate: any = {
                400: '请求错误',
                401: '授权认证失败',
                403: '禁止访问',
                404: '资源未找到',
                405: '不支持该操作',
                422: '请求数据有误',
                500: '内部服务器错误',
                503: '网络故障'
            };

            let message = translate[error.status] || '未知错误!';
            if (currentError) {
                message = currentError.message || currentError;
                if (message.indexOf('<i>Runtime Error</i>') !== -1) {
                    message = '请求api时出现内部服务器错误!';
                }
                if (error.status >= 500) {
                    setTimeout(() => this.messageService.error(message));
                    return;
                }
                setTimeout(() => this.messageService.warn(message));
                return;
            }
            setTimeout(() => this.messageService.error(message));
            return;
        }
    }

    private handleRouterError() {
        setTimeout(() => {
            const router = this.injector.get(Router);
            router.events.subscribe(event => {
                if (event instanceof NavigationError) {
                    const { url, error } = <NavigationError>event;
                    const { message/*, stack*/ } = error;
                    router.navigate(['/error/navigation'], {
                        skipLocationChange: true,
                        queryParams: { url, message: message || error },
                    });
                }
            });
        });
    }
}
