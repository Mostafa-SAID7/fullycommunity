using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Services.Common;

namespace CommunityCar.Domain.Entities.Services.Insurance;

public class InsuranceQuote : BaseEntity
{
    public string QuoteNumber { get; set; } = string.Empty;
    
    public Guid CustomerId { get; set; }
    public ApplicationUser Customer { get; set; } = null!;
    
    public Guid ProviderId { get; set; }
    public InsuranceProvider Provider { get; set; } = null!;
    
    // Vehicle
    public string VehicleMake { get; set; } = string.Empty;
    public string VehicleModel { get; set; } = string.Empty;
    public int VehicleYear { get; set; }
    public string? VIN { get; set; }
    public decimal VehicleValue { get; set; }
    public int AnnualMileage { get; set; }
    public string? PrimaryUse { get; set; }
    
    // Driver Info
    public int DriverAge { get; set; }
    public int YearsDriving { get; set; }
    public bool HasAccidents { get; set; }
    public bool HasViolations { get; set; }
    public string? DrivingRecordJson { get; set; }
    
    // Coverage Options
    public InsurancePolicyType Type { get; set; }
    public decimal CoverageAmount { get; set; }
    public decimal Deductible { get; set; }
    public string? CoverageOptionsJson { get; set; }
    
    // Quote
    public decimal AnnualPremium { get; set; }
    public decimal MonthlyPremium { get; set; }
    public CurrencyCode Currency { get; set; } = CurrencyCode.USD;
    
    // Discounts Applied
    public decimal? DiscountAmount { get; set; }
    public List<string> DiscountsApplied { get; set; } = [];
    
    // Status
    public QuoteStatus Status { get; set; } = QuoteStatus.Pending;
    public DateTime ValidUntil { get; set; }
    public DateTime? AcceptedAt { get; set; }
}

public enum QuoteStatus { Pending, Generated, Accepted, Rejected, Expired }
