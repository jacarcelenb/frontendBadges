import { finalize } from 'rxjs/operators';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';
import { AlertService } from '../services/alert.service';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
  constructor(
    private tokenStorage: TokenStorageService,
    private _authService: AuthService,
    private _alertService: AlertService,
    private spinner: NgxSpinnerService
  ) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const headers = this.tokenStorage.getHeader();
    // convert 'headers' to object
    const setHeaders = {};
    headers.keys().forEach((key) => {
      setHeaders[key] = headers.get(key);
    });

    const reqClone = req.clone({ setHeaders });
    this.spinner.show();
    return next.handle(reqClone).pipe(
      map((event: HttpEvent<any>) => {
        return event;
      }),
      catchError(
        (
          httpErrorResponse: HttpErrorResponse,
          _: Observable<HttpEvent<any>>
        ) => {
          if (httpErrorResponse.status == 401) {
            this._authService.redirectToLogin();
            return throwError(httpErrorResponse);
          }
          const reponse = httpErrorResponse.error || {};

          if (reponse.errors && reponse.errors.length > 0) {
            const message = reponse.errors.join('\n');
            this._alertService.presentErrorAlert(message);
          }

          return throwError(httpErrorResponse);
        }
      ),
      finalize(() => {
        this.spinner.hide();
      })
    );
  }
}
