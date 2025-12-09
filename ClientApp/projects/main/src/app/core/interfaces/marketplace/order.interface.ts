import {
  OrderStatus,
  PaymentMethod,
  ShippingMethod,
  ShippingStatus
} from './enums/marketplace-enums';

/**
 * Order
 * Marketplace order entity
 */
export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  status: OrderStatus;
  items: OrderItem[];
  
  // Pricing
  subtotal: number;
  shippingCost: number;
  taxAmount: number | null;
  discountAmount: number | null;
  totalAmount: number;
  currency: string;
  
  // Payment
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  paidAt: string | null;
  
  // Shipping
  shippingMethod: ShippingMethod;
  shippingStatus: ShippingStatus;
  trackingNumber: string | null;
  trackingUrl: string | null;
  carrier: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  estimatedDelivery: string | null;
  
  // Addresses
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress | null;
  
  // Notes
  buyerNotes: string | null;
  
  // Timestamps
  createdAt: string;
}

/**
 * Order Item
 */
export interface OrderItem {
  id: string;
  productId: string;
  productTitle: string;
  productSKU: string | null;
  productImageUrl: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

/**
 * Order Address
 */
export interface OrderAddress {
  fullName: string;
  company: string | null;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string | null;
  postalCode: string;
  country: string;
  phone: string;
  email: string | null;
}
