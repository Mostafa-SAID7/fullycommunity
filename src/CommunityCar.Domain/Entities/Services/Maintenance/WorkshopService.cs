using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Services.Common;

namespace CommunityCar.Domain.Entities.Services.Maintenance;

public class WorkshopService : BaseEntity
{
    public Guid WorkshopId { get; set; }
    public Workshop Workshop { get; set; } = null!;
    
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public WorkshopSpecialty Category { get; set; }
    
    public decimal BasePrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public PricingType PricingType { get; set; } = PricingType.Fixed;
    public CurrencyCode Currency { get; set; } = CurrencyCode.USD;
    
    public int EstimatedDurationMins { get; set; }
    public bool RequiresAppointment { get; set; } = true;
    
    public bool IsPopular { get; set; }
    public bool IsActive { get; set; } = true;
    
    public int WarrantyDays { get; set; }
    public string? WarrantyTerms { get; set; }
}
