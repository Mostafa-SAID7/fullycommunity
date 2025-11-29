namespace CommunityCar.Infrastructure.Services.Notification;

/// <summary>
/// Static Details - Notification services constants
/// </summary>
public static class SD
{
    public static class Azure
    {
        public const string ConnectionStringConfig = "Azure:CommunicationServices:ConnectionString";
        public const string SenderEmailConfig = "Azure:CommunicationServices:SenderEmail";
        public const string SenderPhoneConfig = "Azure:CommunicationServices:SenderPhone";
        public const string DefaultSenderEmail = "noreply@communitycar.com";
    }

    public static class Templates
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

    public static class Placeholders
    {
        public const string Name = "name";
        public const string Otp = "otp";
        public const string Expiration = "expiration";
        public const string ResetLink = "resetLink";
        public const string DeviceName = "deviceName";
        public const string Location = "location";
        public const string IpAddress = "ipAddress";
        public const string DateTime = "dateTime";
    }

    public static class SmsMessages
    {
        public const string OtpFormat = "Your CommunityCar verification code is: {0}. Valid for {1} minutes.";
        public const string SecurityAlert = "CommunityCar Security Alert: {0}";
    }
}
