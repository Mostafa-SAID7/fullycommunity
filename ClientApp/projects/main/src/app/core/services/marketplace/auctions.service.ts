import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedResult } from '../../types/common.types';
import {
  Auction,
  AuctionListItem,
  Bid,
  AuctionSearchRequest,
  CreateAuctionRequest,
  PlaceBidRequest,
  BuyItNowRequest
} from '../../interfaces/marketplace';

@Injectable({
  providedIn: 'root'
})
export class AuctionsService {
  private readonly apiUrl = `${environment.apiUrl}/marketplace/auctions`;

  constructor(private http: HttpClient) {}

  getById(id: string): Observable<Auction> {
    return this.http.get<Auction>(`${this.apiUrl}/${id}`);
  }

  search(request: AuctionSearchRequest): Observable<PagedResult<AuctionListItem>> {
    let params = new HttpParams();
    if (request.keywords) params = params.set('keywords', request.keywords);
    if (request.category !== null && request.category !== undefined) params = params.set('category', request.category.toString());
    if (request.status !== null && request.status !== undefined) params = params.set('status', request.status.toString());
    if (request.minPrice !== null) params = params.set('minPrice', request.minPrice.toString());
    if (request.maxPrice !== null) params = params.set('maxPrice', request.maxPrice.toString());
    if (request.hasBuyItNow !== null) params = params.set('hasBuyItNow', request.hasBuyItNow.toString());
    if (request.endingSoon !== null) params = params.set('endingSoon', request.endingSoon.toString());
    if (request.sortBy) params = params.set('sortBy', request.sortBy);
    params = params.set('sortDescending', request.sortDescending.toString());
    params = params.set('page', request.page.toString());
    params = params.set('pageSize', request.pageSize.toString());
    return this.http.get<PagedResult<AuctionListItem>>(this.apiUrl, { params });
  }

  create(request: CreateAuctionRequest): Observable<Auction> {
    return this.http.post<Auction>(this.apiUrl, request);
  }

  placeBid(auctionId: string, request: PlaceBidRequest): Observable<Bid> {
    return this.http.post<Bid>(`${this.apiUrl}/${auctionId}/bids`, request);
  }

  getBids(auctionId: string): Observable<Bid[]> {
    return this.http.get<Bid[]>(`${this.apiUrl}/${auctionId}/bids`);
  }

  buyItNow(request: BuyItNowRequest): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/${request.auctionId}/buy-now`, {});
  }

  watch(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/watch`, {});
  }

  unwatch(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/watch`);
  }
}
