import { OfferStatus } from '../enums/marketplace-enums';

/**
 * Offer Search Request
 */
export interface OfferSearchRequest {
  status: OfferStatus | null;
  asBuyer: boolean | null;
  asSeller: boolean | null;
  sortBy: string | null;
  sortDescending: boolean;
  page: number;
  pageSize: number;
}
