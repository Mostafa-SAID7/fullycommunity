using CommunityCar.Domain.Constants;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Enums;
using CommunityCar.Infrastructure.Data.Seeding.Core;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CommunityCar.Infrastructure.Data.Seeding.Identity;

/// <summary>
/// Seeds admin users for the admin application
/// </summary>
public class AdminUserSeeder : BaseSeeder
{
    private readonly UserManager<ApplicationUser> _userManager;

    public AdminUserSeeder(
        AppDbContext context,
        UserManager<ApplicationUser> userManager,
        ILogger<AdminUserSeeder> logger) : base(context, logger)
    {
        _userManager = userManager;
    }

    public override int Order => 2;
    public override string Name => "Admin User Seeder";

    public override async Task<bool> ShouldSeedAsync()
    {
        return !await Context.Users.AnyAsync(u => u.UserType == UserType.Admin);
    }

    protected override async Task ExecuteSeedAsync()
    {
        var adminUsers = new[]
        {
            // Super Admin
            new
            {
                Email = "SuperAdmin.Car@gmail.com",
                FirstName = "Super",
                LastName = "Admin",
                Role = SD.Roles.SuperAdmin,
                UserType = UserType.Admin
            },
            // Community Admin
            new
            {
                Email = "CommunityAdmin.Car@gmail.com",
                FirstName = "Community",
                LastName = "Admin",
                Role = SD.Roles.Admin,
                UserType = UserType.Admin
            },
            // Content Moderator
            new
            {
                Email = "ContentModerator.Car@gmail.com",
                FirstName = "Content",
                LastName = "Moderator",
                Role = SD.Roles.Moderator,
                UserType = UserType.Admin
            },
            // User Manager
            new
            {
                Email = "UserManager.Car@gmail.com",
                FirstName = "User",
                LastName = "Manager",
                Role = SD.Roles.Admin,
                UserType = UserType.Admin
            },
            // Reports Admin
            new
            {
                Email = "ReportsAdmin.Car@gmail.com",
                FirstName = "Reports",
                LastName = "Admin",
                Role = SD.Roles.Admin,
                UserType = UserType.Admin
            }
        };

        const string adminPassword = "Car@1234";

        foreach (var adminInfo in adminUsers)
        {
            var existingUser = await _userManager.FindByEmailAsync(adminInfo.Email);
            if (existingUser == null)
            {
                var adminUser = new ApplicationUser
                {
                    UserName = adminInfo.Email,
                    Email = adminInfo.Email,
                    FirstName = adminInfo.FirstName,
                    LastName = adminInfo.LastName,
                    EmailConfirmed = true,
                    UserType = adminInfo.UserType,
                    AccountStatus = AccountStatus.Active,
                    VerificationStatus = VerificationStatus.FullyVerified,
                    CreatedAt = DateTime.UtcNow,
                    LastActivityAt = DateTime.UtcNow
                };

                var result = await _userManager.CreateAsync(adminUser, adminPassword);
                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(adminUser, adminInfo.Role);
                    Logger.LogInformation("Created admin user: {Email} with role {Role}", 
                        adminInfo.Email, adminInfo.Role);
                }
                else
                {
                    Logger.LogError("Failed to create admin user {Email}: {Errors}", 
                        adminInfo.Email, string.Join(", ", result.Errors.Select(e => e.Description)));
                }
            }
        }
    }
}