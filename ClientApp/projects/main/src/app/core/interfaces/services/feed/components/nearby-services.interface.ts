/**
 * Nearby Services
 */
export interface NearbyServices {
  services: NearbyService[];
  userLocation: string | null;
  radiusKm: number;
  totalCount: number;
}

/**
 * Nearby Service
 */
export interface NearbyService {
  id: string;
  serviceId: string;
  title: string;
  imageUrl: string | null;
  price: number;
  currency: string;
  providerName: string;
  providerRating: number;
  location: string;
  distanceKm: number;
  category: string;
  isAvailable: boolean;
}
