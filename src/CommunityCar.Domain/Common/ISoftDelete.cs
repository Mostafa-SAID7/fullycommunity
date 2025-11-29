namespace CommunityCar.Domain.Common;

/// <summary>
/// Interface for soft delete functionality
/// </summary>
public interface ISoftDelete
{
    bool IsDeleted { get; set; }
    DateTime? DeletedAt { get; set; }
    Guid? DeletedBy { get; set; }
}
