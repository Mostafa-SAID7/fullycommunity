/**
 * Cart Item
 */
export interface CartItem {
  id: string;
  productId: string;
  productTitle: string;
  productImageUrl: string | null;
  sellerName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: string;
  availableQuantity: number;
  isAvailable: boolean;
  addedAt: string;
}

/**
 * Cart
 */
export interface Cart {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  currency: string;
}

/**
 * Wishlist Item
 */
export interface WishlistItem {
  id: string;
  productId: string;
  productTitle: string;
  productImageUrl: string | null;
  sellerName: string;
  price: number;
  originalPrice: number | null;
  currency: string;
  isAvailable: boolean;
  priceAlert: number | null;
  notifyOnPriceDrop: boolean;
  addedAt: string;
}
