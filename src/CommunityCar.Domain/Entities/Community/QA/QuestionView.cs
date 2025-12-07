using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Community.QA;

/// <summary>
/// Tracks unique views per user for questions
/// </summary>
public class QuestionView
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid QuestionId { get; set; }
    public Question Question { get; set; } = null!;
    public Guid? UserId { get; set; }
    public ApplicationUser? User { get; set; }
    
    /// <summary>
    /// For anonymous users, track by IP hash or session ID
    /// </summary>
    public string? AnonymousId { get; set; }
    
    public DateTime ViewedAt { get; set; } = DateTime.UtcNow;
}
