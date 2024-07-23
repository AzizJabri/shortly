import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '../../environment/environment';
import { LinksResponse } from '../models/responses/links-response';
import { LinkResponse } from '../models/responses/link-response';
import { QrResponse } from '../models/responses/qr-response';
@Injectable({
  providedIn: 'root'
})
export class LinkService {

  constructor(private _client : HttpClient) { }

  getLinks(search: string = '', page: number = 1, limit : number = 10) {
    let params = new HttpParams().set('page', page).set('limit', limit).set('search', search);
    return this._client.get<LinksResponse>(`${environment.BASE_URL}/links`,{params});
  }

  getLink(id: string) {
    return this._client.get<LinkResponse>(`${environment.BASE_URL}/links/${id}`);
  }

  createLink(long_url : string, title : string) {
    return this._client.post(`${environment.BASE_URL}/links`, { long_url, title });

  }

  updateLink(id: string, long_url : string, title : string) {
    return this._client.patch(`${environment.BASE_URL}/links/${id}`, { long_url, title
    });
  }

  deleteLink(id: string) {
    return this._client.delete(`${environment.BASE_URL}/links/${id}`);
  }

  generateQrCode(id: string) {
    return this._client.get<QrResponse>(`${environment.BASE_URL}/links/${id}/qr`);
  }
}
