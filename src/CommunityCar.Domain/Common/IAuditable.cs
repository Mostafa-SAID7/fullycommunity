namespace CommunityCar.Domain.Common;

/// <summary>
/// Interface for audit trail functionality
/// </summary>
public interface IAuditable
{
    DateTime CreatedAt { get; set; }
    Guid? CreatedBy { get; set; }
    DateTime? UpdatedAt { get; set; }
    Guid? UpdatedBy { get; set; }
}
