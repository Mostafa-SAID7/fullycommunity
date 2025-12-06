using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Enums.Community.Events;

namespace CommunityCar.Domain.Entities.Community.Events;

public class Event : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public string Description { get; set; } = string.Empty;
    
    public Guid OrganizerId { get; set; }
    public ApplicationUser Organizer { get; set; } = null!;
    
    // Timing
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string? Timezone { get; set; }
    public bool IsAllDay { get; set; }
    
    // Location
    public EventLocationType LocationType { get; set; }
    public string? VenueName { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public string? OnlineUrl { get; set; } // For virtual events
    
    // Media
    public string? CoverImageUrl { get; set; }
    public List<EventMedia> Media { get; set; } = [];
    
    // Settings
    public EventType Type { get; set; } = EventType.Meetup;
    public EventStatus Status { get; set; } = EventStatus.Upcoming;
    public EventVisibility Visibility { get; set; } = EventVisibility.Public;
    
    // Capacity
    public int? MaxAttendees { get; set; }
    public bool RequiresApproval { get; set; }
    public bool AllowWaitlist { get; set; }
    
    // Pricing
    public bool IsFree { get; set; } = true;
    public decimal? Price { get; set; }
    public string? Currency { get; set; }
    
    // Group association
    public Guid? GroupId { get; set; }
    
    // Stats
    public int AttendeeCount { get; set; }
    public int InterestedCount { get; set; }
    
    // Recurrence
    public bool IsRecurring { get; set; }
    public RecurrencePattern? RecurrencePattern { get; set; }
    
    public List<EventAttendee> Attendees { get; set; } = [];
    public List<EventComment> Comments { get; set; } = [];
}