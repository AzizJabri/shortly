import { Component, Input } from '@angular/core';
import { AnonymousLink } from '../../models/anonymous-link';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-anonymous-link',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './anonymous-link.component.html',
  styleUrl: './anonymous-link.component.scss'
})
export class AnonymousLinkComponent {
@Input() link: AnonymousLink = {} as AnonymousLink;
  BASE_URL = 'http://localhost:3000/';
  text = 'Copy';
  color = 'btn-primary';
    constructor() { }

    copyToClipboard() {
        navigator.clipboard.writeText(this.BASE_URL + this.link.short_url).then(() => {
            this.text = 'Copied!';
            this.color = 'btn-success';
            setTimeout(() => {
                this.text = 'Copy';
                this.color = 'btn-primary';
            }
            , 3000);
        }).catch((error) => {
            console.error('Error copying to clipboard: ', error);
        });
    }
}
