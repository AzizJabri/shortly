import { HttpInterceptorFn } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { throwError, of } from 'rxjs';

export const refreshInterceptor: HttpInterceptorFn = (req, next) => {
    const injector = inject(Injector);
    
    // try to refresh the token on 401 error
    return next(req).pipe(
        catchError((err) => {
            if (err.status === 401) {
                const authService = injector.get(AuthService);
                return authService.refreshToken().pipe(
                    tap((res) => {
                        console.log(res)
                        localStorage.setItem('access_token', res.access_token);
                    }),
                );
            }
            return throwError(err);
        })
    );
};
