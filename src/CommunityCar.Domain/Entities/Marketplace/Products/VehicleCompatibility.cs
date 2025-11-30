using CommunityCar.Domain.Common;

namespace CommunityCar.Domain.Entities.Marketplace.Products;

public class VehicleCompatibility : BaseEntity
{
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;
    
    public string Make { get; set; } = string.Empty;
    public string? Model { get; set; }
    public int? YearFrom { get; set; }
    public int? YearTo { get; set; }
    public string? Trim { get; set; }
    public string? Engine { get; set; }
    public string? Notes { get; set; }
}
