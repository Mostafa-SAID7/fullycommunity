namespace CommunityCar.Application.Features.Admin.Shared.DTOs;

/// <summary>
/// Shared request models for admin operations across different modules
/// </summary>

public record FeatureRequest(bool IsFeatured);

public record VerifyRequest(bool IsVerified);

public record UpdateStatusRequest(string Status);

public record ResolveReportRequest(
    string Status,
    string? Notes,
    string? ActionTaken
);
