import { LocationType } from '../enums';

export interface CreateLocationRequest {
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  type: LocationType;
  imageUrl?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  openingHours?: string | null;
  isOpen24Hours: boolean;
  features?: string[];
}
