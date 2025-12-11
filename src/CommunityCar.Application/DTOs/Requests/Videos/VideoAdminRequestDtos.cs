namespace CommunityCar.Application.DTOs.Requests.Videos;

public record VideoChannelVerifyRequest
{
    public bool IsVerified { get; init; }
}

public record VideoUpdateStatusRequest
{
    public string Status { get; init; } = string.Empty;
    public string? Reason { get; init; }
}

public record VideoResolveReportRequest
{
    public string Action { get; init; } = string.Empty;
    public string? Reason { get; init; }
    public string? Notes { get; init; }
}

