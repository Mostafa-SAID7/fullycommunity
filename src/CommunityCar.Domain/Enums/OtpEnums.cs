namespace CommunityCar.Domain.Enums;

/// <summary>
/// OTP purpose enumeration
/// </summary>
public enum OtpPurpose
{
    EmailVerification = 0,
    PhoneVerification = 1,
    PasswordReset = 2,
    TwoFactorAuth = 3,
    LoginVerification = 4,
    TransactionVerification = 5
}

/// <summary>
/// OTP delivery method enumeration
/// </summary>
public enum OtpDeliveryMethod
{
    Email = 0,
    SMS = 1,
    WhatsApp = 2,
    PushNotification = 3
}
