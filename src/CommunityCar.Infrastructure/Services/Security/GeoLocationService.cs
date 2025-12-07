using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.Common.Interfaces.Infrastructure;
using CommunityCar.Application.Common.Interfaces.Security;
using CommunityCar.Application.Common.Models;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Enums;
using CommunityCar.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace CommunityCar.Infrastructure.Services.Security;

public class GeoLocationService : IGeoLocationService
{
    private readonly AppDbContext _context;
    private readonly IDistributedCache _cache;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<GeoLocationService> _logger;

    public GeoLocationService(
        AppDbContext context,
        IDistributedCache cache,
        IHttpClientFactory httpClientFactory,
        ILogger<GeoLocationService> logger)
    {
        _context = context;
        _cache = cache;
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    public async Task<GeoLocation?> GetLocationAsync(string ipAddress)
    {
        if (string.IsNullOrEmpty(ipAddress) || IsPrivateIp(ipAddress))
            return null;

        // Check cache
        var cacheKey = $"geo:{ipAddress}";
        var cached = await _cache.GetStringAsync(cacheKey);
        if (!string.IsNullOrEmpty(cached))
        {
            return JsonSerializer.Deserialize<GeoLocation>(cached);
        }

        try
        {
            // Use ip-api.com (free tier) or MaxMind GeoIP2
            var client = _httpClientFactory.CreateClient("GeoLocation");
            var response = await client.GetAsync($"http://ip-api.com/json/{ipAddress}?fields=status,country,countryCode,region,city,zip,lat,lon,timezone,isp,proxy");

            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                var data = JsonDocument.Parse(json);
                var root = data.RootElement;

                if (root.GetProperty("status").GetString() == "success")
                {
                    var location = new GeoLocation(
                        root.GetProperty("country").GetString(),
                        root.GetProperty("countryCode").GetString(),
                        root.GetProperty("region").GetString(),
                        root.GetProperty("city").GetString(),
                        root.GetProperty("zip").GetString(),
                        root.GetProperty("lat").GetDouble(),
                        root.GetProperty("lon").GetDouble(),
                        root.GetProperty("timezone").GetString(),
                        root.GetProperty("isp").GetString(),
                        false,
                        root.GetProperty("proxy").GetBoolean(),
                        false);

                    // Cache for 24 hours
                    await _cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(location), new DistributedCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(24)
                    });

                    return location;
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get geolocation for IP: {IpAddress}", ipAddress);
        }

        return null;
    }

    public async Task<bool> IsVpnOrProxyAsync(string ipAddress)
    {
        var location = await GetLocationAsync(ipAddress);
        return location?.IsVpn == true || location?.IsProxy == true;
    }

    public async Task<bool> IsTorExitNodeAsync(string ipAddress)
    {
        // Check against Tor exit node list
        // This would typically use a service like dan.me.uk/tornodes
        var cacheKey = $"tor:{ipAddress}";
        var cached = await _cache.GetStringAsync(cacheKey);
        if (!string.IsNullOrEmpty(cached))
            return cached == "true";

        // For now, return false - implement actual check with Tor exit node list
        return false;
    }

    public Task<double> CalculateDistanceAsync(GeoLocation from, GeoLocation to)
    {
        if (from.Latitude == null || from.Longitude == null ||
            to.Latitude == null || to.Longitude == null)
            return Task.FromResult(0.0);

        // Haversine formula
        const double R = 6371; // Earth's radius in km

        var lat1 = from.Latitude.Value * Math.PI / 180;
        var lat2 = to.Latitude.Value * Math.PI / 180;
        var deltaLat = (to.Latitude.Value - from.Latitude.Value) * Math.PI / 180;
        var deltaLon = (to.Longitude.Value - from.Longitude.Value) * Math.PI / 180;

        var a = Math.Sin(deltaLat / 2) * Math.Sin(deltaLat / 2) +
                Math.Cos(lat1) * Math.Cos(lat2) *
                Math.Sin(deltaLon / 2) * Math.Sin(deltaLon / 2);

        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

        return Task.FromResult(R * c);
    }

    public async Task<bool> IsLocationSuspiciousAsync(Guid userId, string ipAddress)
    {
        var currentLocation = await GetLocationAsync(ipAddress);
        if (currentLocation == null) return false;

        // Get user's typical locations from login history
        var recentLogins = await _context.Set<UserLogin>()
            .Where(l => l.UserId == userId && l.Status == LoginStatus.Success)
            .OrderByDescending(l => l.LoginAt)
            .Take(10)
            .Select(l => l.Country)
            .Distinct()
            .ToListAsync();

        // If user has never logged in from this country before
        if (recentLogins.Any() && !recentLogins.Contains(currentLocation.Country))
        {
            _logger.LogWarning(
                "Suspicious location detected for user {UserId}: {Country} (usual: {UsualCountries})",
                userId, currentLocation.Country, string.Join(", ", recentLogins));
            return true;
        }

        return false;
    }

    private bool IsPrivateIp(string ipAddress)
    {
        if (ipAddress == "::1" || ipAddress == "127.0.0.1" || ipAddress == "localhost")
            return true;

        var parts = ipAddress.Split('.');
        if (parts.Length != 4) return false;

        if (!int.TryParse(parts[0], out var first)) return false;
        if (!int.TryParse(parts[1], out var second)) return false;

        // 10.x.x.x
        if (first == 10) return true;
        // 172.16.x.x - 172.31.x.x
        if (first == 172 && second >= 16 && second <= 31) return true;
        // 192.168.x.x
        if (first == 192 && second == 168) return true;

        return false;
    }
}
