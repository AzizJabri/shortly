import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '../../environment/environment';
import { StatsResponse } from '../models/responses/stats-response';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor(private _client : HttpClient) { }

  getStats() {
    return this._client.get<StatsResponse>(`${environment.BASE_URL}/stats`);
  }

  getPremiumStats() {
    return this._client.get<StatsResponse>(`${environment.BASE_URL}/stats/premium`);
  }

}
