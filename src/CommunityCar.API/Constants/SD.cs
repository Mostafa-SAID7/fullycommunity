namespace CommunityCar.API.Constants;

/// <summary>
/// Static Details - API layer constants
/// </summary>
public static class SD
{
    public static class Routes
    {
        public const string ApiBase = "api";
        public const string V1 = "v1";
        public const string Auth = "auth";
        public const string Users = "users";
        public const string Roles = "roles";
        public const string Admin = "admin";
    }

    public static class Headers
    {
        public const string DeviceId = "X-Device-Id";
        public const string ClientVersion = "X-Client-Version";
        public const string Platform = "X-Platform";
        public const string Timezone = "X-Timezone";
        public const string Language = "Accept-Language";
        public const string CorrelationId = "X-Correlation-Id";
    }

    public static class ContentTypes
    {
        public const string Json = "application/json";
        public const string ProblemJson = "application/problem+json";
        public const string FormUrlEncoded = "application/x-www-form-urlencoded";
        public const string MultipartFormData = "multipart/form-data";
    }

    public static class Cors
    {
        public const string AllowAll = "AllowAll";
        public const string Production = "Production";
    }

    public static class RateLimiting
    {
        public const string Default = "default";
        public const string Auth = "auth";
        public const string Api = "api";
    }

    public static class Swagger
    {
        public const string Title = "CommunityCar API";
        public const string Version = "v1";
        public const string Description = "CommunityCar Platform API";
        public const string SecurityScheme = "Bearer";
    }
}
