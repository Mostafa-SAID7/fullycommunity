using CommunityCar.Domain.Constants;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Infrastructure.Data.Seeding.Core;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CommunityCar.Infrastructure.Data.Seeding.Identity;

/// <summary>
/// Seeds application roles for both main and admin applications
/// </summary>
public class RoleSeeder : BaseSeeder
{
    private readonly RoleManager<ApplicationRole> _roleManager;

    public RoleSeeder(
        AppDbContext context,
        RoleManager<ApplicationRole> roleManager,
        ILogger<RoleSeeder> logger) : base(context, logger)
    {
        _roleManager = roleManager;
    }

    public override int Order => 1;
    public override string Name => "Role Seeder";

    public override async Task<bool> ShouldSeedAsync()
    {
        return !await Context.Roles.AnyAsync();
    }

    protected override async Task ExecuteSeedAsync()
    {
        // Admin roles (for admin app)
        var adminRoles = new[]
        {
            new { Name = SD.Roles.SuperAdmin, Description = "Super Administrator with full system access", Category = "Admin" },
            new { Name = SD.Roles.Admin, Description = "System Administrator", Category = "Admin" },
            new { Name = SD.Roles.Moderator, Description = "Content Moderator", Category = "Admin" }
        };

        // User roles (for main app)
        var userRoles = new[]
        {
            new { Name = SD.Roles.User, Description = "Regular User", Category = "User" },
            new { Name = SD.Roles.Expert, Description = "Community Expert - can answer questions and provide expertise", Category = "User" },
            new { Name = SD.Roles.Reviewer, Description = "Content Reviewer - can write and manage reviews", Category = "User" },
            new { Name = SD.Roles.Author, Description = "Content Creator - can create guides, articles, and content", Category = "User" }
        };

        // Business roles
        var businessRoles = new[]
        {
            new { Name = SD.Roles.Vendor, Description = "Marketplace Vendor", Category = "Business" },
            new { Name = SD.Roles.Mechanic, Description = "Professional Mechanic", Category = "Business" },
            new { Name = SD.Roles.GarageOwner, Description = "Garage/Service Center Owner", Category = "Business" },
            new { Name = SD.Roles.Instructor, Description = "Driving/Maintenance Instructor", Category = "Business" }
        };

        // Educational roles
        var educationalRoles = new[]
        {
            new { Name = SD.Roles.Student, Description = "Student/Learner", Category = "Educational" },
            new { Name = SD.Roles.Affiliate, Description = "Affiliate Partner", Category = "Business" }
        };

        var allRoles = adminRoles.Concat(userRoles).Concat(businessRoles).Concat(educationalRoles);

        foreach (var roleInfo in allRoles)
        {
            if (!await _roleManager.RoleExistsAsync(roleInfo.Name))
            {
                var role = new ApplicationRole
                {
                    Name = roleInfo.Name,
                    NormalizedName = roleInfo.Name.ToUpperInvariant(),
                    Description = roleInfo.Description,
                    IsSystemRole = roleInfo.Category == "Admin",
                    CreatedAt = DateTime.UtcNow,
                    Priority = roleInfo.Category == "Admin" ? 100 : 
                              roleInfo.Category == "Business" ? 50 : 10
                };

                var result = await _roleManager.CreateAsync(role);
                if (result.Succeeded)
                {
                    Logger.LogInformation("Created {Category} role: {RoleName}", roleInfo.Category, roleInfo.Name);
                }
                else
                {
                    Logger.LogError("Failed to create role {RoleName}: {Errors}", 
                        roleInfo.Name, string.Join(", ", result.Errors.Select(e => e.Description)));
                }
            }
        }
    }
}