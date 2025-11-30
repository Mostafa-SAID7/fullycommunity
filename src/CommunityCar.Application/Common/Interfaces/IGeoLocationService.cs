using CommunityCar.Application.Common.Models;

namespace CommunityCar.Application.Common.Interfaces;

public interface IGeoLocationService
{
    Task<GeoLocation?> GetLocationAsync(string ipAddress);
    Task<bool> IsVpnOrProxyAsync(string ipAddress);
    Task<bool> IsTorExitNodeAsync(string ipAddress);
    Task<double> CalculateDistanceAsync(GeoLocation from, GeoLocation to);
    Task<bool> IsLocationSuspiciousAsync(Guid userId, string ipAddress);
}
