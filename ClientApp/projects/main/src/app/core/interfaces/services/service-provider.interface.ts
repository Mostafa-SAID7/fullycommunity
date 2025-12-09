import {
  ProviderType,
  ProviderStatus,
  VerificationLevel,
  ServiceCategory
} from './enums/service-enums';

/**
 * Service Provider
 * Base service provider entity for all service types
 */
export interface ServiceProvider {
  id: string;
  businessName: string;
  description: string | null;
  logoUrl: string | null;
  phone: string;
  email: string | null;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  type: ProviderType;
  status: ProviderStatus;
  verificationLevel: VerificationLevel;
  is24Hours: boolean;
  averageRating: number;
  totalReviews: number;
  totalBookings: number;
  acceptsOnlinePayment: boolean;
  serviceCategories: ServiceCategory[];
}

/**
 * Nearby Provider
 * Lightweight provider for map/search results
 */
export interface NearbyProvider {
  id: string;
  businessName: string;
  logoUrl: string | null;
  address: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  averageRating: number;
  totalReviews: number;
  is24Hours: boolean;
  verificationLevel: VerificationLevel;
  serviceCategories: ServiceCategory[];
}
