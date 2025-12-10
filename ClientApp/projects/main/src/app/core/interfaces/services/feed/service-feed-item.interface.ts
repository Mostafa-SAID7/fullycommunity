/**
 * Service Feed Item
 * Feed item specific to services section
 */
export interface ServiceFeedItem {
  id: string;
  serviceId: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  price: number;
  currency: string;
  
  // Provider
  providerId: string;
  providerName: string;
  providerAvatarUrl: string | null;
  providerVerified: boolean;
  providerRating: number;
  
  // Stats
  viewCount: number;
  bookingCount: number;
  reviewCount: number;
  
  // User Actions
  isFavorited: boolean;
  hasBooked: boolean;
  
  // Metadata
  category: string;
  location: string | null;
  tags: string[];
  
  // Availability
  isAvailable: boolean;
  nextAvailableSlot: string | null;
  
  // Relevance
  relevanceScore: number;
  recommendationReason: string | null;
}
