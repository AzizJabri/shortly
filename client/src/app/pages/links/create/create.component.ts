import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { LinkService } from '../../../services/link.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder : FormBuilder,
    private route: ActivatedRoute,
    private router: Router, 
    private alertService : AlertService,
    private linkService : LinkService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      title : ['', Validators.required],
      long_url : ['', Validators.compose([Validators.required, Validators.pattern('https?://.+')])],
    });
  }

  get f() { return this.form.controls; }

  onSubmit(){
    this.submitted = true;
    this.alertService.clear();
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    this.linkService.createLink(this.f['long_url'].value, this.f['title'].value)
      .subscribe({
        next: () => {
          this.loading = false;
          this.alertService.success('Link created successfully', { keepAfterRouteChange: true });
          this.router.navigate(['/dashboard']);
        },
        error: error => {
          this.alertService.error(error.error.message);
          this.loading = false;
          setTimeout(() => {
            this.alertService.clear();
          }, 3000);
        }
      });
  }

}
