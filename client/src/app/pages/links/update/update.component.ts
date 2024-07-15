import { Component, OnInit } from '@angular/core';
import { Link } from '../../../models/link';
import { ActivatedRoute, Router } from '@angular/router';
import { LinkService } from '../../../services/link.service';
import { AlertService } from '../../../services/alert.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

interface Response {
  link: Link;
  message: string;
  
}

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './update.component.html',
  styleUrl: './update.component.scss'
})
export class UpdateComponent implements OnInit {

  id: string = '';
  link : Link | undefined;
  form!: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private route : ActivatedRoute, 
    private linkService: LinkService, 
    private alertService : AlertService, 
    private router : Router,
    private formBuilder : FormBuilder,
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.linkService.getLink(this.id).subscribe({
      next: (res) => {
        this.link = res.link;
        this.form = this.formBuilder.group({
          title : [this.link?.title, Validators.required],
          long_url : [this.link?.long_url, Validators.compose([Validators.required, Validators.pattern('https?://.+')])],
        });
      },
      error: error => {
        this.router.navigate(['/links']);
        this.alertService.error(error.error.message);
        setTimeout(() => {
          this.alertService.clear();
        }, 3000);
      }
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
    this.linkService.updateLink(this.id, this.f['long_url'].value, this.f['title'].value)
      .subscribe({
        next: () => {
          this.loading = false;
          this.alertService.success('Link updated successfully', { keepAfterRouteChange: true });
          this.router.navigate(['/links']);
        },
        error: (error) => {
          this.alertService.error(error.error.message);
          this.loading = false;
          setTimeout(() => {
            this.alertService.clear();
          }, 3000);
        }
      });
  }

}
