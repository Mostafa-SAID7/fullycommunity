using CommunityCar.Domain.Entities.Services.Common;
using CommunityCar.Domain.Entities.Services.Expert;
using CommunityCar.Domain.Entities.Services.FuelCharging;
using CommunityCar.Domain.Entities.Services.Maintenance;
using CommunityCar.Infrastructure.Data.Seeding.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CommunityCar.Infrastructure.Data.Seeding.Content;

public class ServicesSeeder : BaseSeeder
{
    public ServicesSeeder(AppDbContext context, ILogger<ServicesSeeder> logger) 
        : base(context, logger) { }

    public override int Order => 60;
    public override string Name => "Services Seeder";

    public override async Task<bool> ShouldSeedAsync()
    {
        return !await Context.Set<Workshop>().AnyAsync();
    }

    protected override async Task ExecuteSeedAsync()
    {
        // Seed Service Providers first
        var providers = CreateServiceProviders();
        await Context.Set<ServiceProvider>().AddRangeAsync(providers);
        await Context.SaveChangesAsync();

        // Seed Workshops
        var workshops = CreateWorkshops(providers);
        await Context.Set<Workshop>().AddRangeAsync(workshops);

        // Seed Fuel Stations
        var fuelStations = CreateFuelStations(providers);
        await Context.Set<FuelStation>().AddRangeAsync(fuelStations);

        // Seed Experts
        var experts = CreateExperts();
        await Context.Set<Expert>().AddRangeAsync(experts);
    }

    private static List<ServiceProvider> CreateServiceProviders()
    {
        return
        [
            new ServiceProvider
            {
                Id = Guid.NewGuid(),
                OwnerId = Guid.NewGuid(),
                BusinessName = "Classic Car Restoration Shop",
                Description = "Specializing in classic American muscle car restoration",
                Phone = "+1-313-555-0101",
                Email = "info@classiccarrestoration.com",
                Website = "https://classiccarrestoration.com",
                Address = "1234 Restoration Lane",
                City = "Detroit",
                State = "MI",
                Country = "USA",
                PostalCode = "48201",
                Latitude = 42.3314,
                Longitude = -83.0458,
                Type = ProviderType.Business,
                Status = ProviderStatus.Active,
                VerificationLevel = VerificationLevel.Premium,
                AverageRating = 4.9,
                TotalReviews = 127,
                Is24Hours = false,
                ServiceCategories = [ServiceCategory.Workshop, ServiceCategory.Repair, ServiceCategory.Customization],
                VerifiedAt = DateTime.UtcNow.AddMonths(-12),
                CreatedAt = DateTime.UtcNow.AddMonths(-18)
            },
            new ServiceProvider
            {
                Id = Guid.NewGuid(),
                OwnerId = Guid.NewGuid(),
                BusinessName = "Euro Performance Garage",
                Description = "European sports car specialists - BMW, Mercedes, Porsche, Audi",
                Phone = "+1-310-555-0202",
                Email = "service@europerformance.com",
                Website = "https://europerformance.com",
                Address = "567 Performance Drive",
                City = "Los Angeles",
                State = "CA",
                Country = "USA",
                PostalCode = "90001",
                Latitude = 34.0522,
                Longitude = -118.2437,
                Type = ProviderType.Business,
                Status = ProviderStatus.Active,
                VerificationLevel = VerificationLevel.Advanced,
                AverageRating = 4.8,
                TotalReviews = 89,
                ServiceCategories = [ServiceCategory.Workshop, ServiceCategory.Maintenance, ServiceCategory.Diagnostics],
                VerifiedAt = DateTime.UtcNow.AddMonths(-8),
                CreatedAt = DateTime.UtcNow.AddMonths(-12)
            },
            new ServiceProvider
            {
                Id = Guid.NewGuid(),
                OwnerId = Guid.NewGuid(),
                BusinessName = "JDM Import Specialists",
                Description = "Japanese import vehicles - RHD conversions and JDM parts",
                Phone = "+1-713-555-0303",
                Email = "hello@jdmimport.com",
                Address = "890 Import Way",
                City = "Houston",
                State = "TX",
                Country = "USA",
                PostalCode = "77001",
                Latitude = 29.7604,
                Longitude = -95.3698,
                Type = ProviderType.Business,
                Status = ProviderStatus.Active,
                VerificationLevel = VerificationLevel.Advanced,
                AverageRating = 4.7,
                TotalReviews = 156,
                ServiceCategories = [ServiceCategory.Workshop, ServiceCategory.Customization],
                VerifiedAt = DateTime.UtcNow.AddMonths(-20),
                CreatedAt = DateTime.UtcNow.AddMonths(-24)
            },
            new ServiceProvider
            {
                Id = Guid.NewGuid(),
                OwnerId = Guid.NewGuid(),
                BusinessName = "EV Service Center",
                Description = "Certified electric vehicle service - Tesla, Rivian, and all major EV brands",
                Phone = "+1-415-555-0404",
                Email = "support@evservicecenter.com",
                Website = "https://evservicecenter.com",
                Address = "321 Electric Avenue",
                City = "San Francisco",
                State = "CA",
                Country = "USA",
                PostalCode = "94102",
                Latitude = 37.7749,
                Longitude = -122.4194,
                Type = ProviderType.Business,
                Status = ProviderStatus.Active,
                VerificationLevel = VerificationLevel.Premium,
                AverageRating = 4.9,
                TotalReviews = 203,
                ServiceCategories = [ServiceCategory.Workshop, ServiceCategory.Maintenance, ServiceCategory.Charging],
                VerifiedAt = DateTime.UtcNow.AddMonths(-6),
                CreatedAt = DateTime.UtcNow.AddMonths(-8)
            },
            new ServiceProvider
            {
                Id = Guid.NewGuid(),
                OwnerId = Guid.NewGuid(),
                BusinessName = "Quick Lube Express",
                Description = "Fast and affordable oil changes - no appointment needed",
                Phone = "+1-312-555-0505",
                Address = "456 Service Road",
                City = "Chicago",
                State = "IL",
                Country = "USA",
                PostalCode = "60601",
                Latitude = 41.8781,
                Longitude = -87.6298,
                Type = ProviderType.Franchise,
                Status = ProviderStatus.Active,
                VerificationLevel = VerificationLevel.Basic,
                AverageRating = 4.3,
                TotalReviews = 412,
                Is24Hours = false,
                ServiceCategories = [ServiceCategory.Maintenance],
                CreatedAt = DateTime.UtcNow.AddMonths(-36)
            }
        ];
    }

