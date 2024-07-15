import { Component } from '@angular/core';
import { StatsService } from '../../services/stats.service';
import { StatsResponse } from '../../models/responses/stats-response';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { StatComponent } from '../../components/stat/stat.component';
import { LinksListComponent } from '../../components/links-list/links-list.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, StatComponent, LinksListComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  stats : StatsResponse = {
    totalClicks: 0,
    clicksLast30Days: 0,
    clicksLast7Days: 0,
    clicksLast24Hours: 0,
    monthIntervalName: '',
  };
  constructor(private statsService: StatsService, public authService: AuthService) {
    if (this.authService.user?.plan === 'premium') {
      this.statsService.getPremiumStats().subscribe((stats) => {
        this.stats = stats;
      });
    } else {
      this.statsService.getStats().subscribe((stats) => {
        this.stats = stats;
      });
    }
  }
}
