namespace CommunityCar.Application.DTOs.Requests.Admin;

public record RejectContentRequest
{
    public string Reason { get; init; } = string.Empty;
    public string? Notes { get; init; }
}

public record ModerationActionRequest
{
    public string Action { get; init; } = string.Empty; // approve, reject, remove, warn
    public string Reason { get; init; } = string.Empty;
    public string? Notes { get; init; }
}

