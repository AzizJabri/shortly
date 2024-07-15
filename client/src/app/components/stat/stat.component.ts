import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { StatsResponse } from '../../models/responses/stats-response';
import { Change } from '../../models/change';

@Component({
  selector: 'app-stat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat.component.html',
  styleUrl: './stat.component.scss'
})
export class StatComponent {
  constructor(public authService : AuthService) { }

  @Input()
  title: string = '';

  @Input()
  value: string = '';

  @Input()
  stat : Change | undefined = undefined;

  @Input()
  premium: boolean = false;

  @Input()
  date : string = '';
}
