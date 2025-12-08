import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  Order,
  OrdersListResponse,
  OrderStats,
  UpdateOrderStatusRequest
} from '../../../interfaces/marketplace/orders/order-admin.interface';
import { ApiResponse } from '../../../interfaces/base/api-response.interface';

@Injectable({ providedIn: 'root' })
export class OrdersAdminService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/admin/dashboard/marketplace/orders`;

  getOrders(page = 1, pageSize = 20, status?: string, search?: string): Observable<OrdersListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    
    if (status) params = params.set('status', status);
    if (search) params = params.set('search', search);

    return this.http.get<OrdersListResponse>(this.apiUrl, { params });
  }

  getOrder(id: string): Observable<ApiResponse<Order>> {
    return this.http.get<ApiResponse<Order>>(`${this.apiUrl}/${id}`);
  }

  getOrderStats(): Observable<ApiResponse<OrderStats>> {
    return this.http.get<ApiResponse<OrderStats>>(`${this.apiUrl}/stats`);
  }

  updateOrderStatus(id: string, request: UpdateOrderStatusRequest): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${id}/status`, request);
  }

  cancelOrder(id: string, reason: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/${id}/cancel`, { reason });
  }

  refundOrder(id: string, amount: number, reason: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/${id}/refund`, { amount, reason });
  }

  exportOrders(startDate: string, endDate: string, format: 'csv' | 'pdf'): Observable<Blob> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate)
      .set('format', format);
    
    return this.http.get(`${this.apiUrl}/export`, { 
      params, 
      responseType: 'blob' 
    });
  }
}
