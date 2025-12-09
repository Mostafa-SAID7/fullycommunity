import {
  BookingStatus,
  PaymentStatus,
  ServiceCategory,
  CurrencyCode
} from './enums/service-enums';

/**
 * Booking
 * Service booking entity
 */
export interface Booking {
  id: string;
  bookingNumber: string;
  customerId: string;
  customerName: string;
  providerId: string;
  providerName: string;
  serviceCategory: ServiceCategory;
  serviceType: string;
  scheduledStart: string;
  scheduledEnd: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  estimatedCost: number;
  finalCost: number | null;
  currency: CurrencyCode;
  vehicleMake: string | null;
  vehicleModel: string | null;
  rating: number | null;
  createdAt: string;
}

/**
 * Time Slot
 */
export interface TimeSlot {
  id: string;
  date: string;
  startTime: string; // TimeSpan
  endTime: string; // TimeSpan
  status: number; // TimeSlotStatus
  maxBookings: number;
  currentBookings: number;
  specialPrice: number | null;
  isPeakHour: boolean;
}
