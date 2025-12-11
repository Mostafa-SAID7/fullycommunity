namespace CommunityCar.Application.DTOs.Requests.Admin;

public record UpdateStatusRequest
{
    public string Status { get; init; } = string.Empty;
    public string? Reason { get; init; }
}

public record ResolveReportRequest
{
    public string Action { get; init; } = string.Empty; // approve, reject, dismiss
    public string? Reason { get; init; }
    public string? Notes { get; init; }
}

public record VerifyRequest
{
    public bool Verified { get; init; }
    public string? Notes { get; init; }
}

