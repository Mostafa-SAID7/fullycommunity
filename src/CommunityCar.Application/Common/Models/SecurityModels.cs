namespace CommunityCar.Application.Common.Models;

public record SecurityAlertDto(
    Guid Id,
    string AlertType,
    string Severity,
    string Title,
    string? Description,
    bool IsRead,
    bool IsResolved,
    DateTime CreatedAt
);
