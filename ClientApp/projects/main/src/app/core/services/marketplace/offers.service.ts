import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedResult } from '../../types/common.types';
import {
  Offer,
  OfferSearchRequest,
  CreateOfferRequest,
  RespondToOfferRequest
} from '../../interfaces/marketplace';

@Injectable({
  providedIn: 'root'
})
export class OffersService {
  private readonly apiUrl = `${environment.apiUrl}/marketplace/offers`;

  constructor(private http: HttpClient) {}

  getById(id: string): Observable<Offer> {
    return this.http.get<Offer>(`${this.apiUrl}/${id}`);
  }

  search(request: OfferSearchRequest): Observable<PagedResult<Offer>> {
    let params = new HttpParams();
    if (request.status !== null && request.status !== undefined) params = params.set('status', request.status.toString());
    if (request.asBuyer !== null) params = params.set('asBuyer', request.asBuyer.toString());
    if (request.asSeller !== null) params = params.set('asSeller', request.asSeller.toString());
    if (request.sortBy) params = params.set('sortBy', request.sortBy);
    params = params.set('sortDescending', request.sortDescending.toString());
    params = params.set('page', request.page.toString());
    params = params.set('pageSize', request.pageSize.toString());
    return this.http.get<PagedResult<Offer>>(this.apiUrl, { params });
  }

  create(request: CreateOfferRequest): Observable<Offer> {
    return this.http.post<Offer>(this.apiUrl, request);
  }

  respond(id: string, request: RespondToOfferRequest): Observable<Offer> {
    return this.http.post<Offer>(`${this.apiUrl}/${id}/respond`, request);
  }

  withdraw(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/withdraw`, {});
  }
}
