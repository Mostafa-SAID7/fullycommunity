namespace CommunityCar.Infrastructure.Constants;

/// <summary>
/// Static Details - Infrastructure layer constants
/// </summary>
public static class SD
{
    public static class Jwt
    {
        public const string SecretKey = "Jwt:SecretKey";
        public const string Issuer = "Jwt:Issuer";
        public const string Audience = "Jwt:Audience";
        public const string AccessTokenExpiration = "Jwt:AccessTokenExpirationMinutes";
        public const string RefreshTokenExpiration = "Jwt:RefreshTokenExpirationDays";
        public const int DefaultAccessTokenMinutes = 15;
        public const int DefaultRefreshTokenDays = 7;
    }

    public static class Azure
    {
        public const string ConnectionString = "Azure:CommunicationServices:ConnectionString";
        public const string SenderEmail = "Azure:CommunicationServices:SenderEmail";
        public const string SenderPhone = "Azure:CommunicationServices:SenderPhone";
        public const string KeyVaultUri = "Azure:KeyVault:Uri";
    }

    public static class Database
    {
        public const string DefaultConnection = "DefaultConnection";
        public const string RedisConnection = "Redis";
    }

    public static class HttpClients
    {
        public const string HaveIBeenPwned = "HaveIBeenPwned";
        public const string GeoLocation = "GeoLocation";
    }

    public static class Security
    {
        public const int MaxFailedAttempts = 5;
        public const int LockoutMinutes = 15;
        public const int OtpExpirationMinutes = 5;
        public const int SessionExpirationDays = 7;
        public const int RecoveryCodesCount = 10;
    }

    public static class TwoFactor
    {
        public const string Issuer = "CommunityCar";
        public const int TotpDigits = 6;
        public const int TotpPeriod = 30;
        public const string Algorithm = "SHA1";
    }
}
