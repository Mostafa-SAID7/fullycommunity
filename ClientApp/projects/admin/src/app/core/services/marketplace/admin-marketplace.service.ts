import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  AdminMarketplaceProduct,
  AdminMarketplaceAuction,
  AdminMarketplaceSeller,
  AdminMarketplaceOrder,
  MarketplaceFilter,
  MarketplaceStatistics
} from '../../interfaces/marketplace/admin-marketplace.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminMarketplaceService {
  private readonly apiUrl = `${environment.apiUrl}/admin/marketplace`;

  constructor(private http: HttpClient) {}

  /**
   * Get products
   */
  getProducts(filter: MarketplaceFilter, page: number = 1, pageSize: number = 20): Observable<{ products: AdminMarketplaceProduct[], total: number }> {
    let params = this.buildFilterParams(filter, page, pageSize);
    return this.http.get<{ products: AdminMarketplaceProduct[], total: number }>(`${this.apiUrl}/products`, { params });
  }

  /**
   * Get auctions
   */
  getAuctions(filter: MarketplaceFilter, page: number = 1, pageSize: number = 20): Observable<{ auctions: AdminMarketplaceAuction[], total: number }> {
    let params = this.buildFilterParams(filter, page, pageSize);
    return this.http.get<{ auctions: AdminMarketplaceAuction[], total: number }>(`${this.apiUrl}/auctions`, { params });
  }

  /**
   * Get sellers
   */
  getSellers(filter: MarketplaceFilter, page: number = 1, pageSize: number = 20): Observable<{ sellers: AdminMarketplaceSeller[], total: number }> {
    let params = this.buildFilterParams(filter, page, pageSize);
    return this.http.get<{ sellers: AdminMarketplaceSeller[], total: number }>(`${this.apiUrl}/sellers`, { params });
  }

  /**
   * Get orders
   */
  getOrders(filter: MarketplaceFilter, page: number = 1, pageSize: number = 20): Observable<{ orders: AdminMarketplaceOrder[], total: number }> {
    let params = this.buildFilterParams(filter, page, pageSize);
    return this.http.get<{ orders: AdminMarketplaceOrder[], total: number }>(`${this.apiUrl}/orders`, { params });
  }

  /**
   * Get product by ID
   */
  getProduct(productId: string): Observable<AdminMarketplaceProduct> {
    return this.http.get<AdminMarketplaceProduct>(`${this.apiUrl}/products/${productId}`);
  }

  /**
   * Get seller by ID
   */
  getSeller(sellerId: string): Observable<AdminMarketplaceSeller> {
    return this.http.get<AdminMarketplaceSeller>(`${this.apiUrl}/sellers/${sellerId}`);
  }

  /**
   * Get order by ID
   */
  getOrder(orderId: string): Observable<AdminMarketplaceOrder> {
    return this.http.get<AdminMarketplaceOrder>(`${this.apiUrl}/orders/${orderId}`);
  }

  /**
   * Approve product
   */
  approveProduct(productId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/products/${productId}/approve`, {});
  }

  /**
   * Reject product
   */
  rejectProduct(productId: string, reason: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/products/${productId}/reject`, { reason });
  }

  /**
   * Flag product
   */
  flagProduct(productId: string, reason: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/products/${productId}/flag`, { reason });
  }

  /**
   * Hide product
   */
  hideProduct(productId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/products/${productId}/hide`, {});
  }

  /**
   * Delete product
   */
  deleteProduct(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${productId}`);
  }

  /**
   * Verify seller
   */
  verifySeller(sellerId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/sellers/${sellerId}/verify`, {});
  }

  /**
   * Suspend seller
   */
  suspendSeller(sellerId: string, reason: string, duration: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/sellers/${sellerId}/suspend`, { reason, duration });
  }

  /**
   * Ban seller
   */
  banSeller(sellerId: string, reason: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/sellers/${sellerId}/ban`, { reason });
  }

  /**
   * Cancel auction
   */
  cancelAuction(auctionId: string, reason: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/auctions/${auctionId}/cancel`, { reason });
  }

  /**
   * Suspend auction
   */
  suspendAuction(auctionId: string, reason: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/auctions/${auctionId}/suspend`, { reason });
  }

  /**
   * Cancel order
   */
  cancelOrder(orderId: string, reason: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/orders/${orderId}/cancel`, { reason });
  }

  /**
   * Refund order
   */
  refundOrder(orderId: string, amount: number, reason: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/orders/${orderId}/refund`, { amount, reason });
  }

  /**
   * Resolve dispute
   */
  resolveDispute(orderId: string, resolution: string, refundAmount: number | null): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/orders/${orderId}/resolve-dispute`, { resolution, refundAmount });
  }

  /**
   * Get marketplace statistics
   */
  getStatistics(): Observable<MarketplaceStatistics> {
    return this.http.get<MarketplaceStatistics>(`${this.apiUrl}/statistics`);
  }

  /**
   * Get moderation queue
   */
  getModerationQueue(page: number = 1, pageSize: number = 20): Observable<any> {
    return this.http.get(`${this.apiUrl}/moderation-queue`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Get reported items
   */
  getReportedItems(page: number = 1, pageSize: number = 20): Observable<any> {
    return this.http.get(`${this.apiUrl}/reported`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Get disputes
   */
  getDisputes(page: number = 1, pageSize: number = 20): Observable<any> {
    return this.http.get(`${this.apiUrl}/disputes`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Export marketplace data
   */
  exportData(filter: MarketplaceFilter, format: string = 'csv'): Observable<Blob> {
    let params = this.buildFilterParams(filter, 1, 10000);
    params = params.set('format', format);
    
    return this.http.get(`${this.apiUrl}/export`, {
      params,
      responseType: 'blob'
    });
  }

  /**
   * Build filter parameters
   */
  private buildFilterParams(filter: MarketplaceFilter, page: number, pageSize: number): HttpParams {
    let params = new HttpParams();
    params = params.set('page', page.toString());
    params = params.set('pageSize', pageSize.toString());
    
    if (filter.search) params = params.set('search', filter.search);
    if (filter.contentType !== null && filter.contentType !== undefined) params = params.set('contentType', filter.contentType.toString());
    if (filter.status !== null && filter.status !== undefined) params = params.set('status', filter.status.toString());
    if (filter.moderationStatus !== null && filter.moderationStatus !== undefined) params = params.set('moderationStatus', filter.moderationStatus.toString());
    if (filter.sellerId) params = params.set('sellerId', filter.sellerId);
    if (filter.category) params = params.set('category', filter.category);
    if (filter.priceMin !== null && filter.priceMin !== undefined) params = params.set('priceMin', filter.priceMin.toString());
    if (filter.priceMax !== null && filter.priceMax !== undefined) params = params.set('priceMax', filter.priceMax.toString());
    if (filter.dateFrom) params = params.set('dateFrom', filter.dateFrom);
    if (filter.dateTo) params = params.set('dateTo', filter.dateTo);
    if (filter.hasReports !== null && filter.hasReports !== undefined) params = params.set('hasReports', filter.hasReports.toString());
    if (filter.isFlagged !== null && filter.isFlagged !== undefined) params = params.set('isFlagged', filter.isFlagged.toString());
    
    return params;
  }
}