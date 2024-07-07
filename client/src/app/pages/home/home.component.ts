import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AnonymousLinkService } from '../../services/anonymous-link.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../services/alert.service';
import { Link } from '../../models/link';
import { AnonymousLink } from '../../models/anonymous-link';
import { AnonymousLinkComponent } from '../../components/anonymous-link/anonymous-link.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgOptimizedImage, FormsModule, ReactiveFormsModule, CommonModule, AnonymousLinkComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;
  links: AnonymousLink[] = [];
  constructor(private anonymousLinkService : AnonymousLinkService, private formBuilder: FormBuilder, private alertService : AlertService) { 
    this.anonymousLinkService.getAnonymousLinks().subscribe({
      next: (links) => {
        this.links = links.links;
      },
      error: error => {
        this.alertService.error(error.error);
        setTimeout(() => {
            this.alertService.clear();
        }, 3000); 
      }
    });
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
        long_url : ['', Validators.compose([Validators.required, Validators.pattern('https?://.+')])]
    });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    this.alertService.clear();
    if (this.form.invalid) {
        return;
    }
    this.loading = true;
    this.anonymousLinkService.createAnonymousLink(this.f['long_url'].value)
        .subscribe({
            next: (link) => {
              console.log(link)
                this.loading = false;
            },
            error: error => {
              this.alertService.error(error.error);
              this.loading = false;
              setTimeout(() => {
                  this.alertService.clear();
              }, 3000); 
            }
        });
  }
}