    private static List<Workshop> CreateWorkshops(List<ServiceProvider> providers)
    {
        return
        [
            new Workshop
            {
                Id = Guid.NewGuid(),
                ProviderId = providers[0].Id,
                Name = "Classic Car Restoration Shop",
                Description = "Full frame-off restorations, engine rebuilds, and custom fabrication",
                Specialties = [WorkshopSpecialty.BodyWork, WorkshopSpecialty.Paint, WorkshopSpecialty.Engine],
                BrandsServiced = ["Ford", "Chevrolet", "Dodge", "Plymouth", "Pontiac"],
                VehicleTypesServiced = [VehicleCategory.Classic, VehicleCategory.Sedan],
                Certifications = ["ASE Certified", "I-CAR Gold"],
                ServiceBays = 8,
                MechanicsCount = 12,
                AverageWaitTimeMins = 1440,
                HasDiagnosticEquipment = true,
                OffersPickupDelivery = true,
                HasWaitingArea = true,
                OffersWarranty = true,
                WarrantyDays = 365,
                LaborRatePerHour = 125.00m,
                UsesOEMParts = true,
                UsesAftermarketParts = true,
                CreatedAt = DateTime.UtcNow.AddMonths(-18)
            },
            new Workshop
            {
                Id = Guid.NewGuid(),
                ProviderId = providers[1].Id,
                Name = "Euro Performance Garage",
                Description = "ECU tuning, suspension upgrades, brake systems, exhaust systems",
                Specialties = [WorkshopSpecialty.Performance, WorkshopSpecialty.Diagnostics, WorkshopSpecialty.Suspension, WorkshopSpecialty.Brakes],
                BrandsServiced = ["BMW", "Mercedes-Benz", "Porsche", "Audi", "Volkswagen"],
                VehicleTypesServiced = [VehicleCategory.Sedan, VehicleCategory.SUV],
                IsOEMCertified = true,
                Certifications = ["BMW Certified", "Mercedes-Benz Certified", "Porsche Certified"],
                ServiceBays = 6,
                MechanicsCount = 8,
                AverageWaitTimeMins = 240,
                HasDiagnosticEquipment = true,
                OffersPickupDelivery = true,
                HasLoanerCars = true,
                HasWaitingArea = true,
                OffersWarranty = true,
                WarrantyDays = 180,
                LaborRatePerHour = 150.00m,
                UsesOEMParts = true,
                CreatedAt = DateTime.UtcNow.AddMonths(-12)
            },
            new Workshop
            {
                Id = Guid.NewGuid(),
                ProviderId = providers[2].Id,
                Name = "JDM Import Specialists",
                Description = "RHD conversion, JDM parts, engine swaps, turbo kits",
                Specialties = [WorkshopSpecialty.Engine, WorkshopSpecialty.Performance, WorkshopSpecialty.Electrical],
                BrandsServiced = ["Nissan", "Toyota", "Honda", "Mazda", "Subaru", "Mitsubishi"],
                VehicleTypesServiced = [VehicleCategory.Sedan, VehicleCategory.SUV],
                Certifications = ["JDM Specialist Certified"],
                ServiceBays = 5,
                MechanicsCount = 7,
                AverageWaitTimeMins = 480,
                HasDiagnosticEquipment = true,
                OffersWarranty = true,
                WarrantyDays = 90,
                LaborRatePerHour = 95.00m,
                UsesAftermarketParts = true,
                CreatedAt = DateTime.UtcNow.AddMonths(-24)
            },
            new Workshop
            {
                Id = Guid.NewGuid(),
                ProviderId = providers[3].Id,
                Name = "EV Service Center",
                Description = "Battery diagnostics, charging installation, software updates",
                Specialties = [WorkshopSpecialty.Electric, WorkshopSpecialty.Diagnostics, WorkshopSpecialty.Electrical],
                BrandsServiced = ["Tesla", "Rivian", "Lucid", "Polestar", "BMW i"],
                VehicleTypesServiced = [VehicleCategory.EV, VehicleCategory.Hybrid],
                IsOEMCertified = true,
                Certifications = ["Tesla Certified", "EV Safety Certified"],
                ServiceBays = 4,
                MechanicsCount = 6,
                AverageWaitTimeMins = 120,
                HasDiagnosticEquipment = true,
                OffersPickupDelivery = true,
                HasLoanerCars = true,
                HasWaitingArea = true,
                OffersWarranty = true,
                WarrantyDays = 365,
                LaborRatePerHour = 175.00m,
                UsesOEMParts = true,
                CreatedAt = DateTime.UtcNow.AddMonths(-8)
            },
            new Workshop
            {
                Id = Guid.NewGuid(),
                ProviderId = providers[4].Id,
                Name = "Quick Lube Express",
                Description = "Oil change, filter replacement, fluid top-off, tire rotation",
                Specialties = [WorkshopSpecialty.GeneralMaintenance],
                BrandsServiced = ["All Makes"],
                VehicleTypesServiced = [VehicleCategory.Sedan, VehicleCategory.SUV, VehicleCategory.Truck, VehicleCategory.Van],
                ServiceBays = 3,
                MechanicsCount = 4,
                AverageWaitTimeMins = 15,
                HasWaitingArea = true,
                LaborRatePerHour = 45.00m,
                UsesAftermarketParts = true,
                CreatedAt = DateTime.UtcNow.AddMonths(-36)
            }
        ];
    }

