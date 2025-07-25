import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

    if (!this.authService.isAuthenticated()) {
      return true;
    }
    
    return this.authService.user$.pipe(
      take(1),
      map(user => {
        if (!user) {
          return true;
        } else {
          this.router.navigate(['/dashboard']);
          return false;

        }
      })
    );
  }
}
