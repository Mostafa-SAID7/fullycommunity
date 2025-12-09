import { LocationType } from '../../maps/enums';

/**
 * Popular map locations based on searches and check-ins
 */
export interface PopularLocation {
  id: string;
  name: string;
  type: LocationType;
  city: string | null;
  country: string | null;
  imageUrl: string | null;
  averageRating: number;
  reviewCount: number;
  checkInCount: number;
  searchCount: number; // How many times searched
  isVerified: boolean;
}
