/**
 * Add To Cart Request
 */
export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

/**
 * Update Cart Item Request
 */
export interface UpdateCartItemRequest {
  quantity: number;
}

/**
 * Add To Wishlist Request
 */
export interface AddToWishlistRequest {
  productId: string;
  priceAlert: number | null;
  notifyOnPriceDrop: boolean;
  notifyOnBackInStock: boolean;
}
