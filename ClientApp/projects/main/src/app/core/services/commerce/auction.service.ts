import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Auction, Bid, AuctionStatus, Order, PagedResult } from '../commerce/marketplace.service';

export interface AuctionSearchRequest {
  query?: string;
  category?: string;
  status?: AuctionStatus;
  minPrice?: number;
  maxPrice?: number;
  endingSoon?: boolean;
  page?: number;
  pageSize?: number;
}

export interface CreateAuctionRequest {
  productId: string;
  startingPrice: number;
  reservePrice?: number;
  buyItNowPrice?: number;
  startTime: string;
  endTime: string;
}

export interface PlaceBidRequest {
  amount: number;
  maxBid?: number;
}

@Injectable({ providedIn: 'root' })
export class AuctionService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/api/marketplace/auctions`;

  getAuction(id: string): Observable<Auction> {
    return this.http.get<Auction>(`${this.baseUrl}/${id}`);
  }

  getAuctionByNumber(auctionNumber: string): Observable<Auction> {
    return this.http.get<Auction>(`${this.baseUrl}/number/${auctionNumber}`);
  }

  searchAuctions(request: AuctionSearchRequest): Observable<PagedResult<Auction>> {
    let params = new HttpParams();
    Object.keys(request).forEach(key => {
      const val = (request as any)[key];
      if (val !== undefined && val !== null) params = params.set(key, val.toString());
    });
    return this.http.get<PagedResult<Auction>>(this.baseUrl, { params });
  }

  getEndingSoon(count = 10): Observable<Auction[]> {
    return this.http.get<Auction[]>(`${this.baseUrl}/ending-soon`, { params: { count } });
  }

  getFeaturedAuctions(count = 10): Observable<Auction[]> {
    return this.http.get<Auction[]>(`${this.baseUrl}/featured`, { params: { count } });
  }

  getBids(auctionId: string): Observable<Bid[]> {
    return this.http.get<Bid[]>(`${this.baseUrl}/${auctionId}/bids`);
  }

  getMyBids(): Observable<Bid[]> {
    return this.http.get<Bid[]>(`${this.baseUrl}/my/bids`);
  }

  createAuction(request: CreateAuctionRequest): Observable<Auction> {
    return this.http.post<Auction>(this.baseUrl, request);
  }

  placeBid(auctionId: string, request: PlaceBidRequest): Observable<Bid> {
    return this.http.post<Bid>(`${this.baseUrl}/${auctionId}/bid`, request);
  }

  buyItNow(auctionId: string): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/${auctionId}/buy-it-now`, {});
  }

  cancelAuction(auctionId: string, reason: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${auctionId}/cancel`, JSON.stringify(reason), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
