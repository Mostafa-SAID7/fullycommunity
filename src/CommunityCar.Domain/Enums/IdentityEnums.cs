namespace CommunityCar.Domain.Enums;

/// <summary>
/// User type enumeration
/// </summary>
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

/// <summary>
/// Account status enumeration
/// </summary>
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

/// <summary>
/// Verification status enumeration
/// </summary>
public enum VerificationStatus
{
    Unverified = 0,
    EmailVerified = 1,
    PhoneVerified = 2,
    FullyVerified = 3,
    IdentityVerified = 4
}

/// <summary>
/// Two-factor authentication type
/// </summary>
public enum TwoFactorType
{
    None = 0,
    Email = 1,
    SMS = 2,
    Authenticator = 3,
    Both = 4
}

/// <summary>
/// Login type enumeration
/// </summary>
public enum LoginType
{
    Password = 0,
    Google = 1,
    Facebook = 2,
    Apple = 3,
    Microsoft = 4,
    GitHub = 5,
    Twitter = 6,
    OTP = 7,
    TwoFactor = 8,
    Biometric = 9,
    RefreshToken = 10
}

/// <summary>
/// Login status enumeration
/// </summary>
public enum LoginStatus
{
    Success = 0,
    Failed = 1,
    Locked = 2,
    RequiresTwoFactor = 3,
    RequiresVerification = 4,
    Blocked = 5
}
