using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Marketplace.Common;

namespace CommunityCar.Domain.Entities.Marketplace.Shipping;

public class ShippingQuote : BaseEntity
{
    public Guid ProductId { get; set; }
    
    public string Carrier { get; set; } = string.Empty;
    public ShippingMethod Method { get; set; }
    public string ServiceName { get; set; } = string.Empty;
    
    public decimal Cost { get; set; }
    public string Currency { get; set; } = "USD";
    
    public int EstimatedDaysMin { get; set; }
    public int EstimatedDaysMax { get; set; }
    
    // Origin
    public string OriginPostalCode { get; set; } = string.Empty;
    public string OriginCountry { get; set; } = string.Empty;
    
    // Destination
    public string DestinationPostalCode { get; set; } = string.Empty;
    public string DestinationCountry { get; set; } = string.Empty;
    
    // Package
    public double WeightKg { get; set; }
    public double? LengthCm { get; set; }
    public double? WidthCm { get; set; }
    public double? HeightCm { get; set; }
    
    public DateTime QuotedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; }
}
