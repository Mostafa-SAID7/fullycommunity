namespace CommunityCar.Domain.Constants;

/// <summary>
/// Static Details - Domain layer constants
/// </summary>
public static class SD
{
    public static class Roles
    {
        public const string SuperAdmin = "SuperAdmin";
        public const string Admin = "Admin";
        public const string Moderator = "Moderator";
        public const string User = "User";
        public const string Expert = "Expert";
        public const string Author = "Author";
        public const string Reviewer = "Reviewer";
        public const string Vendor = "Vendor";
        public const string Mechanic = "Mechanic";
        public const string GarageOwner = "GarageOwner";
        public const string Instructor = "Instructor";
        public const string Student = "Student";
        public const string Affiliate = "Affiliate";
    }

    public static class Policies
    {
        public const string AdminOnly = "AdminOnly";
        public const string ModeratorOrAbove = "ModeratorOrAbove";
        public const string RequireVerified = "RequireVerified";
        public const string RequireTwoFactor = "RequireTwoFactor";
    }

    public static class Claims
    {
        public const string UserId = "uid";
        public const string UserType = "userType";
        public const string FirstName = "firstName";
        public const string LastName = "lastName";
        public const string DeviceId = "deviceId";
        public const string SessionId = "sessionId";
    }

    public static class Validation
    {
        public const int PasswordMinLength = 8;
        public const int PasswordMaxLength = 128;
        public const int NameMinLength = 2;
        public const int NameMaxLength = 100;
        public const int EmailMaxLength = 256;
        public const int PhoneMaxLength = 20;
        public const int BioMaxLength = 500;
    }
}
