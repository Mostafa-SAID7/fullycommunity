/**
 * Suggested Services
 */
export interface SuggestedServices {
  services: SuggestedService[];
  suggestionReason: string;
  totalCount: number;
}

/**
 * Suggested Service
 */
export interface SuggestedService {
  id: string;
  serviceId: string;
  title: string;
  imageUrl: string | null;
  price: number;
  currency: string;
  providerName: string;
  providerRating: number;
  category: string;
  relevanceScore: number;
  suggestionReason: string;
  isAvailable: boolean;
}
