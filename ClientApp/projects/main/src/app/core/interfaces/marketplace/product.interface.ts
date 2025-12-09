import {
  MarketplaceCategory,
  ListingType,
  ListingStatus,
  ProductCondition,
  WarrantyType
} from './enums/marketplace-enums';

/**
 * Product
 * Main marketplace product/listing entity
 */
export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerLogoUrl: string | null;
  sellerRating: number;
  
  // Basic Info
  title: string;
  subtitle: string | null;
  description: string;
  slug: string | null;
  sku: string;
  
  // Categorization
  category: MarketplaceCategory;
  subCategoryName: string | null;
  
  // Listing Details
  listingType: ListingType;
  status: ListingStatus;
  condition: ProductCondition;
  conditionDescription: string | null;
  
  // Pricing
  price: number;
  originalPrice: number | null;
  acceptsBestOffer: boolean;
  currency: string;
  
  // Inventory
  quantity: number;
  soldQuantity: number;
  
  // Media
  images: ProductImage[];
  videoUrl: string | null;
  
  // Vehicle Compatibility
  isUniversal: boolean;
  compatibility: VehicleCompatibility[];
  
  // Product Details
  brand: string | null;
  manufacturer: string | null;
  partNumber: string | null;
  oemNumber: string | null;
  
  // Warranty
  warrantyType: WarrantyType;
  warrantyMonths: number;
  
  // Shipping
  freeShipping: boolean;
  shippingCost: number | null;
  localPickupAvailable: boolean;
  shipsFrom: string | null;
  
  // Stats
  viewCount: number;
  watchCount: number;
  isFeatured: boolean;
  
  // Timestamps
  publishedAt: string | null;
  createdAt: string;
}

/**
 * Product Image
 */
export interface ProductImage {
  id: string;
  url: string;
  thumbnailUrl: string | null;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
}

/**
 * Vehicle Compatibility
 */
export interface VehicleCompatibility {
  make: string;
  model: string | null;
  yearFrom: number | null;
  yearTo: number | null;
  trim: string | null;
  engine: string | null;
}
