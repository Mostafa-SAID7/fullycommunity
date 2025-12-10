/**
 * Suggested Products
 */
export interface SuggestedProducts {
  products: SuggestedProduct[];
  suggestionReason: string;
  totalCount: number;
}

/**
 * Suggested Product
 */
export interface SuggestedProduct {
  id: string;
  productId: string;
  title: string;
  imageUrl: string | null;
  price: number;
  currency: string;
  sellerName: string;
  sellerRating: number;
  condition: string;
  relevanceScore: number;
  suggestionReason: string;
  listedAt: string;
}
