using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Services.Common;

namespace CommunityCar.Domain.Entities.Services.FuelCharging;

/// <summary>
/// EV charging station
/// </summary>
public class ChargingStation : BaseEntity
{
    public Guid? ProviderId { get; set; }
    public ServiceProvider? Provider { get; set; }
    
    public string Name { get; set; } = string.Empty;
    public string? NetworkName { get; set; }
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }
    
    // Location
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string? State { get; set; }
    public string Country { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string? LocationType { get; set; }
    
    // Operating Hours
    public bool Is24Hours { get; set; }
    public string? OperatingHoursJson { get; set; }
    public bool IsPublic { get; set; } = true;
    
    // Chargers
    public List<Charger> Chargers { get; set; } = [];
    public int TotalChargers { get; set; }
    public int AvailableChargers { get; set; }
    
    // Pricing
    public decimal? PricePerKWh { get; set; }
    public decimal? PricePerMinute { get; set; }
    public decimal? SessionFee { get; set; }
    public decimal? ParkingFee { get; set; }
    public CurrencyCode Currency { get; set; } = CurrencyCode.USD;
    public bool IsFreeCharging { get; set; }
    
    // Amenities
    public bool HasWifi { get; set; }
    public bool HasRestroom { get; set; }
    public bool HasFoodNearby { get; set; }
    public bool HasShoppingNearby { get; set; }
    public bool IsCovered { get; set; }
    public int? ParkingSpaces { get; set; }
    
    // Payment
    public bool RequiresApp { get; set; }
    public bool AcceptsCard { get; set; }
    public bool AcceptsMobilePayment { get; set; }
    public List<string> SupportedNetworks { get; set; } = [];
    
    // Stats
    public double AverageRating { get; set; }
    public int TotalReviews { get; set; }
    public double? AverageWaitTimeMins { get; set; }
    
    // Status
    public StationStatus Status { get; set; } = StationStatus.Open;
}

public class Charger : BaseEntity
{
    public Guid StationId { get; set; }
    public ChargingStation Station { get; set; } = null!;
    
    public string ChargerNumber { get; set; } = string.Empty;
    public ChargerType Type { get; set; }
    public List<ConnectorType> Connectors { get; set; } = [];
    
    public int PowerKW { get; set; }
    public int? MaxAmps { get; set; }
    public int? Voltage { get; set; }
    
    public ChargerStatus Status { get; set; } = ChargerStatus.Available;
    public DateTime? LastUsedAt { get; set; }
    public DateTime? MaintenanceAt { get; set; }
}

public enum ChargerType { Level1, Level2, DCFast, Supercharger }
public enum ConnectorType { J1772, CCS, CHAdeMO, Tesla, Type2, GBT }
public enum ChargerStatus { Available, InUse, Reserved, OutOfOrder, Maintenance }
