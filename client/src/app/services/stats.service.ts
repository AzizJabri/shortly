import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '../../environment/environment';
import { StatsResponse } from '../models/responses/stats-response';
import { Observable, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  remaining : number = 0;
  remainingChange : Subject<number> = new Subject<number>();

  constructor(private _client : HttpClient) { 
    this.remainingChange.subscribe((remaining) => {
      this.remaining = remaining;
    });

    this.initRemaining();
    
  }

  initRemaining() {
    this.getLinksCreatedToday().subscribe((data) => {
      this.setRemainingLinks(data.links);
    });
  }

  setRemainingLinks(links : number) {
    this.remainingChange.next(links);
  }

  getStats() {
    return this._client.get<StatsResponse>(`${environment.BASE_URL}/stats`);
  }

  getPremiumStats() {
    return this._client.get<StatsResponse>(`${environment.BASE_URL}/stats/premium`);
  }

  getLinksCreatedToday() {
    return this._client.get<{type : string, links : number}>(`${environment.BASE_URL}/stats/today`);
  }

}
