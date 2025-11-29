namespace CommunityCar.Infrastructure.Services.Identity;

/// <summary>
/// Static Details - Identity services constants
/// </summary>
public static class SD
{
    public static class Jwt
    {
        public const string SecretKeyConfig = "Jwt:SecretKey";
        public const string IssuerConfig = "Jwt:Issuer";
        public const string AudienceConfig = "Jwt:Audience";
        public const string AccessExpirationConfig = "Jwt:AccessTokenExpirationMinutes";
        public const string RefreshExpirationConfig = "Jwt:RefreshTokenExpirationDays";
        public const string DefaultIssuer = "CommunityCar";
        public const string DefaultAudience = "CommunityCar";
        public const int DefaultAccessMinutes = 15;
        public const int DefaultRefreshDays = 7;
    }

    public static class TwoFactor
    {
        public const string Issuer = "CommunityCar";
        public const int OtpLength = 6;
        public const int OtpExpirationMinutes = 5;
        public const int RecoveryCodesCount = 10;
        public const int RecoveryCodeLength = 10;
        public const int TotpKeySize = 20;
        public const int TotpPeriod = 30;
        public const int TotpDigits = 6;
        public const string TotpAlgorithm = "SHA1";
    }

    public static class Session
    {
        public const int DefaultDurationDays = 7;
        public const int MaxActiveSessions = 5;
    }

    public static class Security
    {
        public const int MaxFailedAttempts = 5;
        public const int LockoutMinutes = 15;
        public const int PasswordHistoryCount = 5;
    }

    public static class OtpTypes
    {
        public const string Email = "Email";
        public const string Sms = "SMS";
    }

    public static class LoginProviders
    {
        public const string Google = "Google";
        public const string Facebook = "Facebook";
        public const string Apple = "Apple";
        public const string Microsoft = "Microsoft";
        public const string GitHub = "GitHub";
    }
}
