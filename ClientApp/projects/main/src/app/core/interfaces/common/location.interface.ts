/**
 * Generic location/address interface
 * Used across Events, Maps, Pages, Groups, etc.
 */
export interface Location {
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  latitude: number | null;
  longitude: number | null;
}

/**
 * Simple location with just city and country
 */
export interface SimpleLocation {
  city: string | null;
  country: string | null;
}
