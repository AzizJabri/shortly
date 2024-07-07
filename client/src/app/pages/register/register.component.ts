import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { RegisterRequest } from '../../models/requests/register-request';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;

  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private authService: AuthService,
      private alertService : AlertService
  ) {  }

  ngOnInit() {
    this.form = this.formBuilder.group({
        email: ['',  Validators.compose([Validators.required, Validators.email])],
        password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
        confirmPassword: ['', Validators.required]

    });
  }

  // Custom validator to check if passwords match
  private passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    return password && confirmPassword && password.value === confirmPassword.value ? null : { passwordsNotMatch: true };
  }

  // Convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit(): void {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    const payload: RegisterRequest = {
      email: this.f['email'].value, 
      password: this.f['password'].value
  };
    this.authService.register(payload)
        .pipe(first())
        .subscribe({
          next: () => {
            // Registration successful, navigate to login page or home
            this.router.navigateByUrl('/auth/login');
          },
          error: error => {
            this.loading = false;
            this.alertService.error(error.error.message);
            setTimeout(() => {
              this.alertService.clear();
            }, 5000);
          }
        });
  }
}
