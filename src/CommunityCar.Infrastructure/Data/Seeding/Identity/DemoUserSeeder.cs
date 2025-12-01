using CommunityCar.Domain.Constants;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Enums;
using CommunityCar.Infrastructure.Data.Seeding.Core;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CommunityCar.Infrastructure.Data.Seeding.Identity;

/// <summary>
/// Seeds demo users for the main application with different roles
/// Each role has approved and pending users for testing approval workflows
/// </summary>
public class DemoUserSeeder : BaseSeeder
{
    private readonly UserManager<ApplicationUser> _userManager;

    public DemoUserSeeder(
        AppDbContext context,
        UserManager<ApplicationUser> userManager,
        ILogger<DemoUserSeeder> logger) : base(context, logger)
    {
        _userManager = userManager;
    }

    public override int Order => 3;
    public override string Name => "Demo User Seeder";

    public override async Task<bool> ShouldSeedAsync()
    {
        return !await Context.Users.AnyAsync(u => u.Email!.Contains(".Car@gmail.com"));
    }

    protected override async Task ExecuteSeedAsync()
    {
        // All users use the same password
        const string defaultPassword = "Car@1234";

        var demoUsers = new[]
        {
            // ═══════════════════════════════════════════════════════════════════
            // REGULAR USER (Normal user with basic access)
            // ═══════════════════════════════════════════════════════════════════
            new
            {
                Email = "User.Car@gmail.com",
                FirstName = "Regular",
                LastName = "User",
                Role = SD.Roles.User,
                Bio = "Car enthusiast exploring the community and learning about car maintenance.",
                Location = "New York, NY",
                UserType = UserType.User,
                IsApproved = true
            },

            // ═══════════════════════════════════════════════════════════════════
            // EXPERT (Can answer questions, provide expertise)
            // ═══════════════════════════════════════════════════════════════════
            new
            {
                Email = "Expert.Car@gmail.com",
                FirstName = "Approved",
                LastName = "Expert",
                Role = SD.Roles.Expert,
                Bio = "Certified automotive expert with 15+ years experience in BMW and Mercedes maintenance.",
                Location = "Los Angeles, CA",
                UserType = UserType.User,
                IsApproved = true
            },
            new
            {
                Email = "ExpertPending.Car@gmail.com",
                FirstName = "Pending",
                LastName = "Expert",
                Role = SD.Roles.Expert,
                Bio = "Professional mechanic applying for expert status.",
                Location = "Chicago, IL",
                UserType = UserType.User,
                IsApproved = false
            },

            // ═══════════════════════════════════════════════════════════════════
            // REVIEWER (Can write and manage reviews)
            // ═══════════════════════════════════════════════════════════════════
            new
            {
                Email = "Reviewer.Car@gmail.com",
                FirstName = "Approved",
                LastName = "Reviewer",
                Role = SD.Roles.Reviewer,
                Bio = "Trusted reviewer sharing honest experiences with service centers and products.",
                Location = "Seattle, WA",
                UserType = UserType.User,
                IsApproved = true
            },
            new
            {
                Email = "ReviewerPending.Car@gmail.com",
                FirstName = "Pending",
                LastName = "Reviewer",
                Role = SD.Roles.Reviewer,
                Bio = "Car enthusiast applying to become a verified reviewer.",
                Location = "Denver, CO",
                UserType = UserType.User,
                IsApproved = false
            },

            // ═══════════════════════════════════════════════════════════════════
            // AUTHOR/CONTENT CREATOR (Can create guides, articles)
            // ═══════════════════════════════════════════════════════════════════
            new
            {
                Email = "Author.Car@gmail.com",
                FirstName = "Approved",
                LastName = "Author",
                Role = SD.Roles.Author,
                Bio = "Content creator producing car maintenance guides and video tutorials.",
                Location = "Austin, TX",
                UserType = UserType.User,
                IsApproved = true
            },
            new
            {
                Email = "AuthorPending.Car@gmail.com",
                FirstName = "Pending",
                LastName = "Author",
                Role = SD.Roles.Author,
                Bio = "Automotive blogger applying for content creator status.",
                Location = "Portland, OR",
                UserType = UserType.User,
                IsApproved = false
            },

            // ═══════════════════════════════════════════════════════════════════
            // MECHANIC (Professional mechanic)
            // ═══════════════════════════════════════════════════════════════════
            new
            {
                Email = "Mechanic.Car@gmail.com",
                FirstName = "Approved",
                LastName = "Mechanic",
                Role = SD.Roles.Mechanic,
                Bio = "ASE certified mechanic specializing in hybrid and electric vehicles.",
                Location = "Miami, FL",
                UserType = UserType.Mechanic,
                IsApproved = true
            },
            new
            {
                Email = "MechanicPending.Car@gmail.com",
                FirstName = "Pending",
                LastName = "Mechanic",
                Role = SD.Roles.Mechanic,
                Bio = "Professional mechanic applying for verified status.",
                Location = "Phoenix, AZ",
                UserType = UserType.Mechanic,
                IsApproved = false
            },

            // ═══════════════════════════════════════════════════════════════════
            // GARAGE OWNER (Service center owner)
            // ═══════════════════════════════════════════════════════════════════
            new
            {
                Email = "GarageOwner.Car@gmail.com",
                FirstName = "Approved",
                LastName = "GarageOwner",
                Role = SD.Roles.GarageOwner,
                Bio = "Owner of Premium Auto Service - providing quality automotive services since 2005.",
                Location = "Houston, TX",
                UserType = UserType.GarageOwner,
                IsApproved = true
            },
            new
            {
                Email = "GarageOwnerPending.Car@gmail.com",
                FirstName = "Pending",
                LastName = "GarageOwner",
                Role = SD.Roles.GarageOwner,
                Bio = "New garage owner applying for business verification.",
                Location = "Dallas, TX",
                UserType = UserType.GarageOwner,
                IsApproved = false
            },

            // ═══════════════════════════════════════════════════════════════════
            // VENDOR (Marketplace seller)
            // ═══════════════════════════════════════════════════════════════════
            new
            {
                Email = "Vendor.Car@gmail.com",
                FirstName = "Approved",
                LastName = "Vendor",
                Role = SD.Roles.Vendor,
                Bio = "Auto parts vendor specializing in OEM and aftermarket components.",
                Location = "San Diego, CA",
                UserType = UserType.Vendor,
                IsApproved = true
            },
            new
            {
                Email = "VendorPending.Car@gmail.com",
                FirstName = "Pending",
                LastName = "Vendor",
                Role = SD.Roles.Vendor,
                Bio = "Parts supplier applying for vendor verification.",
                Location = "San Francisco, CA",
                UserType = UserType.Vendor,
                IsApproved = false
            },

            // ═══════════════════════════════════════════════════════════════════
            // INSTRUCTOR (Driving/maintenance instructor)
            // ═══════════════════════════════════════════════════════════════════
            new
            {
                Email = "Instructor.Car@gmail.com",
                FirstName = "Approved",
                LastName = "Instructor",
                Role = SD.Roles.Instructor,
                Bio = "Certified driving instructor with 10+ years of teaching experience.",
                Location = "Boston, MA",
                UserType = UserType.Instructor,
                IsApproved = true
            },
            new
            {
                Email = "InstructorPending.Car@gmail.com",
                FirstName = "Pending",
                LastName = "Instructor",
                Role = SD.Roles.Instructor,
                Bio = "Driving instructor applying for platform verification.",
                Location = "Atlanta, GA",
                UserType = UserType.Instructor,
                IsApproved = false
            },

            // ═══════════════════════════════════════════════════════════════════
            // STUDENT (Learning user)
            // ═══════════════════════════════════════════════════════════════════
            new
            {
                Email = "Student.Car@gmail.com",
                FirstName = "Active",
                LastName = "Student",
                Role = SD.Roles.Student,
                Bio = "Learning about car maintenance and driving skills.",
                Location = "Philadelphia, PA",
                UserType = UserType.User,
                IsApproved = true
            },

            // ═══════════════════════════════════════════════════════════════════
            // AFFILIATE (Marketing partner)
            // ═══════════════════════════════════════════════════════════════════
            new
            {
                Email = "Affiliate.Car@gmail.com",
                FirstName = "Approved",
                LastName = "Affiliate",
                Role = SD.Roles.Affiliate,
                Bio = "Automotive content creator and affiliate marketing partner.",
                Location = "Las Vegas, NV",
                UserType = UserType.Affiliate,
                IsApproved = true
            },
            new
            {
                Email = "AffiliatePending.Car@gmail.com",
                FirstName = "Pending",
                LastName = "Affiliate",
                Role = SD.Roles.Affiliate,
                Bio = "Blogger applying for affiliate partnership.",
                Location = "Orlando, FL",
                UserType = UserType.Affiliate,
                IsApproved = false
            }
        };

        foreach (var userInfo in demoUsers)
        {
            var existingUser = await _userManager.FindByEmailAsync(userInfo.Email);
            if (existingUser == null)
            {
                var demoUser = new ApplicationUser
                {
                    UserName = userInfo.Email,
                    Email = userInfo.Email,
                    FirstName = userInfo.FirstName,
                    LastName = userInfo.LastName,
                    Bio = userInfo.Bio,
                    Location = userInfo.Location,
                    EmailConfirmed = true,
                    UserType = userInfo.UserType,
                    AccountStatus = userInfo.IsApproved ? AccountStatus.Active : AccountStatus.PendingApproval,
                    VerificationStatus = userInfo.IsApproved ? VerificationStatus.FullyVerified : VerificationStatus.EmailVerified,
                    CreatedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 90)),
                    LastActivityAt = DateTime.UtcNow.AddHours(-Random.Shared.Next(1, 48)),
                    PreferredLanguage = "en",
                    Timezone = "UTC"
                };

                var result = await _userManager.CreateAsync(demoUser, defaultPassword);
                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(demoUser, userInfo.Role);
                    var status = userInfo.IsApproved ? "Approved" : "Pending";
                    Logger.LogInformation("Created demo user: {Email} with role {Role} ({Status})",
                        userInfo.Email, userInfo.Role, status);
                }
                else
                {
                    Logger.LogError("Failed to create demo user {Email}: {Errors}",
                        userInfo.Email, string.Join(", ", result.Errors.Select(e => e.Description)));
                }
            }
        }
    }
}