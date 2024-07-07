import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Add this line
import { AnonymousLink } from '../models/anonymous-link';
import { AnonymousLinksResponse } from '../models/responses/anonymous-links-response';
import {environment} from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AnonymousLinkService {
  BASE_URL = 'http://localhost:3000/api/v1';
  constructor(private _client : HttpClient) { }

  createAnonymousLink(long_url: string) {
    
    return this._client.post(`${environment.BASE_URL}/anonymous`, { long_url }).pipe( // Replace 'map' with 'pipe'
      map((response: any) => { 
        document.cookie = `session=${response.link.session}; max-age=86400; path=/`; // Add this line
        return response;
      })
    );
  }

  getAnonymousLinks() : Observable<AnonymousLinksResponse> {
    
    return this._client.get<AnonymousLinksResponse>(`${environment.BASE_URL}/anonymous`,{withCredentials:true});
  }
}
