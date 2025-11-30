using CommunityCar.Domain.Entities.Identity;

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

public enum AttendeeStatus { Going, Interested, NotGoing, Waitlisted, Cancelled }
public enum AttendeeRole { Attendee, CoHost, Speaker, Volunteer }

public class EventMedia
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid EventId { get; set; }
    public Event Event { get; set; } = null!;
    public string Url { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public string? Caption { get; set; }
    public int SortOrder { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class EventComment
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid EventId { get; set; }
    public Event Event { get; set; } = null!;
    public Guid AuthorId { get; set; }
    public ApplicationUser Author { get; set; } = null!;
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
