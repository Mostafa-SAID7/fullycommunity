// Interface matching backend DTO: MapLocationDto
import { LocationType, LocationStatus } from './map.enums';

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

// Interface matching backend DTO: MapLocationListDto
export interface MapLocationList {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  city: string | null;
  type: LocationType;
  imageUrl: string | null;
  averageRating: number;
  reviewCount: number;
  isVerified: boolean;
}
