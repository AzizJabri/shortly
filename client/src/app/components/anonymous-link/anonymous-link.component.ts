import { Component, Input } from '@angular/core';
import { AnonymousLink } from '../../models/anonymous-link';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environment/environment';

@Component({
  selector: 'app-anonymous-link',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './anonymous-link.component.html',
  styleUrl: './anonymous-link.component.scss'
})
export class AnonymousLinkComponent {
@Input() link: AnonymousLink = {} as AnonymousLink;
  BACKEND_URL = environment.BACKEND_URL;
  text = 'Copy';
  color = 'btn-primary';
    constructor() { }

    copyToClipboard() {
        navigator.clipboard.writeText(this.BACKEND_URL + "/" + this.link.short_url).then(() => {
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
