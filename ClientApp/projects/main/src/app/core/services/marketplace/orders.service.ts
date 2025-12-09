import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedResult } from '../../types/common.types';
import {
  Order,
  OrderSearchRequest,
  CreateOrderRequest,
  UpdateOrderStatusRequest,
  ShipOrderRequest
} from '../../interfaces/marketplace';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private readonly apiUrl = `${environment.apiUrl}/marketplace/orders`;

  constructor(private http: HttpClient) {}

  getById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  getByOrderNumber(orderNumber: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/number/${orderNumber}`);
  }

  search(request: OrderSearchRequest): Observable<PagedResult<Order>> {
    let params = new HttpParams();
    if (request.status !== null && request.status !== undefined) params = params.set('status', request.status.toString());
    if (request.shippingStatus !== null && request.shippingStatus !== undefined) params = params.set('shippingStatus', request.shippingStatus.toString());
    if (request.fromDate) params = params.set('fromDate', request.fromDate);
    if (request.toDate) params = params.set('toDate', request.toDate);
    if (request.sortBy) params = params.set('sortBy', request.sortBy);
    params = params.set('sortDescending', request.sortDescending.toString());
    params = params.set('page', request.page.toString());
    params = params.set('pageSize', request.pageSize.toString());
    return this.http.get<PagedResult<Order>>(this.apiUrl, { params });
  }

  create(request: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, request);
  }

  updateStatus(id: string, request: UpdateOrderStatusRequest): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}/status`, request);
  }

  ship(id: string, request: ShipOrderRequest): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/${id}/ship`, request);
  }

  cancel(id: string, reason: string): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/${id}/cancel`, { reason });
  }
}
