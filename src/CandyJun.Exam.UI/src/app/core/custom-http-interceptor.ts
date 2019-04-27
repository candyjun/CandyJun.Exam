import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getAuthorizationHeaderByUrl, logout } from 'app/core/auth.service';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';
import { environment } from 'environments/environment';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
    public constructor() {
        //
    }

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Get the auth header from the service.
        let authReq = req.clone();

        // Clone the request to add the new header.
        if (!req.url.startsWith(environment.ocrUrl)) {
            const authHeaderName = 'Authorization';
            authReq = req.clone({
                headers: req.headers.set(authHeaderName, getAuthorizationHeaderByUrl(req.url))
            });
        }

        // Pass on the cloned request instead of the original request.
        return next.handle(authReq).pipe(
            tap(() => {
                // if (event instanceof HttpResponse) {
                //     // do stuff with response if you want
                // }
            }, error => {
                // Remember, there may be other events besides just the response.
                if (error instanceof HttpErrorResponse) {
                    if (error.status === 401) {
                        logout();
                    }
                }
            })
        );
    }
}
