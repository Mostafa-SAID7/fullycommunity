import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// Product Models
export interface Product {
  id: string;
  sellerId: string;
  seller: SellerSummary;
  title: string;
  subtitle?: string;
  description: string;
  slug?: string;
  sku: string;
  category: MarketplaceCategory;
  subCategoryId?: string;
  subCategory?: ProductSubCategory;
  listingType: ListingType;
  status: ListingStatus;
  condition: ProductCondition;
  conditionDescription?: string;
  price: number;
  originalPrice?: number;
  minOfferPrice?: number;
  acceptsBestOffer: boolean;
  currency: string;
  quantity: number;
  soldQuantity: number;
  images: ProductImage[];
  videoUrl?: string;
  isUniversal: boolean;
  compatibility: VehicleCompatibility[];
  brand?: string;
  manufacturer?: string;
  partNumber?: string;
  oemNumber?: string;
  specifications?: Record<string, string>;
  weightKg?: number;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  warrantyType: WarrantyType;
  warrantyMonths: number;
  warrantyDescription?: string;
  freeShipping: boolean;
  shippingCost?: number;
  localPickupAvailable: boolean;
  shipsFrom?: string;
  shipsTo: string[];
  handlingDays: number;
  viewCount: number;
  watchCount: number;
  saveCount: number;
  inquiryCount: number;
  publishedAt?: string;
  expiresAt?: string;
  tags: string[];
  isFeatured: boolean;
  isPromoted: boolean;
  isInWishlist?: boolean;
  averageRating?: number;
  reviewCount?: number;
  createdAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  altText?: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface ProductSubCategory {
  id: string;
  name: string;
  slug: string;
  category: MarketplaceCategory;
}

export interface VehicleCompatibility {
  make: string;
  model: string;
  yearFrom?: number;
  yearTo?: number;
  trim?: string;
  engine?: string;
}

export interface SellerSummary {
  id: string;
  storeName: string;
  slug?: string;
  logoUrl?: string;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  sellerType: SellerType;
}

export interface Seller {
  id: string;
  userId: string;
  storeName: string;
  slug?: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  sellerType: SellerType;
  isVerified: boolean;
  verifiedAt?: string;
  rating: number;
  reviewCount: number;
  totalSales: number;
  totalProducts: number;
  responseRate: number;
  responseTime: string;
  shipsFrom?: string;
  returnPolicy?: string;
  websiteUrl?: string;
  phoneNumber?: string;
  email?: string;
  socialLinks?: Record<string, string>;
  createdAt: string;
}

export interface SellerStats {
  totalSales: number;
  totalRevenue: number;
  totalProducts: number;
  activeListings: number;
  pendingOrders: number;
  averageRating: number;
  salesThisMonth: number;
  viewsThisMonth: number;
}

// Cart Models
export interface Cart {
  items: CartItem[];
  subtotal: number;
  shippingTotal: number;
  taxTotal: number;
  total: number;
  itemCount: number;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  total: number;
  addedAt: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  addedAt: string;
}

// Order Models
export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  sellerId: string;
  seller: SellerSummary;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: OrderAddress;
  billingAddress?: OrderAddress;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentStatus: string;
  shippingMethod: ShippingMethod;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  notes?: string;
  createdAt: string;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productTitle: string;
  productImage?: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface OrderAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phoneNumber?: string;
}

// Auction Models
export interface Auction {
  id: string;
  auctionNumber: string;
  productId: string;
  product: Product;
  sellerId: string;
  seller: SellerSummary;
  status: AuctionStatus;
  startingPrice: number;
  reservePrice?: number;
  buyItNowPrice?: number;
  currentBid?: number;
  bidCount: number;
  highestBidderId?: string;
  startTime: string;
  endTime: string;
  hasReserve: boolean;
  reserveMet: boolean;
  isExtended: boolean;
  watchCount: number;
  createdAt: string;
}

export interface Bid {
  id: string;
  auctionId: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  maxBid?: number;
  status: BidStatus;
  createdAt: string;
}

// Review Models
export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title?: string;
  content: string;
  pros?: string[];
  cons?: string[];
  images?: string[];
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
}

// Enums
export type MarketplaceCategory = 'PartsServicing' | 'AccessoriesAutomobilia' | 'Auctions' | 'BooksDVD' | 
  'CarCareProducts' | 'CarCovers' | 'ClassicCarDealers' | 'EventsRallies' | 'FinanceInsurance' | 
  'FuelOils' | 'LifestyleAttire' | 'SpecialistsRestoration' | 'Storage' | 'Tools' | 
  'TrackdaysOrganisers' | 'Transport' | 'TyresWheels' | 'ValetingDetailing';

