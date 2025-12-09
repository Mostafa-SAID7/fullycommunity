import { SellerType, MarketplaceCategory } from '../enums/marketplace-enums';

/**
 * Create Seller Request
 */
export interface CreateSellerRequest {
  storeName: string;
  storeDescription: string | null;
  type: SellerType;
  businessPhone: string | null;
  businessEmail: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  businessRegistrationNumber: string | null;
  taxId: string | null;
  returnPolicy: string | null;
  shippingPolicy: string | null;
  returnDays: number;
  acceptsReturns: boolean;
  categories: MarketplaceCategory[];
}

/**
 * Update Seller Request
 */
export interface UpdateSellerRequest {
  storeName: string | null;
  storeDescription: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  businessPhone: string | null;
  businessEmail: string | null;
  website: string | null;
  returnPolicy: string | null;
  shippingPolicy: string | null;
  returnDays: number | null;
  acceptsReturns: boolean | null;
  categories: MarketplaceCategory[] | null;
}
