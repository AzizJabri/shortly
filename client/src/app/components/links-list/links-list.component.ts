import { Component } from '@angular/core';
import { LinkService } from '../../services/link.service';
import { Link } from '../../models/link';
import { AlertService } from '../../services/alert.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-links-list',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './links-list.component.html',
  styleUrl: './links-list.component.scss'
})
export class LinksListComponent {
  links: Link[] = [];
  filterText = '';
  currentPage = 1;
  totalPages = 1;

  constructor(private linkService: LinkService, private alertService: AlertService) {
    this.getLinks();
  }

  getLinks() {
    this.linkService.getLinks(this.filterText, this.currentPage, 5).subscribe({
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

  filter(event: any) {
    event.preventDefault();
    this.currentPage = 1; // reset to the first page when filtering
    this.getLinks();
  }

  delete(link: Link) {
    this.linkService.deleteLink(link.short_url).subscribe({
      next: () => {
        this.links = this.links.filter((l) => l._id !== link._id);
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
