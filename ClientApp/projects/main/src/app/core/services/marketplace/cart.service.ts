import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedResult } from '../../types/common.types';
import {
  Cart,
  WishlistItem,
  AddToCartRequest,
  UpdateCartItemRequest,
  AddToWishlistRequest
} from '../../interfaces/marketplace';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly apiUrl = `${environment.apiUrl}/marketplace/cart`;

  constructor(private http: HttpClient) {}

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl);
  }

  addToCart(request: AddToCartRequest): Observable<Cart> {
    return this.http.post<Cart>(this.apiUrl, request);
  }

  updateCartItem(itemId: string, request: UpdateCartItemRequest): Observable<Cart> {
    return this.http.put<Cart>(`${this.apiUrl}/${itemId}`, request);
  }

  removeFromCart(itemId: string): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/${itemId}`);
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(this.apiUrl);
  }

  getWishlist(page: number = 1, pageSize: number = 20): Observable<PagedResult<WishlistItem>> {
    return this.http.get<PagedResult<WishlistItem>>(`${this.apiUrl}/wishlist`, {
      params: { page: page.toString(), pageSize: pageSize.toString() }
    });
  }

  addToWishlist(request: AddToWishlistRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/wishlist`, request);
  }

  removeFromWishlist(itemId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/wishlist/${itemId}`);
  }
}
