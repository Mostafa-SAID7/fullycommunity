namespace CommunityCar.Infrastructure.Caching;

public static class CacheKeys
{
    public static string User(Guid userId) => $"user:{userId}";
    public static string UserRoles(Guid userId) => $"user:{userId}:roles";
    public static string UserPermissions(Guid userId) => $"user:{userId}:permissions";
    public static string UserSessions(Guid userId) => $"user:{userId}:sessions";
    public static string UserDevices(Guid userId) => $"user:{userId}:devices";

    public static string Role(Guid roleId) => $"role:{roleId}";
    public static string AllRoles => "roles:all";
    public static string RolePermissions(Guid roleId) => $"role:{roleId}:permissions";

    public static string GeoLocation(string ipAddress) => $"geo:{ipAddress}";
    public static string IpRisk(string ipAddress) => $"ip:risk:{ipAddress}";

    public static string RefreshToken(string token) => $"refresh:{token}";
    public static string Session(string sessionId) => $"session:{sessionId}";

    public static string RateLimit(string key) => $"ratelimit:{key}";
}
