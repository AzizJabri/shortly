import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { AlertService } from '../../services/alert.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent {
  token: string = '';
  isLoading: boolean = true;
  isSuccessful: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService
  ) {
    // Get the token from the URL
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.verify();
    });
  }

  verify() {
    this.authService.verify(this.token).pipe(first()).subscribe({
      next: () => {
        this.isSuccessful = true;
        this.isLoading = false;
        this.alertService.success('Account verified', { keepAfterRouteChange: true });
      },
      error: (error) => {
        this.isSuccessful = false;
        this.isLoading = false;
        this.alertService.error(error.error.message, { keepAfterRouteChange: true });
        setTimeout(() => {
          this.alertService.clear();
          this.router.navigate(['/auth/login']);
        }, 5000);
      }
    });
  }
}
