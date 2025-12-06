namespace CommunityCar.Application.DTOs.Response.Identity;

public record UserDeviceDto(
    Guid Id,
    string DeviceId,
    string? DeviceName,
    string? DeviceType,
    string? Platform,
    bool IsTrusted,
    DateTime LastSeenAt
);
