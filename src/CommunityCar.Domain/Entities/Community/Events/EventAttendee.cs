using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Enums.Community.Events;

namespace CommunityCar.Domain.Entities.Community.Events;

public class EventAttendee
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid EventId { get; set; }
    public Event Event { get; set; } = null!;
    
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    public AttendeeStatus Status { get; set; } = AttendeeStatus.Going;
    public AttendeeRole Role { get; set; } = AttendeeRole.Attendee;
    
    public DateTime RegisteredAt { get; set; } = DateTime.UtcNow;
    public DateTime? CheckedInAt { get; set; }
    
    public int? GuestCount { get; set; }
    public string? Notes { get; set; }
    
    // For paid events
    public bool IsPaid { get; set; }
    public string? PaymentReference { get; set; }
}
