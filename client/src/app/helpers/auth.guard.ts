import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

    if (this.authService.isAuthenticated()) {
      return true;
    }
    
    return this.authService.me().pipe(
      take(1),
      map(() => true),
      catchError(() => {
        this.router.navigate(['/auth/login'], { queryParams: { next: state.url } });
        return of(false);
      })
    );
  }
}
