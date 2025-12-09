import { ProviderType, ServiceCategory, CurrencyCode } from '../enums/service-enums';

/**
 * Create Service Provider Request
 */
export interface CreateServiceProviderRequest {
  businessName: string;
  description: string | null;
  phone: string;
  email: string | null;
  website: string | null;
  address: string;
  city: string;
  state: string | null;
  country: string;
  postalCode: string | null;
  latitude: number;
  longitude: number;
  type: ProviderType;
  licenseNumber: string | null;
  taxId: string | null;
  operatingHoursJson: string | null;
  is24Hours: boolean;
  serviceCategories: ServiceCategory[];
}

/**
 * Update Service Provider Request
 */
export interface UpdateServiceProviderRequest {
  businessName: string | null;
  description: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  operatingHoursJson: string | null;
  is24Hours: boolean | null;
  serviceCategories: ServiceCategory[] | null;
}
