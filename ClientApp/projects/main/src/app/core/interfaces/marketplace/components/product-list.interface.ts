import { ProductCondition, MarketplaceCategory } from '../enums/marketplace-enums';

/**
 * Product List Item
 * Lightweight product for lists/grids
 */
export interface ProductListItem {
  id: string;
  title: string;
  primaryImageUrl: string | null;
  price: number;
  originalPrice: number | null;
  currency: string;
  condition: ProductCondition;
  category: MarketplaceCategory;
  sellerName: string;
  sellerRating: number;
  freeShipping: boolean;
  isFeatured: boolean;
  watchCount: number;
  publishedAt: string | null;
}