export type ListingStatus = 'Draft' | 'PendingApproval' | 'Active' | 'Sold' | 'Expired' | 'Suspended' | 'Deleted';
export type ListingType = 'FixedPrice' | 'Auction' | 'BestOffer' | 'Classified';
export type ProductCondition = 'New' | 'LikeNew' | 'Excellent' | 'Good' | 'Fair' | 'ForParts' | 'Refurbished';
export type SellerType = 'Individual' | 'Dealer' | 'Vendor' | 'Manufacturer';
export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded' | 'Disputed';
export type PaymentMethod = 'Card' | 'BankTransfer' | 'Cash' | 'Escrow' | 'Financing';
export type ShippingMethod = 'Standard' | 'Express' | 'Overnight' | 'Pickup' | 'FreightForwarder';
export type AuctionStatus = 'Scheduled' | 'Active' | 'Ended' | 'Sold' | 'Unsold' | 'Cancelled';
export type BidStatus = 'Active' | 'Outbid' | 'Won' | 'Lost' | 'Retracted';
export type WarrantyType = 'None' | 'Seller' | 'Manufacturer' | 'Extended' | 'Lifetime';

// Request Types
export interface ProductSearchRequest {
  query?: string;
  category?: MarketplaceCategory;
  subCategoryId?: string;
  sellerId?: string;
  condition?: ProductCondition;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  freeShipping?: boolean;
  localPickup?: boolean;
  make?: string;
  model?: string;
  year?: number;
  sortBy?: 'Relevance' | 'PriceLow' | 'PriceHigh' | 'Newest' | 'BestSelling' | 'Rating';
  page?: number;
  pageSize?: number;
}

export interface CreateProductRequest {
  title: string;
  subtitle?: string;
  description: string;
  category: MarketplaceCategory;
  subCategoryId?: string;
  condition: ProductCondition;
  price: number;
  originalPrice?: number;
  acceptsBestOffer?: boolean;
  minOfferPrice?: number;
  quantity?: number;
  brand?: string;
  manufacturer?: string;
  partNumber?: string;
  oemNumber?: string;
  specifications?: Record<string, string>;
  isUniversal?: boolean;
  compatibility?: VehicleCompatibility[];
  warrantyType?: WarrantyType;
  warrantyMonths?: number;
  freeShipping?: boolean;
  shippingCost?: number;
  localPickupAvailable?: boolean;
  tags?: string[];
}

