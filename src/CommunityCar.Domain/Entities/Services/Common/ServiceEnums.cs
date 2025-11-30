namespace CommunityCar.Domain.Entities.Services.Common;

// Booking & Scheduling
public enum BookingStatus { Pending, Confirmed, InProgress, Completed, Cancelled, NoShow }
public enum PaymentStatus { Pending, Paid, PartiallyPaid, Refunded, Failed }
public enum TimeSlotStatus { Available, Booked, Blocked, Maintenance }

// Service Provider
public enum ProviderStatus { Pending, Verified, Active, Suspended, Inactive }
public enum ProviderType { Individual, Business, Franchise }
public enum VerificationLevel { None, Basic, Advanced, Premium }

// Pricing
public enum PricingType { Fixed, Hourly, Daily, Weekly, Monthly, PerService, Quote }
public enum CurrencyCode { USD, EUR, GBP, AED, SAR }

// Ratings
public enum RatingCategory { Quality, Timeliness, Communication, Value, Cleanliness }

// Vehicle Types
public enum VehicleCategory { Sedan, SUV, Truck, Van, Motorcycle, EV, Hybrid, Classic }
public enum FuelType { Petrol, Diesel, Electric, Hybrid, CNG, LPG }

// Service Categories
public enum ServiceCategory 
{ 
    GarageRental, 
    Maintenance, 
    Workshop, 
    Expert, 
    Repair, 
    Upgrade, 
    Roadside, 
    CarWash, 
    Detailing, 
    Inspection, 
    Diagnostics, 
    Insurance, 
    Warranty, 
    Fuel, 
    Charging, 
    Customization, 
    DrivingSchool, 
    Registration, 
    Licensing 
}

// Emergency
public enum EmergencyType { Towing, FlatTire, BatteryJump, Lockout, FuelDelivery, MinorRepair }
public enum EmergencyPriority { Low, Medium, High, Critical }
public enum AssistanceStatus { Requested, Dispatched, EnRoute, OnSite, Resolved, Cancelled }
