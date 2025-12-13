// Interface matching backend DTO: MapLocationListDto
import { LocationType } from '../enums';

export interface MapLocationList {
  id: string;
  name: string;
  slug: string | null;
  latitude: number;
  longitude: number;
  city: string | null;
  type: LocationType;
  imageUrl: string | null;
  averageRating: number;
  reviewCount: number;
  isVerified: boolean;
}