export interface CreateOrderRequest {
  items: { productId: string; quantity: number }[];
  shippingAddress: OrderAddress;
  billingAddress?: OrderAddress;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

@Injectable({ providedIn: 'root' })
export class MarketplaceService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/api/marketplace`;

  // Products
  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`);
  }

  getProductBySlug(slug: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/slug/${slug}`);
  }

  searchProducts(request: ProductSearchRequest): Observable<PagedResult<Product>> {
    const params = this.buildParams(request);
    return this.http.get<PagedResult<Product>>(`${this.baseUrl}/products`, { params });
  }

  getProductsByCategory(category: MarketplaceCategory, page = 1, pageSize = 20): Observable<PagedResult<Product>> {
    return this.http.get<PagedResult<Product>>(`${this.baseUrl}/products/category/${category}`, { params: { page, pageSize } });
  }

  getFeaturedProducts(count = 10): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products/featured`, { params: { count } });
  }

  getRecentProducts(count = 10): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products/recent`, { params: { count } });
  }

  getRelatedProducts(productId: string, count = 10): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products/${productId}/related`, { params: { count } });
  }

  compareProducts(partNumber: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products/compare`, { params: { partNumber } });
  }

  createProduct(request: CreateProductRequest): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/products`, request);
  }

  updateProduct(id: string, request: Partial<CreateProductRequest>): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/products/${id}`, request);
  }

  publishProduct(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/products/${id}/publish`, {});
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/products/${id}`);
  }

  // Cart
  getCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.baseUrl}/cart`);
  }

  addToCart(productId: string, quantity = 1): Observable<CartItem> {
    return this.http.post<CartItem>(`${this.baseUrl}/cart/items`, { productId, quantity });
  }

  updateCartItem(itemId: string, quantity: number): Observable<CartItem> {
    return this.http.put<CartItem>(`${this.baseUrl}/cart/items/${itemId}`, { quantity });
  }

  removeFromCart(itemId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/cart/items/${itemId}`);
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/cart`);
  }

  // Wishlist
  getWishlist(): Observable<WishlistItem[]> {
    return this.http.get<WishlistItem[]>(`${this.baseUrl}/cart/wishlist`);
  }

  addToWishlist(productId: string): Observable<WishlistItem> {
    return this.http.post<WishlistItem>(`${this.baseUrl}/cart/wishlist`, { productId });
  }

  removeFromWishlist(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/cart/wishlist/${productId}`);
  }

  isInWishlist(productId: string): Observable<{ isInWishlist: boolean }> {
    return this.http.get<{ isInWishlist: boolean }>(`${this.baseUrl}/cart/wishlist/${productId}/check`);
  }

  moveToCart(productId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/cart/wishlist/${productId}/move-to-cart`, {});
  }

  // Orders
  getOrder(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/orders/${id}`);
  }

  getOrderByNumber(orderNumber: string): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/orders/number/${orderNumber}`);
  }

  getMyPurchases(page = 1, pageSize = 20, status?: OrderStatus): Observable<PagedResult<Order>> {
    const params: any = { page, pageSize };
    if (status) params.status = status;
    return this.http.get<PagedResult<Order>>(`${this.baseUrl}/orders/my/purchases`, { params });
  }

  getMySales(page = 1, pageSize = 20, status?: OrderStatus): Observable<PagedResult<Order>> {
    const params: any = { page, pageSize };
    if (status) params.status = status;
    return this.http.get<PagedResult<Order>>(`${this.baseUrl}/orders/my/sales`, { params });
  }

  createOrder(request: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/orders`, request);
  }

  updateOrderStatus(id: string, status: OrderStatus, notes?: string): Observable<Order> {
    return this.http.put<Order>(`${this.baseUrl}/orders/${id}/status`, { status, notes });
  }

  shipOrder(id: string, trackingNumber: string, trackingUrl?: string, carrier?: string): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/orders/${id}/ship`, { trackingNumber, trackingUrl, carrier });
  }

  markDelivered(id: string): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/orders/${id}/delivered`, {});
  }

  cancelOrder(id: string, reason: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/orders/${id}/cancel`, JSON.stringify(reason), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getShippingQuote(productId: string, postalCode: string, country: string): Observable<{ shippingCost: number }> {
    return this.http.get<{ shippingCost: number }>(`${this.baseUrl}/orders/shipping-quote`, {
      params: { productId, postalCode, country }
    });
  }

  // Sellers
  getSeller(id: string): Observable<Seller> {
    return this.http.get<Seller>(`${this.baseUrl}/sellers/${id}`);
  }

  getSellerBySlug(slug: string): Observable<Seller> {
    return this.http.get<Seller>(`${this.baseUrl}/sellers/slug/${slug}`);
  }

  searchSellers(query?: string, page = 1, pageSize = 20): Observable<PagedResult<Seller>> {
    const params: any = { page, pageSize };
    if (query) params.query = query;
    return this.http.get<PagedResult<Seller>>(`${this.baseUrl}/sellers`, { params });
  }

  getTopSellers(count = 10): Observable<Seller[]> {
    return this.http.get<Seller[]>(`${this.baseUrl}/sellers/top`, { params: { count } });
  }

  getSellerProducts(sellerId: string, page = 1, pageSize = 20): Observable<PagedResult<Product>> {
    return this.http.get<PagedResult<Product>>(`${this.baseUrl}/sellers/${sellerId}/products`, { params: { page, pageSize } });
  }

  getMySellerProfile(): Observable<Seller> {
    return this.http.get<Seller>(`${this.baseUrl}/sellers/me`);
  }

  getMySellerStats(): Observable<SellerStats> {
    return this.http.get<SellerStats>(`${this.baseUrl}/sellers/me/stats`);
  }

  createSellerProfile(storeName: string, description?: string, sellerType?: SellerType): Observable<Seller> {
    return this.http.post<Seller>(`${this.baseUrl}/sellers`, { storeName, description, sellerType });
  }

  updateSellerProfile(data: Partial<Seller>): Observable<Seller> {
    return this.http.put<Seller>(`${this.baseUrl}/sellers/me`, data);
  }

  // My Listings
  getMyListings(page = 1, pageSize = 20, status?: ListingStatus): Observable<PagedResult<Product>> {
    const params: any = { page, pageSize };
    if (status) params.status = status;
    return this.http.get<PagedResult<Product>>(`${this.baseUrl}/products/my`, { params });
  }

  // Reviews
  getProductReviews(productId: string, page = 1, pageSize = 20): Observable<PagedResult<ProductReview>> {
    return this.http.get<PagedResult<ProductReview>>(`${this.baseUrl}/reviews/product/${productId}`, { params: { page, pageSize } });
  }

  createReview(productId: string, rating: number, title: string, content: string, pros?: string[], cons?: string[]): Observable<ProductReview> {
    return this.http.post<ProductReview>(`${this.baseUrl}/reviews`, { productId, rating, title, content, pros, cons });
  }

  markReviewHelpful(reviewId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/reviews/${reviewId}/helpful`, {});
  }

  // Categories
  getCategories(): Observable<{ category: MarketplaceCategory; name: string; count: number }[]> {
    return this.http.get<{ category: MarketplaceCategory; name: string; count: number }[]>(`${this.baseUrl}/categories`);
  }

  getSubCategories(category: MarketplaceCategory): Observable<ProductSubCategory[]> {
    return this.http.get<ProductSubCategory[]>(`${this.baseUrl}/categories/${category}/subcategories`);
  }

  private buildParams(obj: any): HttpParams {
    let params = new HttpParams();
    Object.keys(obj).forEach(key => {
      if (obj[key] !== undefined && obj[key] !== null) {
        params = params.set(key, obj[key].toString());
      }
    });
    return params;
  }
}