    private static List<FuelStation> CreateFuelStations(List<ServiceProvider> providers)
    {
        return
        [
            new FuelStation
            {
                Id = Guid.NewGuid(),
                ProviderId = providers[3].Id,
                Name = "SuperCharger Station - Downtown SF",
                Brand = "Tesla",
                Description = "High-speed Tesla Supercharger station",
                Address = "100 Main Street",
                City = "San Francisco",
                State = "CA",
                Country = "USA",
                Latitude = 37.7849,
                Longitude = -122.4094,
                Is24Hours = true,
                HasRestroom = true,
                AverageRating = 4.6,
                TotalReviews = 89,
                Status = StationStatus.Open,
                CreatedAt = DateTime.UtcNow.AddMonths(-6)
            },
            new FuelStation
            {
                Id = Guid.NewGuid(),
                Name = "Classic Gas & Go",
                Brand = "Shell",
                Description = "Full service gas station on Route 66",
                Address = "789 Highway 66",
                City = "Albuquerque",
                State = "NM",
                Country = "USA",
                Latitude = 35.0844,
                Longitude = -106.6504,
                Is24Hours = true,
                HasPetrol = true,
                HasDiesel = true,
                HasPremium = true,
                PetrolPrice = 3.49m,
                DieselPrice = 3.89m,
                PremiumPrice = 4.19m,
                HasConvenienceStore = true,
                HasRestroom = true,
                HasATM = true,
                HasCarWash = true,
                HasAirPump = true,
                HasFoodService = true,
                AcceptsMobilePayment = true,
                HasLoyaltyProgram = true,
                AverageRating = 4.2,
                TotalReviews = 234,
                Status = StationStatus.Open,
                CreatedAt = DateTime.UtcNow.AddMonths(-48)
            },
            new FuelStation
            {
                Id = Guid.NewGuid(),
                Name = "Electrify America Hub",
                Brand = "Electrify America",
                Description = "High-speed EV charging hub at shopping center",
                Address = "500 Shopping Center Blvd",
                City = "Austin",
                State = "TX",
                Country = "USA",
                Latitude = 30.2672,
                Longitude = -97.7431,
                Is24Hours = true,
                HasRestroom = true,
                AcceptsMobilePayment = true,
                AverageRating = 4.4,
                TotalReviews = 156,
                Status = StationStatus.Open,
                CreatedAt = DateTime.UtcNow.AddMonths(-12)
            }
        ];
    }

