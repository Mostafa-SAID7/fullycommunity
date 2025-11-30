using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Services.Common;

namespace CommunityCar.Domain.Entities.Services.FuelCharging;

public class ChargingSession : BaseEntity
{
    public string SessionNumber { get; set; } = string.Empty;
    
    public Guid StationId { get; set; }
    public ChargingStation Station { get; set; } = null!;
    
    public Guid ChargerId { get; set; }
    public Charger Charger { get; set; } = null!;
    
    public Guid CustomerId { get; set; }
    public ApplicationUser Customer { get; set; } = null!;
    
    // Vehicle
    public string? VehicleMake { get; set; }
    public string? VehicleModel { get; set; }
    public string? LicensePlate { get; set; }
    
    // Session
    public DateTime StartedAt { get; set; }
    public DateTime? EndedAt { get; set; }
    public int DurationMins { get; set; }
    
    // Charging Data
    public double EnergyDeliveredKWh { get; set; }
    public int? StartBatteryPercent { get; set; }
    public int? EndBatteryPercent { get; set; }
    public double? PeakPowerKW { get; set; }
    public double? AveragePowerKW { get; set; }
    
    // Pricing
    public decimal EnergyCharge { get; set; }
    public decimal? TimeCharge { get; set; }
    public decimal? SessionFee { get; set; }
    public decimal? ParkingFee { get; set; }
    public decimal? IdleFee { get; set; }
    public decimal TotalCost { get; set; }
    public CurrencyCode Currency { get; set; } = CurrencyCode.USD;
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
    
    // Rewards
    public int RewardPointsEarned { get; set; }
    public int RewardPointsRedeemed { get; set; }
    
    // Status
    public ChargingSessionStatus Status { get; set; } = ChargingSessionStatus.InProgress;
    public string? StopReason { get; set; }
}

public enum ChargingSessionStatus { Pending, InProgress, Completed, Stopped, Failed }
