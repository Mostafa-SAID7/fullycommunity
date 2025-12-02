using CommunityCar.API.Scripts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.API.Controllers.Admin;

/// <summary>
/// Admin controller for database seeding operations
/// </summary>
[ApiController]
[Route("api/admin/[controller]")]
[Authorize(Policy = "AdminOnly")]
[ApiExplorerSettings(GroupName = "dashboard")]
public class SeedingController : ControllerBase
{
    private readonly IServiceProvider _services;
    private readonly ILogger<SeedingController> _logger;

    public SeedingController(IServiceProvider services, ILogger<SeedingController> logger)
    {
        _services = services;
        _logger = logger;
    }

    /// <summary>
    /// Get current seeding status and data counts
    /// </summary>
    [HttpGet("status")]
    public async Task<ActionResult<SeedingReport>> GetSeedingStatus()
    {
        try
        {
            var report = await Scripts.TestSeeding.GetSeedingReportAsync(_services);
            return Ok(report);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting seeding status");
            return StatusCode(500, "Error retrieving seeding status");
        }
    }

    /// <summary>
    /// Test seeding functionality (development only)
    /// </summary>
    [HttpPost("test")]
    public async Task<ActionResult<object>> TestSeeding()
    {
        if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")?.Equals("Production", StringComparison.OrdinalIgnoreCase) == true)
        {
            return BadRequest("Seeding test is not available in production");
        }

        try
        {
            var success = await Scripts.TestSeeding.TestSeedingAsync(_services);
            
            if (success)
            {
                var report = await Scripts.TestSeeding.GetSeedingReportAsync(_services);
                return Ok(new { Success = true, Message = "Seeding test completed successfully", Report = report });
            }
            else
            {
                return StatusCode(500, new { Success = false, Message = "Seeding test failed" });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during seeding test");
            return StatusCode(500, new { Success = false, Message = ex.Message });
        }
    }

    /// <summary>
    /// Seed community content (posts, reviews, guides)
    /// </summary>
    [HttpPost("content")]
    public async Task<ActionResult<object>> SeedContent()
    {
        if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")?.Equals("Production", StringComparison.OrdinalIgnoreCase) == true)
        {
            return BadRequest("Content seeding is not available in production");
        }

        try
        {
            using var scope = _services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<Infrastructure.Data.AppDbContext>();
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<Infrastructure.Data.Seeding.Content.CommunityContentSeeder>>();
            
            var seeder = new Infrastructure.Data.Seeding.Content.CommunityContentSeeder(context, logger);
            await seeder.SeedAsync();
            
            return Ok(new { 
                Success = true, 
                Message = "Content seeded successfully",
                Stats = new {
                    Posts = await context.Posts.CountAsync(),
                    Reviews = await context.Reviews.CountAsync(),
                    Guides = await context.Guides.CountAsync(),
                    Questions = await context.Questions.CountAsync()
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding content");
            return StatusCode(500, new { Success = false, Message = ex.Message });
        }
    }

    /// <summary>
    /// Seed moderation reports for testing
    /// </summary>
    [HttpPost("moderation")]
    public async Task<ActionResult<object>> SeedModerationReports()
    {
        if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")?.Equals("Production", StringComparison.OrdinalIgnoreCase) == true)
        {
            return BadRequest("Moderation seeding is not available in production");
        }

        try
        {
            using var scope = _services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<Infrastructure.Data.AppDbContext>();
            
            if (await context.ContentReports.AnyAsync())
            {
                return Ok(new { Success = true, Message = "Moderation reports already seeded", Count = await context.ContentReports.CountAsync() });
            }

            var posts = await context.Posts.Where(p => !p.IsDeleted).Take(3).ToListAsync();
            var reviews = await context.Reviews.Where(r => !r.IsDeleted).Take(2).ToListAsync();
            var users = await context.Users.Where(u => !u.IsDeleted).Take(5).ToListAsync();

            if (!posts.Any() || !users.Any())
            {
                return BadRequest(new { Success = false, Message = "Please seed content first" });
            }

            var reports = new List<Domain.Entities.Moderation.ContentReport>();
            var reasons = new[] { 
                Domain.Entities.Moderation.ReportReason.Spam,
                Domain.Entities.Moderation.ReportReason.Inappropriate,
                Domain.Entities.Moderation.ReportReason.Harassment
            };

            foreach (var post in posts)
            {
                var reporter = users[Random.Shared.Next(users.Count)];
                reports.Add(new Domain.Entities.Moderation.ContentReport
                {
                    ContentId = post.Id,
                    ContentType = "post",
                    ContentTitle = post.Title,
                    ReporterId = reporter.Id,
                    ContentAuthorId = post.AuthorId,
                    Reason = reasons[Random.Shared.Next(reasons.Length)],
                    Priority = (Domain.Entities.Moderation.ReportPriority)Random.Shared.Next(4),
                    CreatedAt = DateTime.UtcNow.AddHours(-Random.Shared.Next(1, 48))
                });
            }

            foreach (var review in reviews)
            {
                var reporter = users[Random.Shared.Next(users.Count)];
                reports.Add(new Domain.Entities.Moderation.ContentReport
                {
                    ContentId = review.Id,
                    ContentType = "review",
                    ContentTitle = review.Title ?? "Review",
                    ReporterId = reporter.Id,
                    ContentAuthorId = review.AuthorId,
                    Reason = Domain.Entities.Moderation.ReportReason.Spam,
                    Priority = Domain.Entities.Moderation.ReportPriority.Normal,
                    CreatedAt = DateTime.UtcNow.AddHours(-Random.Shared.Next(1, 24))
                });
            }

            context.ContentReports.AddRange(reports);
            await context.SaveChangesAsync();

            return Ok(new { Success = true, Message = "Moderation reports seeded", Count = reports.Count });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding moderation reports");
            return StatusCode(500, new { Success = false, Message = ex.Message });
        }
    }

    /// <summary>
    /// Get seeding documentation and user accounts
    /// </summary>
    [HttpGet("info")]
    public ActionResult<object> GetSeedingInfo()
    {
        var info = new
        {
            Password = "Car@1234 (same for all accounts)",
            AdminAccounts = new[]
            {
                new { Email = "SuperAdmin.Car@gmail.com", Role = "SuperAdmin", Status = "Active" },
                new { Email = "CommunityAdmin.Car@gmail.com", Role = "Admin", Status = "Active" },
                new { Email = "ContentModerator.Car@gmail.com", Role = "Moderator", Status = "Active" },
                new { Email = "UserManager.Car@gmail.com", Role = "Admin", Status = "Active" },
                new { Email = "ReportsAdmin.Car@gmail.com", Role = "Admin", Status = "Active" }
            },
            UserAccounts = new[]
            {
                // Regular User
                new { Email = "User.Car@gmail.com", Role = "User", Status = "Approved", Dashboard = "User Dashboard" },
                
                // Experts
                new { Email = "Expert.Car@gmail.com", Role = "Expert", Status = "Approved", Dashboard = "Expert Dashboard" },
                new { Email = "ExpertPending.Car@gmail.com", Role = "Expert", Status = "Pending Approval", Dashboard = "Expert Dashboard (Limited)" },
                
                // Reviewers
                new { Email = "Reviewer.Car@gmail.com", Role = "Reviewer", Status = "Approved", Dashboard = "Reviewer Dashboard" },
                new { Email = "ReviewerPending.Car@gmail.com", Role = "Reviewer", Status = "Pending Approval", Dashboard = "Reviewer Dashboard (Limited)" },
                
                // Authors/Content Creators
                new { Email = "Author.Car@gmail.com", Role = "Author", Status = "Approved", Dashboard = "Author Dashboard" },
                new { Email = "AuthorPending.Car@gmail.com", Role = "Author", Status = "Pending Approval", Dashboard = "Author Dashboard (Limited)" },
                
                // Mechanics
                new { Email = "Mechanic.Car@gmail.com", Role = "Mechanic", Status = "Approved", Dashboard = "Mechanic Dashboard" },
                new { Email = "MechanicPending.Car@gmail.com", Role = "Mechanic", Status = "Pending Approval", Dashboard = "Mechanic Dashboard (Limited)" },
                
                // Garage Owners
                new { Email = "GarageOwner.Car@gmail.com", Role = "GarageOwner", Status = "Approved", Dashboard = "Garage Owner Dashboard" },
                new { Email = "GarageOwnerPending.Car@gmail.com", Role = "GarageOwner", Status = "Pending Approval", Dashboard = "Garage Owner Dashboard (Limited)" },
                
                // Vendors
                new { Email = "Vendor.Car@gmail.com", Role = "Vendor", Status = "Approved", Dashboard = "Vendor Dashboard" },
                new { Email = "VendorPending.Car@gmail.com", Role = "Vendor", Status = "Pending Approval", Dashboard = "Vendor Dashboard (Limited)" },
                
                // Instructors
                new { Email = "Instructor.Car@gmail.com", Role = "Instructor", Status = "Approved", Dashboard = "Instructor Dashboard" },
                new { Email = "InstructorPending.Car@gmail.com", Role = "Instructor", Status = "Pending Approval", Dashboard = "Instructor Dashboard (Limited)" },
                
                // Students
                new { Email = "Student.Car@gmail.com", Role = "Student", Status = "Approved", Dashboard = "Student Dashboard" },
                
                // Affiliates
                new { Email = "Affiliate.Car@gmail.com", Role = "Affiliate", Status = "Approved", Dashboard = "Affiliate Dashboard" },
                new { Email = "AffiliatePending.Car@gmail.com", Role = "Affiliate", Status = "Pending Approval", Dashboard = "Affiliate Dashboard (Limited)" }
            },
            Applications = new
            {
                MainApp = new { Port = 4200, Url = "http://localhost:4200", Purpose = "Public users and role-based dashboards" },
                AdminApp = new { Port = 4201, Url = "http://localhost:4201", Purpose = "Admin dashboard and management" }
            },
            SeedingModes = new
            {
                Production = "Only essential data (roles and admin users)",
                Development = "Full demo data including users and content"
            }
        };

        return Ok(info);
    }
}
