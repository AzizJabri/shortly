import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import {  Router, RouterLink } from '@angular/router';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-dashboard-nav',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-nav.component.html',
  styleUrl: './dashboard-nav.component.scss'
})
export class DashboardNavComponent {
  user!: User | null | undefined;
  constructor(public authService : AuthService, private router : Router, private alertService : AlertService){
    this.authService.user$.subscribe(x => this.user = x);
    console.log(this.user)
  }

  logout(){
    this.authService.logout();
    this.alertService.success('Logged out successfully', { keepAfterRouteChange: true });
    this.router.navigate(['/auth/login']);
  }

}
