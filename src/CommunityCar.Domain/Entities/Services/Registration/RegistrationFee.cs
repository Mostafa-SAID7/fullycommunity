using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Services.Common;

namespace CommunityCar.Domain.Entities.Services.Registration;

public class RegistrationFee : BaseEntity
{
    public Guid ServiceId { get; set; }
    public RegistrationService Service { get; set; } = null!;
    
    public RegistrationType Type { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    
    public decimal Amount { get; set; }
    public CurrencyCode Currency { get; set; } = CurrencyCode.USD;
    
    public bool IsGovernmentFee { get; set; }
    public bool IsServiceCharge { get; set; }
    
    public VehicleCategory? ApplicableVehicleType { get; set; }
    
    public bool IsActive { get; set; } = true;
}
