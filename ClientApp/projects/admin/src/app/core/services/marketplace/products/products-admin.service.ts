import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  Product,
  ProductsListResponse,
  ProductCategory,
  ProductBrand,
  ProductStats,
  CreateProductRequest,
  UpdateProductRequest
} from '../../../interfaces/marketplace/products/product-admin.interface';
import { ApiResponse } from '../../../interfaces/base/api-response.interface';

@Injectable({ providedIn: 'root' })
export class ProductsAdminService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/admin/dashboard/marketplace/products`;

  getProducts(page = 1, pageSize = 20, status?: string, search?: string, categoryId?: string): Observable<ProductsListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    
    if (status) params = params.set('status', status);
    if (search) params = params.set('search', search);
    if (categoryId) params = params.set('categoryId', categoryId);

    return this.http.get<ProductsListResponse>(this.apiUrl, { params });
  }

  getProduct(id: string): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/${id}`);
  }

  getProductStats(): Observable<ApiResponse<ProductStats>> {
    return this.http.get<ApiResponse<ProductStats>>(`${this.apiUrl}/stats`);
  }

  createProduct(request: CreateProductRequest): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(this.apiUrl, request);
  }

  updateProduct(id: string, request: UpdateProductRequest): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${id}`, request);
  }

  deleteProduct(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  approveProduct(id: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/${id}/approve`, {});
  }

  rejectProduct(id: string, reason: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/${id}/reject`, { reason });
  }

  featureProduct(id: string, featured: boolean): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/${id}/feature`, { featured });
  }

  // Categories
  getCategories(): Observable<ApiResponse<ProductCategory[]>> {
    return this.http.get<ApiResponse<ProductCategory[]>>(`${this.apiUrl}/categories`);
  }

  createCategory(name: string, description?: string, parentId?: string): Observable<ApiResponse<ProductCategory>> {
    return this.http.post<ApiResponse<ProductCategory>>(`${this.apiUrl}/categories`, { name, description, parentId });
  }

  updateCategory(id: string, name: string, description?: string): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/categories/${id}`, { name, description });
  }

  deleteCategory(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/categories/${id}`);
  }

  // Brands
  getBrands(): Observable<ApiResponse<ProductBrand[]>> {
    return this.http.get<ApiResponse<ProductBrand[]>>(`${this.apiUrl}/brands`);
  }

  createBrand(name: string, logo?: string): Observable<ApiResponse<ProductBrand>> {
    return this.http.post<ApiResponse<ProductBrand>>(`${this.apiUrl}/brands`, { name, logo });
  }

  updateBrand(id: string, name: string, logo?: string): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/brands/${id}`, { name, logo });
  }

  deleteBrand(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/brands/${id}`);
  }
}
