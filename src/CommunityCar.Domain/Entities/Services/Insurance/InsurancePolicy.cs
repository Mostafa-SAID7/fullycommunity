using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Services.Common;

namespace CommunityCar.Domain.Entities.Services.Insurance;

public class InsurancePolicy : BaseEntity
{
    public string PolicyNumber { get; set; } = string.Empty;
    
    public Guid CustomerId { get; set; }
    public ApplicationUser Customer { get; set; } = null!;
    
    public Guid ProviderId { get; set; }
    public InsuranceProvider Provider { get; set; } = null!;
    
    public Guid QuoteId { get; set; }
    public InsuranceQuote Quote { get; set; } = null!;
    
    // Policy Details
    public InsurancePolicyType Type { get; set; }
    public PolicyStatus Status { get; set; } = PolicyStatus.Active;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    
    // Vehicle
    public string VehicleMake { get; set; } = string.Empty;
    public string VehicleModel { get; set; } = string.Empty;
    public int VehicleYear { get; set; }
    public string? VIN { get; set; }
    public string? LicensePlate { get; set; }
    public decimal VehicleValue { get; set; }
    
    // Coverage
    public decimal CoverageAmount { get; set; }
    public decimal Deductible { get; set; }
    public bool HasLiabilityCoverage { get; set; }
    public bool HasCollisionCoverage { get; set; }
    public bool HasComprehensiveCoverage { get; set; }
    public bool HasUninsuredMotorist { get; set; }
    public bool HasRoadsideAssistance { get; set; }
    public bool HasRentalReimbursement { get; set; }
    public string? AdditionalCoverageJson { get; set; }
    
    // Premium
    public decimal AnnualPremium { get; set; }
    public decimal MonthlyPremium { get; set; }
    public PaymentFrequency PaymentFrequency { get; set; }
    public CurrencyCode Currency { get; set; } = CurrencyCode.USD;
    
    // Documents
    public string? PolicyDocumentUrl { get; set; }
    public string? IdCardUrl { get; set; }
    
    // Renewal
    public bool AutoRenew { get; set; }
    public DateTime? RenewalReminderSentAt { get; set; }
    
    // Claims
    public List<InsuranceClaim> Claims { get; set; } = [];
}

public enum InsurancePolicyType { Liability, Comprehensive, ThirdParty, FullCoverage }
public enum PolicyStatus { Pending, Active, Expired, Cancelled, Suspended }
public enum PaymentFrequency { Monthly, Quarterly, SemiAnnual, Annual }
