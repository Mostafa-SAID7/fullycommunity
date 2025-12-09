/**
 * Booking Status
 */
export enum BookingStatus {
  Pending = 0,
  Confirmed = 1,
  InProgress = 2,
  Completed = 3,
  Cancelled = 4,
  NoShow = 5
}

/**
 * Payment Status
 */
export enum PaymentStatus {
  Pending = 0,
  Paid = 1,
  PartiallyPaid = 2,
  Refunded = 3,
  Failed = 4
}

/**
 * Time Slot Status
 */
export enum TimeSlotStatus {
  Available = 0,
  Booked = 1,
  Blocked = 2,
  Maintenance = 3
}

/**
 * Provider Status
 */
export enum ProviderStatus {
  Pending = 0,
  Verified = 1,
  Active = 2,
  Suspended = 3,
  Inactive = 4
}

/**
 * Provider Type
 */
export enum ProviderType {
  Individual = 0,
  Business = 1,
  Franchise = 2
}

/**
 * Verification Level
 */
export enum VerificationLevel {
  None = 0,
  Basic = 1,
  Advanced = 2,
  Premium = 3
}

/**
 * Pricing Type
 */
export enum PricingType {
  Fixed = 0,
  Hourly = 1,
  Daily = 2,
  Weekly = 3,
  Monthly = 4,
  PerService = 5,
  Quote = 6
}

/**
 * Currency Code
 */
export enum CurrencyCode {
  USD = 0,
  EUR = 1,
  GBP = 2,
  AED = 3,
  SAR = 4
}

/**
 * Rating Category
 */
export enum RatingCategory {
  Quality = 0,
  Timeliness = 1,
  Communication = 2,
  Value = 3,
  Cleanliness = 4
}

/**
 * Vehicle Category
 */
export enum VehicleCategory {
  Sedan = 0,
  SUV = 1,
  Truck = 2,
  Van = 3,
  Motorcycle = 4,
  EV = 5,
  Hybrid = 6,
  Classic = 7
}

/**
 * Fuel Type
 */
export enum FuelType {
  Petrol = 0,
  Diesel = 1,
  Electric = 2,
  Hybrid = 3,
  CNG = 4,
  LPG = 5
}

/**
 * Service Category
 */
export enum ServiceCategory {
  GarageRental = 0,
  Maintenance = 1,
  Workshop = 2,
  Expert = 3,
  Repair = 4,
  Upgrade = 5,
  Roadside = 6,
  CarWash = 7,
  Detailing = 8,
  Inspection = 9,
  Diagnostics = 10,
  Insurance = 11,
  Warranty = 12,
  Fuel = 13,
  Charging = 14,
  Customization = 15,
  DrivingSchool = 16,
  Registration = 17,
  Licensing = 18
}

/**
 * Emergency Type
 */
export enum EmergencyType {
  Towing = 0,
  FlatTire = 1,
  BatteryJump = 2,
  Lockout = 3,
  FuelDelivery = 4,
  MinorRepair = 5
}

/**
 * Emergency Priority
 */
export enum EmergencyPriority {
  Low = 0,
  Medium = 1,
  High = 2,
  Critical = 3
}

/**
 * Assistance Status
 */
export enum AssistanceStatus {
  Requested = 0,
  Dispatched = 1,
  EnRoute = 2,
  OnSite = 3,
  Resolved = 4,
  Cancelled = 5
}
