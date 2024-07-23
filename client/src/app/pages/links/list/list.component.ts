import { Component, ElementRef, ViewChild } from '@angular/core';
import { LinkService } from '../../../services/link.service';
import { AlertService } from '../../../services/alert.service';
import { Link } from '../../../models/link';
import { CommonModule } from '@angular/common';
import {  RouterLink } from '@angular/router';
import { environment } from '../../../../environment/environment';
import { StatsService } from '../../../services/stats.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  links: Link[] = [];
  selectedLinks: Link[] = [];
  filterText = '';
  currentPage = 1;
  totalPages = 1;
  BACKEND_URL = environment.BACKEND_URL;

  constructor(private linkService: LinkService, private alertService: AlertService, private statsService : StatsService, public authService: AuthService) {
    this.getLinks();
  }

  @ViewChild('qrCode') qrCode : HTMLImageElement | undefined;
  @ViewChild('qrModal') qrModal : ElementRef | undefined;

  getLinks() {
    this.linkService.getLinks(this.filterText, this.currentPage).subscribe({
      next: (res) => {
        this.links = res.links;
        this.currentPage = res.currentPage;
        this.totalPages = res.totalPages;
      },
      error: error => {
        this.alertService.error(error.error);
        setTimeout(() => {
          this.alertService.clear();
        }, 3000);
      }
    });
  }

  createdAtToDate(createdAt: Date) {
    return new Date(createdAt).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  selectLink(link: Link) {
    if (this.selectedLinks.includes(link)) {
      this.selectedLinks = this.selectedLinks.filter((l) => l !== link);
    } else {
      this.selectedLinks.push(link);
    }
  }

  selectAll() {
    if (this.selectedLinks.length === this.links.length) {
      this.selectedLinks = [];
    } else {
      this.selectedLinks = this.links;
    }
  }

  deleteSelected() {
    for (const link of this.selectedLinks) {
      this.linkService.deleteLink(link.short_url).subscribe({
        next: () => {
          this.statsService.initRemaining();
        },
        error: error => {
          this.alertService.error(error.error);
          setTimeout(() => {
            this.alertService.clear();
          }, 3000);
        }
      });
    }
    this.selectedLinks = [];
    this.getLinks();
    setTimeout(() => {
      this.alertService.success('Links deleted successfully');
      setTimeout(() => {
        this.alertService.clear();
      }, 3000);
    }, 100);
  }

  generateQrCode(link: Link) {
    this.linkService.generateQrCode(link.short_url).subscribe({
      next: (res) => {  
        //replace image in img qrCode 
        this.qrCode = document.getElementById('qrCode') as HTMLImageElement;
        this.qrCode.width = 300;
        this.qrCode.height = 300;
        this.qrCode.src = res.qrCode;
      },
      error: error => {
        this.alertService.error(error.error);
        setTimeout(() => {
          this.alertService.clear();
        }, 3000);
      }
    });
  }

  filter(event: any) {
    event.preventDefault();
    this.currentPage = 1; // reset to the first page when filtering
    this.getLinks();
  }

  delete(link: Link) {
    this.linkService.deleteLink(link.short_url).subscribe({
      next: () => {
        this.getLinks();
        this.statsService.initRemaining();

        setTimeout(() => {
          this.alertService.success('Link deleted successfully');
          setTimeout(() => {
            this.alertService.clear();
          }, 3000);
        }, 100);
      },
      error: error => {
        this.alertService.error(error.error);
        setTimeout(() => {
          this.alertService.clear();
        }, 3000);
      }
    });
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getLinks();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getLinks();
    }
  }
}
