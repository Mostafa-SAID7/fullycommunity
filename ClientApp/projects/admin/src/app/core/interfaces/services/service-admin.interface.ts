import { BaseEntity } from '../base/entity.interface';
import { PagedResponse } from '../base/api-response.interface';
import { ServiceStatus } from '../common/enums.interface';

export type ServiceType = 'repair' | 'maintenance' | 'inspection' | 'customization' | 'consultation';

export interface Service extends BaseEntity {
  name: string;
  description: string;
  type: ServiceType;
  categoryId: string;
  categoryName: string;
  providerId: string;
  providerName: string;
  price: number;
  duration: number; // in minutes
  status: ServiceStatus;
  location: string;
  rating: number;
  reviewCount: number;
  bookingCount: number;
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
}

export interface ServiceBooking extends BaseEntity {
  bookingNumber: string;
  serviceId: string;
  serviceName: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  providerId: string;
  providerName: string;
  scheduledDate: string;
  scheduledTime: string;
  status: ServiceStatus;
  price: number;
  paymentStatus: string;
  notes?: string;
  vehicleInfo?: VehicleInfo;
}

export interface VehicleInfo {
  make: string;
  model: string;
  year: number;
  vin?: string;
  licensePlate?: string;
}

export interface ServicesListResponse extends PagedResponse<Service> {}

export interface BookingsListResponse extends PagedResponse<ServiceBooking> {}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  serviceCount: number;
  isActive: boolean;
}

export interface ServiceProvider {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  rating: number;
  reviewCount: number;
  serviceCount: number;
  isVerified: boolean;
  isActive: boolean;
}

export interface ServiceStats {
  totalServices: number;
  activeServices: number;
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  totalRevenue: number;
  revenueToday: number;
  revenueThisMonth: number;
}

export interface CreateServiceRequest {
  name: string;
  description: string;
  type: ServiceType;
  categoryId: string;
  price: number;
  duration: number;
  location: string;
}

export interface UpdateServiceRequest extends Partial<CreateServiceRequest> {
  status?: ServiceStatus;
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface UpdateBookingStatusRequest {
  status: ServiceStatus;
  notes?: string;
}
