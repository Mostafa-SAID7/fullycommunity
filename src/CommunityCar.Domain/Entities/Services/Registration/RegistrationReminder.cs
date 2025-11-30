using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Services.Registration;

/// <summary>
/// Reminder for registration/license renewal
/// </summary>
public class RegistrationReminder : BaseEntity
{
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    public ReminderType Type { get; set; }
    
    // Vehicle/License Info
    public string? VehicleMake { get; set; }
    public string? VehicleModel { get; set; }
    public string? PlateNumber { get; set; }
    public string? LicenseNumber { get; set; }
    
    // Dates
    public DateTime ExpiryDate { get; set; }
    public int ReminderDaysBefore { get; set; } = 30;
    
    // Notifications
    public bool NotifyByEmail { get; set; } = true;
    public bool NotifyByPush { get; set; } = true;
    public bool NotifyBySms { get; set; }
    
    public DateTime? FirstReminderSentAt { get; set; }
    public DateTime? SecondReminderSentAt { get; set; }
    public DateTime? FinalReminderSentAt { get; set; }
    
    public bool IsActive { get; set; } = true;
    public bool IsCompleted { get; set; }
    public DateTime? CompletedAt { get; set; }
}

public enum ReminderType 
{ 
    VehicleRegistration, 
    DrivingLicense, 
    Insurance, 
    Inspection, 
    RoadTax 
}
