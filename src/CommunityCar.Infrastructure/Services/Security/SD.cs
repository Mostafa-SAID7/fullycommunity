namespace CommunityCar.Infrastructure.Services.Security;

/// <summary>
/// Static Details - Security services constants
/// </summary>
public static class SD
{
    public static class BreachDetection
    {
        public const string HaveIBeenPwnedBaseUrl = "https://api.pwnedpasswords.com/";
        public const string UserAgent = "CommunityCar-Security-Check";
        public const int HashPrefixLength = 5;
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

    public static class IpBlocking
    {
        public const int MaxAttemptsBeforeBlock = 10;
        public const int BlockDurationHours = 24;
        public const int PermanentBlockThreshold = 5;
    }

    public static class AlertSeverity
    {
        public const string Low = "Low";
        public const string Medium = "Medium";
        public const string High = "High";
        public const string Critical = "Critical";
    }

    public static class AlertTypes
    {
        public const string SuspiciousLogin = "Suspicious login attempt detected";
        public const string NewDevice = "New device login";
        public const string PasswordChanged = "Password was changed";
        public const string TwoFactorDisabled = "Two-factor authentication was disabled";
        public const string MultipleFailedAttempts = "Multiple failed login attempts";
        public const string AccountLocked = "Account was locked";
        public const string BreachDetected = "Password found in data breach";
    }
}
