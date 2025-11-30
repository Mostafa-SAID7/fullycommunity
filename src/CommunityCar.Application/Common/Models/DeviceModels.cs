namespace CommunityCar.Application.Common.Models;

public record DeviceInfo(
    string DeviceId,
    string? DeviceName,
    string? DeviceType,
    string? Platform,
    string? Browser,
    string? BrowserVersion,
    string? OperatingSystem,
    string? IpAddress,
    string? UserAgent
);
