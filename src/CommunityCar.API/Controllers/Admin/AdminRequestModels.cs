namespace CommunityCar.API.Controllers.Admin;

public record FeatureRequest(bool IsFeatured);
public record VerifyRequest(bool IsVerified);
public record UpdateStatusRequest(string Status);
public record ResolveReportRequest(string Status, string? Notes, string? ActionTaken);
