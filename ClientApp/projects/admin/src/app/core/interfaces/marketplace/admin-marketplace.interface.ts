/**
 * Admin Marketplace Management
 * Marketplace administration
 */

/**
 * Moderation Status
 */
export enum ModerationStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
  Flagged = 3,
  UnderReview = 4,
  RequiresAction = 5
}

/**
 * Category Stats
 */
export interface CategoryStats {
  category: string;
  postCount: number;
  engagementRate: number;
}
export interface AdminMarketplaceProduct {
  id: string;
  title: string;
  description: string;
  sellerId: string;
  sellerName: string;
  sellerVerified: boolean;
  
  // Product Details
  price: number;
  currency: string;
  condition: string;
  category: string;
  subcategory: string | null;
  
  // Vehicle Compatibility
  vehicleMake: string | null;
  vehicleModel: string | null;
  vehicleYear: number | null;
  
  // Status
  status: AdminProductStatus;
  moderationStatus: ModerationStatus;
  
  // Stats
  viewCount: number;
  favoriteCount: number;
  inquiryCount: number;
  reportCount: number;
  
  // Media
  imageUrls: string[];
  thumbnailUrl: string | null;
  
  // Location
  location: string | null;
  shippingOptions: string[];
  
  // Moderation
  flaggedAt: string | null;
  reviewedAt: string | null;
  reviewedBy: string | null;
  moderationNotes: string | null;
  
  // Timestamps
  listedAt: string;
  updatedAt: string;
  soldAt: string | null;
}

/**
 * Admin Product Status
 */
export enum AdminProductStatus {
  Active = 0,
  Sold = 1,
  Expired = 2,
  Paused = 3,
  Deleted = 4,
  Hidden = 5,
  Flagged = 6,
  Pending = 7
}

/**
 * Admin Marketplace Auction
 */
export interface AdminMarketplaceAuction {
  id: string;
  title: string;
  description: string;
  sellerId: string;
  sellerName: string;
  
  // Auction Details
  startingBid: number;
  currentBid: number;
  reservePrice: number | null;
  currency: string;
  
  // Timing
  startTime: string;
  endTime: string;
  
  // Status
  status: AdminAuctionStatus;
  moderationStatus: ModerationStatus;
  
  // Stats
  bidCount: number;
  bidderCount: number;
  viewCount: number;
  watcherCount: number;
  reportCount: number;
  
  // Product Info
  category: string;
  condition: string;
  
  // Media
  imageUrls: string[];
  thumbnailUrl: string | null;
  
  // Moderation
  flaggedAt: string | null;
  reviewedAt: string | null;
  moderationNotes: string | null;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * Admin Auction Status
 */
export enum AdminAuctionStatus {
  Scheduled = 0,
  Active = 1,
  Ended = 2,
  Cancelled = 3,
  Suspended = 4,
  Completed = 5
}

/**
 * Admin Marketplace Seller
 */
export interface AdminMarketplaceSeller {
  id: string;
  userId: string;
  userName: string;
  businessName: string | null;
  
  // Seller Details
  sellerType: SellerType;
  verificationStatus: SellerVerificationStatus;
  
  // Status
  status: AdminSellerStatus;
  
  // Stats
  productCount: number;
  soldCount: number;
  rating: number;
  reviewCount: number;
  reportCount: number;
  
  // Financial
  totalRevenue: number;
  pendingPayouts: number;
  
  // Verification
  documentsSubmitted: boolean;
  businessVerified: boolean;
  
  // Moderation
  warningCount: number;
  suspensionCount: number;
  
  // Timestamps
  joinedAt: string;
  lastActiveAt: string | null;
  verifiedAt: string | null;
}

/**
 * Seller Type
 */
export enum SellerType {
  Individual = 0,
  Business = 1,
  Dealer = 2,
  Manufacturer = 3
}

/**
 * Seller Verification Status
 */
export enum SellerVerificationStatus {
  Unverified = 0,
  Pending = 1,
  Verified = 2,
  Rejected = 3,
  Suspended = 4
}

/**
 * Admin Seller Status
 */
export enum AdminSellerStatus {
  Active = 0,
  Inactive = 1,
  Suspended = 2,
  Banned = 3,
  UnderReview = 4
}

/**
 * Admin Marketplace Order
 */
export interface AdminMarketplaceOrder {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  
  // Order Details
  productId: string;
  productTitle: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  currency: string;
  
  // Status
  status: AdminOrderStatus;
  paymentStatus: PaymentStatus;
  shippingStatus: ShippingStatus;
  
  // Addresses
  shippingAddress: string;
  billingAddress: string | null;
  
  // Tracking
  trackingNumber: string | null;
  carrier: string | null;
  
  // Timestamps
  orderedAt: string;
  paidAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  
  // Disputes
  hasDispute: boolean;
  disputeReason: string | null;
}

/**
 * Admin Order Status
 */
export enum AdminOrderStatus {
  Pending = 0,
  Confirmed = 1,
  Processing = 2,
  Shipped = 3,
  Delivered = 4,
  Cancelled = 5,
  Refunded = 6,
  Disputed = 7
}

/**
 * Payment Status
 */
export enum PaymentStatus {
  Pending = 0,
  Paid = 1,
  Failed = 2,
  Refunded = 3,
  PartiallyRefunded = 4
}

/**
 * Shipping Status
 */
export enum ShippingStatus {
  NotShipped = 0,
  Processing = 1,
  Shipped = 2,
  InTransit = 3,
  Delivered = 4,
  Failed = 5
}

/**
 * Marketplace Filter
 */
export interface MarketplaceFilter {
  search: string | null;
  contentType: MarketplaceContentType | null;
  status: AdminProductStatus | null;
  moderationStatus: ModerationStatus | null;
  sellerId: string | null;
  category: string | null;
  priceMin: number | null;
  priceMax: number | null;
  dateFrom: string | null;
  dateTo: string | null;
  hasReports: boolean | null;
  isFlagged: boolean | null;
}

/**
 * Marketplace Content Type
 */
export enum MarketplaceContentType {
  Product = 0,
  Auction = 1,
  Order = 2,
  Seller = 3
}

/**
 * Marketplace Statistics
 */
export interface MarketplaceStatistics {
  totalProducts: number;
  totalAuctions: number;
  totalSellers: number;
  totalOrders: number;
  
  // Status Breakdown
  activeProducts: number;
  soldProducts: number;
  flaggedProducts: number;
  
  // Financial
  totalRevenue: number;
  averageOrderValue: number;
  totalTransactions: number;
  
  // Moderation
  pendingModeration: number;
  reportedItems: number;
  
  // Growth
  newProductsToday: number;
  newProductsThisWeek: number;
  newProductsThisMonth: number;
  
  // Top Categories
  topCategories: CategoryStats[];
  
  // Top Sellers
  topSellers: SellerStats[];
}

/**
 * Seller Stats
 */
export interface SellerStats {
  sellerId: string;
  sellerName: string;
  productCount: number;
  revenue: number;
  rating: number;
}