    private static List<Expert> CreateExperts()
    {
        return
        [
            new Expert
            {
                Id = Guid.NewGuid(),
                UserId = Guid.NewGuid(),
                FullName = "Mike Thompson",
                Title = "ASE Master Technician",
                Bio = "30+ years experience in automotive repair. Specializing in diagnostics and engine performance.",
                PhotoUrl = "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400",
                Specialties = [WorkshopSpecialty.Diagnostics, WorkshopSpecialty.Engine, WorkshopSpecialty.Performance],
                BrandsExpertise = ["Ford", "Chevrolet", "Dodge", "GM"],
                Certifications = ["ASE Master Technician", "GM Certified", "Ford Certified"],
                YearsExperience = 32,
                Languages = ["English", "Spanish"],
                OffersChat = true,
                OffersVoiceCall = true,
                OffersVideoCall = true,
                ChatRatePerMin = 1.50m,
                VoiceRatePerMin = 2.00m,
                VideoRatePerMin = 3.00m,
                Status = ExpertStatus.Online,
                ResponseTimeMins = 120,
                AverageRating = 4.9,
                TotalReviews = 456,
                TotalConsultations = 1234,
                QuestionsAnswered = 2500,
                VerificationLevel = VerificationLevel.Premium,
                VerifiedAt = DateTime.UtcNow.AddYears(-2),
                CreatedAt = DateTime.UtcNow.AddYears(-3)
            },
            new Expert
            {
                Id = Guid.NewGuid(),
                UserId = Guid.NewGuid(),
                FullName = "Sarah Chen",
                Title = "Electric Vehicle Specialist",
                Bio = "Former Tesla engineer. Helping EV owners get the most out of their vehicles.",
                PhotoUrl = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
                Specialties = [WorkshopSpecialty.Electric, WorkshopSpecialty.Diagnostics, WorkshopSpecialty.Electrical],
                BrandsExpertise = ["Tesla", "Rivian", "Lucid", "Polestar", "BMW i"],
                Certifications = ["Tesla Certified", "Rivian Certified", "EV Safety Certified"],
                YearsExperience = 12,
                Languages = ["English", "Mandarin"],
                OffersChat = true,
                OffersVoiceCall = true,
                OffersVideoCall = true,
                ChatRatePerMin = 2.00m,
                VoiceRatePerMin = 3.00m,
                VideoRatePerMin = 4.00m,
                Status = ExpertStatus.Online,
                ResponseTimeMins = 240,
                AverageRating = 4.8,
                TotalReviews = 234,
                TotalConsultations = 567,
                QuestionsAnswered = 1200,
                VerificationLevel = VerificationLevel.Premium,
                VerifiedAt = DateTime.UtcNow.AddYears(-1),
                CreatedAt = DateTime.UtcNow.AddYears(-2)
            },
            new Expert
            {
                Id = Guid.NewGuid(),
                UserId = Guid.NewGuid(),
                FullName = "Carl Henderson",
                Title = "Vintage Vehicle Restoration Expert",
                Bio = "Passionate about preserving automotive history. Judge at major concours events.",
                PhotoUrl = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
                Specialties = [WorkshopSpecialty.BodyWork, WorkshopSpecialty.Paint, WorkshopSpecialty.Engine],
                BrandsExpertise = ["Ford", "Chevrolet", "Dodge", "Plymouth", "Cadillac"],
                Certifications = ["ISCA Judge", "Bloomington Gold Judge", "AACA Judge"],
                YearsExperience = 45,
                Languages = ["English"],
                OffersChat = true,
                OffersVoiceCall = true,
                OffersVideoCall = true,
                ChatRatePerMin = 2.50m,
                VoiceRatePerMin = 4.00m,
                VideoRatePerMin = 5.00m,
                Status = ExpertStatus.Away,
                ResponseTimeMins = 1440,
                AverageRating = 5.0,
                TotalReviews = 89,
                TotalConsultations = 345,
                QuestionsAnswered = 800,
                VerificationLevel = VerificationLevel.Premium,
                VerifiedAt = DateTime.UtcNow.AddYears(-4),
                CreatedAt = DateTime.UtcNow.AddYears(-5)
            }
        ];
    }
}
