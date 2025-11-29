namespace CommunityCar.Application.Constants;

/// <summary>
/// Static Details - Application layer constants
/// </summary>
public static class SD
{
    public static class ErrorMessages
    {
        public const string UserNotFound = "User not found";
        public const string InvalidCredentials = "Invalid credentials";
        public const string AccountLocked = "Account is locked. Please try again later.";
        public const string AccountInactive = "Account is inactive";
        public const string EmailNotVerified = "Email not verified";
        public const string PhoneNotVerified = "Phone number not verified";
        public const string InvalidToken = "Invalid or expired token";
        public const string InvalidOtp = "Invalid or expired OTP";
        public const string TwoFactorRequired = "Two-factor authentication required";
        public const string PhoneNotSet = "Phone number not set";
        public const string EmailAlreadyExists = "Email already registered";
        public const string RoleNotFound = "Role not found";
        public const string PermissionDenied = "Permission denied";
    }

    public static class SuccessMessages
    {
        public const string LoginSuccess = "Login successful";
        public const string RegisterSuccess = "Registration successful";
        public const string LogoutSuccess = "Logged out successfully";
        public const string PasswordChanged = "Password changed successfully";
        public const string PasswordReset = "Password reset successfully";
        public const string EmailVerified = "Email verified successfully";
        public const string PhoneVerified = "Phone verified successfully";
        public const string TwoFactorEnabled = "Two-factor authentication enabled";
        public const string TwoFactorDisabled = "Two-factor authentication disabled";
        public const string OtpSent = "OTP sent successfully";
        public const string ProfileUpdated = "Profile updated successfully";
    }

    public static class EmailTemplates
    {
        public const string Welcome = "welcome";
        public const string OtpVerification = "otp-verification";
        public const string PasswordReset = "password-reset";
        public const string EmailVerification = "email-verification";
        public const string SecurityAlert = "security-alert";
        public const string NewDeviceLogin = "new-device-login";
        public const string PasswordChanged = "password-changed";
    }

    public static class CacheKeys
    {
        public const string UserPrefix = "user:";
        public const string RolePrefix = "role:";
        public const string SessionPrefix = "session:";
        public const string OtpPrefix = "otp:";
        public const string RateLimitPrefix = "ratelimit:";
    }
}
