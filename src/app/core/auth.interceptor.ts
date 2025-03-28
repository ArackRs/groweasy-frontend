import {HttpEvent, HttpRequest, HttpHandlerFn, HttpErrorResponse} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export function authInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
  const authService = inject(AuthService);
  const token = authService.getToken();

  const authReq = token ? req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  }) : req;

  return next(authReq).pipe(
    tap(() => {
      // Aquí podrías realizar acciones con la respuesta si es necesario.
    }),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 403) {
        authService.handleSessionExpired();
      }
      return throwError(() => new Error(`Error ${error.status}: ${error.message}`));
    })
  );
}
