import { OfferStatus } from './enums/marketplace-enums';

/**
 * Offer
 * Best offer entity
 */
export interface Offer {
  id: string;
  productId: string;
  productTitle: string;
  productImageUrl: string | null;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  offerAmount: number;
  quantity: number;
  currency: string;
  status: OfferStatus;
  buyerMessage: string | null;
  sellerResponse: string | null;
  counterOfferAmount: number | null;
  counterOfferedAt: string | null;
  expiresAt: string;
  respondedAt: string | null;
  createdAt: string;
}
