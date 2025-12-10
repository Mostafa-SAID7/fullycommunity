/**
 * Nearby Listings
 */
export interface NearbyListings {
  listings: NearbyListing[];
  userLocation: string | null;
  radiusKm: number;
  totalCount: number;
}

/**
 * Nearby Listing
 */
export interface NearbyListing {
  id: string;
  productId: string;
  title: string;
  imageUrl: string | null;
  price: number;
  currency: string;
  sellerName: string;
  location: string;
  distanceKm: number;
  listedAt: string;
}
