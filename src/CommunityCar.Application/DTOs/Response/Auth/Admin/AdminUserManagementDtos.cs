namespace CommunityCar.Application.DTOs.Response.Auth.Admin;

public record AdminUserListDto(
    Guid Id,
    string Email,
    string FullName,
    List<string> Roles,
    string Status,
    DateTime CreatedAt
);

public record UserLoginHistoryDto(
    Guid Id,
    DateTime LoginDate,
    string IpAddress,
    string Device,
    bool IsSuccessful
);

public record UserDeviceDto(
    Guid Id,
    string DeviceName,
    string DeviceType,
    DateTime LastUsed,
    bool IsActive
);
