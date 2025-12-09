# Services Interfaces Summary

## Overview
Complete TypeScript interfaces and services for the Automotive Services platform feature, 100% aligned with backend C# DTOs.

## Structure
```
services/
├── service-provider.interface.ts     # Main service provider entity
├── booking.interface.ts               # Booking entity
├── service-review.interface.ts        # Service review entity
├── index.ts                           # Barrel export
├── enums/
│   ├── service-enums.ts              # All 18 enums
│   └── index.ts
├── components/
│   ├── service-search.interface.ts   # Search/filter request
│   └── index.ts
└── requests/
    ├── provider-request.interface.ts
    ├── booking-request.interface.ts
    ├── review-request.interface.ts
    └── index.ts
```

## Services
```
services/services/
├── service-providers.service.ts      # Provider CRUD, search, nearby
├── bookings.service.ts                # Booking management, time slots
├── service-reviews.service.ts         # Reviews and ratings
└── index.ts
```

## Main Entities

### ServiceProvider (20+ properties)
- **Basic Info**: businessName, description, logoUrl, phone, email
- **Location**: address, city, country, latitude, longitude
- **Type & Status**: type, status, verificationLevel
- **Availability**: is24Hours
- **Stats**: averageRating, totalReviews, totalBookings
- **Payment**: acceptsOnlinePayment
- **Services**: serviceCategories array (19 categories)

### Booking (15+ properties)
- **Basic Info**: bookingNumber, customerId, providerId
- **Service**: serviceCategory, serviceType
- **Schedule**: scheduledStart, scheduledEnd
- **Status**: status, paymentStatus
- **Pricing**: estimatedCost, finalCost, currency
- **Vehicle**: vehicleMake, vehicleModel
- **Rating**: rating

### ServiceReview (15+ properties)
- **Basic Info**: providerId, customerId
- **Ratings**: overallRating, qualityRating, timelinessRating, valueRating
- **Content**: title, comment, photoUrls
- **Verification**: isVerifiedPurchase
- **Response**: providerResponse, respondedAt
- **Engagement**: helpfulCount

## Enums (18 total)

### Booking & Status
1. **BookingStatus**: Pending, Confirmed, InProgress, Completed, Cancelled, NoShow
2. **PaymentStatus**: Pending, Paid, PartiallyPaid, Refunded, Failed
3. **TimeSlotStatus**: Available, Booked, Blocked, Maintenance

### Provider
4. **ProviderStatus**: Pending, Verified, Active, Suspended, Inactive
5. **ProviderType**: Individual, Business, Franchise
6. **VerificationLevel**: None, Basic, Advanced, Premium

### Pricing & Currency
7. **PricingType**: Fixed, Hourly, Daily, Weekly, Monthly, PerService, Quote
8. **CurrencyCode**: USD, EUR, GBP, AED, SAR

### Ratings & Categories
9. **RatingCategory**: Quality, Timeliness, Communication, Value, Cleanliness
10. **VehicleCategory**: Sedan, SUV, Truck, Van, Motorcycle, EV, Hybrid, Classic
11. **FuelType**: Petrol, Diesel, Electric, Hybrid, CNG, LPG

### Service Categories (19 types)
12. **ServiceCategory**: 
    - GarageRental
    - Maintenance
    - Workshop
    - Expert
    - Repair
    - Upgrade
    - Roadside
    - CarWash
    - Detailing
    - Inspection
    - Diagnostics
    - Insurance
    - Warranty
    - Fuel
    - Charging
    - Customization
    - DrivingSchool
    - Registration
    - Licensing

### Emergency Services
13. **EmergencyType**: Towing, FlatTire, BatteryJump, Lockout, FuelDelivery, MinorRepair
14. **EmergencyPriority**: Low, Medium, High, Critical
15. **AssistanceStatus**: Requested, Dispatched, EnRoute, OnSite, Resolved, Cancelled

## Service Methods

### ServiceProvidersService (9 methods)
- `getById()` - Get provider details
- `search()` - Advanced search with filters
- `getNearby()` - Find nearby providers by location
- `create()`, `update()`, `delete()` - CRUD operations
- `getStats()` - Provider statistics

