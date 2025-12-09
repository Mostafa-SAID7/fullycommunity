// Interface matching backend DTO: MapLocationDto
import { LocationType, LocationStatus } from './enums';

export interface MapLocation {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  latitude: number;
  longitude: number;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  type: LocationType;
  status: LocationStatus;
  imageUrl: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  openingHours: string | null;
  isOpen24Hours: boolean;
  features: string[];
  averageRating: number;
  reviewCount: number;
  checkInCount: number;
  isVerified: boolean;
  isSavedByCurrentUser: boolean;
  createdAt: string;
}
