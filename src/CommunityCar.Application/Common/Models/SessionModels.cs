namespace CommunityCar.Application.Common.Models;

public record SessionInfo(
    string? DeviceId,
    string? DeviceName,
    string? DeviceType,
    string? Platform,
    string? Browser,
    string? IpAddress,
    string? Country,
    string? City,
    TimeSpan? Duration = null
);
