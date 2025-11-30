using CommunityCar.Domain.Common;

namespace CommunityCar.Domain.Entities.Services.Repairs;

public class RepairStatusUpdate : BaseEntity
{
    public Guid RepairRequestId { get; set; }
    public RepairRequest RepairRequest { get; set; } = null!;
    
    public RepairStatus Status { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    
    public List<string> PhotoUrls { get; set; } = [];
    public string? VideoUrl { get; set; }
    
    public int ProgressPercent { get; set; }
    public bool NotifyCustomer { get; set; } = true;
    public bool CustomerAcknowledged { get; set; }
}
