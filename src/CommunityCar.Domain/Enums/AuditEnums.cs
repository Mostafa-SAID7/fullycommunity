namespace CommunityCar.Domain.Enums;

/// <summary>
/// Audit action enumeration
/// </summary>
public enum AuditAction
{
    // Auth
    Login = 0,
    Logout = 1,
    Register = 2,
    PasswordReset = 3,
    PasswordChange = 4,
    TwoFactorEnabled = 5,
    TwoFactorDisabled = 6,
    TokenRefresh = 7,
    TokenRevoke = 8,
    
    // User
    ProfileUpdate = 10,
    EmailChange = 11,
    PhoneChange = 12,
    AvatarUpdate = 13,
    SettingsUpdate = 14,
    
    // Device
    DeviceAdded = 20,
    DeviceRemoved = 21,
    DeviceTrusted = 22,
    DeviceUntrusted = 23,
    
    // Admin
    UserCreated = 30,
    UserUpdated = 31,
    UserDeleted = 32,
    UserSuspended = 33,
    UserActivated = 34,
    RoleAssigned = 35,
    RoleRemoved = 36,
    PermissionGranted = 37,
    PermissionRevoked = 38,
    
    // Security
    SecurityAlertCreated = 40,
    SecurityAlertResolved = 41,
    IpBlocked = 42,
    IpUnblocked = 43,
    
    // Data
    DataExport = 50,
    DataImport = 51,
    DataDelete = 52
}

/// <summary>
/// Activity type enumeration
/// </summary>
public enum ActivityType
{
    PageView = 0,
    ApiCall = 1,
    FileUpload = 2,
    FileDownload = 3,
    Search = 4,
    Comment = 5,
    Like = 6,
    Share = 7,
    Purchase = 8,
    Subscription = 9
}
