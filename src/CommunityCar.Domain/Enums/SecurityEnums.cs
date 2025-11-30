namespace CommunityCar.Domain.Enums;

/// <summary>
/// Security alert type enumeration
/// </summary>
public enum SecurityAlertType
{
    SuspiciousActivity = 0,
    NewDeviceLogin = 1,
    PasswordChanged = 2,
    EmailChanged = 3,
    PhoneChanged = 4,
    TwoFactorEnabled = 5,
    TwoFactorDisabled = 6,
    FailedLoginAttempts = 7,
    AccountLocked = 8,
    AccountUnlocked = 9,
    PasswordBreachDetected = 10,
    UnusualLocation = 11,
    MultipleFailedOtp = 12,
    SessionHijackAttempt = 13,
    BruteForceDetected = 14,
    TokenRevoked = 15,
    DeviceRemoved = 16,
    RecoveryCodesGenerated = 17,
    RecoveryCodeUsed = 18,
    ApiKeyCreated = 19,
    ApiKeyRevoked = 20
}

/// <summary>
/// Security alert severity enumeration
/// </summary>
public enum SecurityAlertSeverity
{
    Low = 0,
    Medium = 1,
    High = 2,
    Critical = 3
}
