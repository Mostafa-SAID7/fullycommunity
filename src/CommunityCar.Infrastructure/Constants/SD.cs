namespace CommunityCar.Infrastructure.Constants;

/// <summary>
/// Static Details - Infrastructure layer constants (consolidated)
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
        public const int MaxAttemptsBeforeBlock = 10;
        public const int BlockDurationHours = 24;
        public const int PermanentBlockThreshold = 5;
    }

    public static class RiskScoring
    {
        public const int NewDeviceScore = 20;
        public const int NewLocationScore = 15;
        public const int UnusualTimeScore = 10;
        public const int FailedAttemptsScore = 25;
        public const int VpnDetectedScore = 5;
        public const int HighRiskThreshold = 50;
        public const int MediumRiskThreshold = 25;
    }

    public static class BreachDetection
    {
        public const string HaveIBeenPwnedBaseUrl = "https://api.pwnedpasswords.com/";
        public const string UserAgent = "CommunityCar-Security-Check";
        public const int HashPrefixLength = 5;
    }

    public static class Azure
    {
        public const string ConnectionStringConfig = "Azure:CommunicationServices:ConnectionString";
        public const string SenderEmailConfig = "Azure:CommunicationServices:SenderEmail";
        public const string SenderPhoneConfig = "Azure:CommunicationServices:SenderPhone";
        public const string KeyVaultUriConfig = "Azure:KeyVault:Uri";
        public const string DefaultSenderEmail = "noreply@communitycar.com";
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

    public static class EmailTemplates
    {
        public const string OtpVerification = "otp-verification";
        public const string Welcome = "welcome";
        public const string PasswordReset = "password-reset";
        public const string EmailVerification = "email-verification";
        public const string SecurityAlert = "security-alert";
        public const string NewDeviceLogin = "new-device-login";
        public const string PasswordChanged = "password-changed";
        public const string AccountLocked = "account-locked";
        public const string TwoFactorEnabled = "2fa-enabled";
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
