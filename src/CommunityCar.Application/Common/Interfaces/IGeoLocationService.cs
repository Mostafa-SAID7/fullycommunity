namespace CommunityCar.Application.Common.Interfaces;

public interface IGeoLocationService
{
    Task<GeoLocation?> GetLocationAsync(string ipAddress);
    Task<bool> IsVpnOrProxyAsync(string ipAddress);
    Task<bool> IsTorExitNodeAsync(string ipAddress);
    Task<double> CalculateDistanceAsync(GeoLocation from, GeoLocation to);
    Task<bool> IsLocationSuspiciousAsync(Guid userId, string ipAddress);
}

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
