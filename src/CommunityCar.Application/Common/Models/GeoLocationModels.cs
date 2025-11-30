namespace CommunityCar.Application.Common.Models;

public record GeoLocation(
    string? Country,
    string? CountryCode,
    string? Region,
    string? City,
    string? PostalCode,
    double? Latitude,
    double? Longitude,
    string? Timezone,
    string? Isp,
    bool IsVpn = false,
    bool IsProxy = false,
    bool IsTor = false
);
