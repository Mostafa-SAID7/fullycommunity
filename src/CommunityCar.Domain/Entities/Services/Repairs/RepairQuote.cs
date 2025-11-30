using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Services.Common;

namespace CommunityCar.Domain.Entities.Services.Repairs;

public class RepairQuote : BaseEntity
{
    public Guid RepairRequestId { get; set; }
    public RepairRequest RepairRequest { get; set; } = null!;
    
    public Guid ProviderId { get; set; }
    public ServiceProvider Provider { get; set; } = null!;
    
    public QuoteStatus Status { get; set; } = QuoteStatus.Pending;
    
    // Pricing Breakdown
    public decimal LaborCost { get; set; }
    public decimal PartsCost { get; set; }
    public decimal? DiagnosticFee { get; set; }
    public decimal? TaxAmount { get; set; }
    public decimal TotalCost { get; set; }
    public CurrencyCode Currency { get; set; } = CurrencyCode.USD;
    
    // Parts
    public List<QuotePart> Parts { get; set; } = [];
    public bool UsesOEMParts { get; set; }
    
    // Timeline
    public int EstimatedHours { get; set; }
    public int EstimatedDays { get; set; }
    public DateTime? AvailableFrom { get; set; }
    
    // Warranty
    public int WarrantyDays { get; set; }
    public string? WarrantyTerms { get; set; }
    
    // Notes
    public string? ProviderNotes { get; set; }
    public string? Recommendations { get; set; }
    
    // Validity
    public DateTime ValidUntil { get; set; }
    
    // Response
    public DateTime? RespondedAt { get; set; }
    public string? CustomerResponse { get; set; }
}

public class QuotePart
{
    public string Name { get; set; } = string.Empty;
    public string? PartNumber { get; set; }
    public bool IsOEM { get; set; }
    public int Quantity { get; set; } = 1;
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
}

public enum QuoteStatus { Pending, Submitted, Accepted, Rejected, Expired }
