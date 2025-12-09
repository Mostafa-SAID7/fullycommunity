import { OrderStatus, ShippingStatus } from '../enums/marketplace-enums';

/**
 * Order Search Request
 */
export interface OrderSearchRequest {
  status: OrderStatus | null;
  shippingStatus: ShippingStatus | null;
  fromDate: string | null;
  toDate: string | null;
  sortBy: string | null;
  sortDescending: boolean;
  page: number;
  pageSize: number;
}
