namespace CommunityCar.Domain.Common;

/// <summary>
/// Base entity with audit and soft delete support
/// </summary>
public abstract class BaseEntity : IAuditable, ISoftDelete
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    // Audit
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Guid? CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public Guid? UpdatedBy { get; set; }
    
    // Soft Delete
    public bool IsDeleted { get; set; } = false;
    public DateTime? DeletedAt { get; set; }
    public Guid? DeletedBy { get; set; }
}
