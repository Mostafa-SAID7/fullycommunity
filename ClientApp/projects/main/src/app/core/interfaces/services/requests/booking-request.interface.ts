import { BookingStatus, ServiceCategory } from '../enums/service-enums';

/**
 * Create Booking Request
 */
export interface CreateBookingRequest {
  providerId: string;
  serviceCategory: ServiceCategory;
  serviceType: string;
  serviceDescription: string | null;
  scheduledStart: string;
  scheduledEnd: string;
  vehicleId: string | null;
  vehicleMake: string | null;
  vehicleModel: string | null;
  vehicleYear: number | null;
  licensePlate: string | null;
  serviceAddress: string | null;
  serviceLatitude: number | null;
  serviceLongitude: number | null;
  customerNotes: string | null;
  loyaltyPointsToRedeem: number;
}

/**
 * Update Booking Status Request
 */
export interface UpdateBookingStatusRequest {
  status: BookingStatus;
  notes: string | null;
}

/**
 * Create Time Slots Request
 */
export interface CreateTimeSlotsRequest {
  startDate: string;
  endDate: string;
  startTime: string; // TimeSpan
  endTime: string; // TimeSpan
  slotDurationMins: number;
  maxBookingsPerSlot: number;
  daysOfWeek: number[] | null;
}
