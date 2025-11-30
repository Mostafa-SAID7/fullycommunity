namespace CommunityCar.Application.DTOs.Identity;

public record UserDto(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    string? AvatarUrl,
    string UserType,
    bool IsVerified,
    IEnumerable<string> Roles
);

public record UpdateProfileRequest(
    string? FirstName,
    string? LastName,
    string? PhoneNumber,
    string? Bio,
    DateTime? Birthday,
    string? Location,
    string? ThemeColor,
    string? PreferredLanguage
);

public record UpdateAvatarRequest(string AvatarUrl);

public record UpdateBackgroundRequest(string BackgroundImageUrl);

public record UserLoginHistoryDto(
    Guid Id,
    string? IpAddress,
    string? Country,
    string? City,
    string? Browser,
    string? Platform,
    bool IsSuccessful,
    DateTime LoginAt
);

public record UserDeviceDto(
    Guid Id,
    string DeviceId,
    string? DeviceName,
    string? DeviceType,
    string? Platform,
    bool IsTrusted,
    DateTime LastSeenAt
);