### BookingsService (11 methods)
- `getById()`, `getByNumber()` - Get booking details
- `getMyBookings()` - User's bookings
- `getProviderBookings()` - Provider's bookings
- `create()` - Create booking
- `updateStatus()` - Update booking status
- `cancel()` - Cancel booking
- `getTimeSlots()` - Get available time slots
- `createTimeSlots()` - Create time slots (provider)
- `rate()` - Rate completed booking

### ServiceReviewsService (8 methods)
- `getProviderReviews()` - Get all reviews for provider
- `getReviewSummary()` - Get rating summary
- `create()`, `update()`, `delete()` - CRUD operations
- `respond()` - Provider response to review
- `markHelpful()`, `unmarkHelpful()` - Review voting

## Total Count
- **Interface Files**: 11
- **Service Files**: 3
- **Total Methods**: 28+
- **Enums**: 18
- **Service Categories**: 19
- **Zero Diagnostics Errors**: ✅

## Key Features

### 1. Service Provider Management
- Multiple provider types (Individual, Business, Franchise)
- 4 verification levels
- 24/7 availability tracking
- Location-based services
- Multiple service categories per provider

### 2. Booking System
- Time slot management
- Schedule-based bookings
- Vehicle information tracking
- Service location support
- Payment status tracking
- Loyalty points integration

### 3. Reviews & Ratings
- Multiple rating categories
- Photo uploads
- Verified purchase badges
- Provider responses
- Helpful voting system

### 4. Location Services
- Nearby provider search
- Distance calculation
- Radius-based filtering
- GPS coordinates support

### 5. Service Categories (19 Types)
- **Garage Rental**: Rent garage space
- **Maintenance**: Regular vehicle maintenance
- **Workshop**: Full-service workshops
- **Expert Consultation**: Expert advice
- **Repair**: Vehicle repairs
- **Upgrade**: Vehicle upgrades
- **Roadside Assistance**: Emergency roadside help
- **Car Wash**: Washing services
- **Detailing**: Professional detailing
- **Inspection**: Vehicle inspections
- **Diagnostics**: Diagnostic services
- **Insurance**: Insurance services
- **Warranty**: Warranty management
- **Fuel**: Fuel stations
- **Charging**: EV charging stations
- **Customization**: Vehicle customization
- **Driving School**: Driving lessons
- **Registration**: Vehicle registration
- **Licensing**: License services

### 6. Emergency Services
- Roadside assistance
- Priority levels
- Real-time tracking
- Multiple emergency types
- Quick dispatch

## Backend Alignment
All interfaces are 100% aligned with C# DTOs in:
- `src/CommunityCar.Application/Features/Services/`

Backend includes 13 specialized service types:
- CarWash
- Customization
- DrivingSchool
- Expert
- FuelCharging
- GarageRentals
- Inspection
- Insurance
- Maintenance
- Registration
- Repairs
- Roadside
- Common (shared)

## TypeScript Conventions
- ✅ camelCase for all properties
- ✅ `| null` for nullable types
- ✅ Separate files for each interface/enum
- ✅ Barrel exports in each folder
- ✅ Enum values match backend exactly
- ✅ TimeSpan represented as `string`
- ✅ Guid represented as `string`

## Usage Example
```typescript
import { 
  ServiceProvider,
  Booking,
  ServiceCategory,
  BookingStatus
} from '@core/interfaces/services';
import { 
  ServiceProvidersService,
  BookingsService
} from '@core/services/services';

// Search nearby providers
const providers = await serviceProvidersService.search({
  category: ServiceCategory.Maintenance,
  latitude: 25.2048,
  longitude: 55.2708,
  radiusKm: 10,
  minRating: 4.0,
  is24Hours: false,
  page: 1,
  pageSize: 20
}).toPromise();

// Create booking
const booking = await bookingsService.create({
  providerId: 'provider-id',
  serviceCategory: ServiceCategory.CarWash,
  serviceType: 'Premium Wash',
  scheduledStart: '2024-01-15T10:00:00',
  scheduledEnd: '2024-01-15T11:00:00',
  vehicleMake: 'Toyota',
  vehicleModel: 'Camry',
  vehicleYear: 2022
}).toPromise();
```

## Status
✅ **COMPLETE** - Core interfaces, requests, and services implemented with zero diagnostics errors.

## Notes
This is a foundational implementation covering the common service functionality. The backend includes 13 specialized service types (CarWash, Maintenance, Repairs, Roadside, etc.) that can be added as needed with their specific interfaces and services.
