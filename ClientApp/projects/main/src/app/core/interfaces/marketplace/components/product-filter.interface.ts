import {
  MarketplaceCategory,
  ProductCondition,
  ListingType,
  ListingStatus
} from '../enums/marketplace-enums';

/**
 * Product Search/Filter Request
 */
export interface ProductSearchRequest {
  keywords: string | null;
  category: MarketplaceCategory | null;
  subCategory: string | null;
  condition: ProductCondition | null;
  listingType: ListingType | null;
  status: ListingStatus | null;
  minPrice: number | null;
  maxPrice: number | null;
  freeShipping: boolean | null;
  localPickupOnly: boolean | null;
  sellerId: string | null;
  make: string | null;
  model: string | null;
  year: number | null;
  sortBy: string | null;
  sortDescending: boolean;
  page: number;
  pageSize: number;
}
