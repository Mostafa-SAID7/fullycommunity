using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Pages;

/// <summary>
/// Contact form submission
/// </summary>
public class ContactSubmission : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Company { get; set; }
    
    public ContactType Type { get; set; } = ContactType.General;
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    
    public ContactStatus Status { get; set; } = ContactStatus.New;
    
    // User info (if authenticated)
    public Guid? UserId { get; set; }
    public ApplicationUser? User { get; set; }
    
    // Tracking
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public string? ReferrerUrl { get; set; }
    public string? SourcePage { get; set; }
    
    // Response
    public Guid? AssignedToId { get; set; }
    public ApplicationUser? AssignedTo { get; set; }
    public string? InternalNotes { get; set; }
    public DateTime? RespondedAt { get; set; }
    public string? ResponseMessage { get; set; }
}
