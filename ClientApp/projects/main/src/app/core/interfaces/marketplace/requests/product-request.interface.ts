import {
  MarketplaceCategory,
  ListingType,
  ProductCondition,
  WarrantyType
} from '../enums/marketplace-enums';
import { VehicleCompatibility } from '../product.interface';

/**
 * Create Product Request
 */
export interface CreateProductRequest {
  title: string;
  subtitle: string | null;
  description: string;
  sku: string;
  category: MarketplaceCategory;
  subCategoryName: string | null;
  listingType: ListingType;
  condition: ProductCondition;
  conditionDescription: string | null;
  price: number;
  originalPrice: number | null;
  acceptsBestOffer: boolean;
  currency: string;
  quantity: number;
  imageUrls: string[];
  videoUrl: string | null;
  isUniversal: boolean;
  compatibility: VehicleCompatibility[];
  brand: string | null;
  manufacturer: string | null;
  partNumber: string | null;
  oemNumber: string | null;
  warrantyType: WarrantyType;
  warrantyMonths: number;
  freeShipping: boolean;
  shippingCost: number | null;
  localPickupAvailable: boolean;
  shipsFrom: string | null;
}

/**
 * Update Product Request
 */
export interface UpdateProductRequest {
  title: string | null;
  subtitle: string | null;
  description: string | null;
  category: MarketplaceCategory | null;
  subCategoryName: string | null;
  condition: ProductCondition | null;
  conditionDescription: string | null;
  price: number | null;
  originalPrice: number | null;
  acceptsBestOffer: boolean | null;
  quantity: number | null;
  imageUrls: string[] | null;
  videoUrl: string | null;
  isUniversal: boolean | null;
  compatibility: VehicleCompatibility[] | null;
  brand: string | null;
  manufacturer: string | null;
  partNumber: string | null;
  oemNumber: string | null;
  warrantyType: WarrantyType | null;
  warrantyMonths: number | null;
  freeShipping: boolean | null;
  shippingCost: number | null;
  localPickupAvailable: boolean | null;
  shipsFrom: string | null;
}
