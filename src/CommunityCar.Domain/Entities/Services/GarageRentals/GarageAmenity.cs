using CommunityCar.Domain.Common;

namespace CommunityCar.Domain.Entities.Services.GarageRentals;

public class GarageAmenity : BaseEntity
{
    public Guid GarageId { get; set; }
    public Garage Garage { get; set; } = null!;
    
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? IconUrl { get; set; }
    public AmenityCategory Category { get; set; }
    
    public bool IsIncluded { get; set; } = true;
    public decimal? AdditionalCost { get; set; }
}

public enum AmenityCategory { Tools, Safety, Comfort, Utilities, Security, Other }
