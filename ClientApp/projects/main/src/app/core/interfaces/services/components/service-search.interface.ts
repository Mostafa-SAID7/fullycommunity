import { ServiceCategory } from '../enums/service-enums';

/**
 * Service Search Request
 */
export interface ServiceSearchRequest {
  category: ServiceCategory | null;
  latitude: number | null;
  longitude: number | null;
  radiusKm: number | null;
  city: string | null;
  minRating: number | null;
  is24Hours: boolean | null;
  isVerified: boolean | null;
  sortBy: string | null;
  sortDescending: boolean;
  page: number;
  pageSize: number;
}
