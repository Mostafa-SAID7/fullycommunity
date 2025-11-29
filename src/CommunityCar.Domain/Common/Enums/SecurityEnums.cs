namespace CommunityCar.Domain.Common.Enums;

public enum UserType
{
    User = 0,
    Admin = 1,
    SuperAdmin = 2,
    Moderator = 3,
    Expert = 10,
    Author = 11,
    Reviewer = 12,
    Vendor = 20,
    Mechanic = 21,
    GarageOwner = 22,
    Instructor = 30,
    Student = 31,
    Affiliate = 40
}

public enum AccountStatus
{
    Active = 0,
    Inactive = 1,
    Suspended = 2,
    Banned = 3,
    PendingVerification = 4,
    PendingApproval = 5,
    Locked = 6
}

public enum VerificationStatus
{
    Unverified = 0,
    EmailVerified = 1,
    PhoneVerified = 2,
    FullyVerified = 3,
    IdentityVerified = 4
}

public enum TwoFactorType
{
    None = 0,
    Email = 1,
    SMS = 2,
    Authenticator = 3,
    Both = 4
}

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

public enum SecurityAlertSeverity
{
    Low = 0,
    Medium = 1,
    High = 2,
    Critical = 3
}
