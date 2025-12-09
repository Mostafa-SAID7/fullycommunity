import { PaymentMethod, ShippingMethod, OrderStatus } from '../enums/marketplace-enums';
import { OrderAddress } from '../order.interface';

/**
 * Create Order Request
 */
export interface CreateOrderRequest {
  sellerId: string;
  items: CreateOrderItemRequest[];
  paymentMethod: PaymentMethod;
  shippingMethod: ShippingMethod;
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress | null;
  buyerNotes: string | null;
  couponCode: string | null;
}

/**
 * Create Order Item Request
 */
export interface CreateOrderItemRequest {
  productId: string;
  quantity: number;
}

/**
 * Update Order Status Request
 */
export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  notes: string | null;
}

/**
 * Ship Order Request
 */
export interface ShipOrderRequest {
  carrier: string;
  trackingNumber: string;
  trackingUrl: string | null;
  estimatedDelivery: string | null;
}
