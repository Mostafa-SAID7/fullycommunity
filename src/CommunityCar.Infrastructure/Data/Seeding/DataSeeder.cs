using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Infrastructure.Data.Seeding.Core;
using CommunityCar.Infrastructure.Data.Seeding.Identity;
using CommunityCar.Infrastructure.Data.Seeding.Content;
using CommunityCar.Infrastructure.Data.Seeding.Community;
using CommunityCar.Infrastructure.Data.Seeding.Home;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace CommunityCar.Infrastructure.Data.Seeding;

/// <summary>
/// Main data seeder orchestrator that runs all seeders in proper order
/// </summary>
public class DataSeeder
{
    private readonly AppDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<ApplicationRole> _roleManager;
    private readonly ILogger<DataSeeder> _logger;
    private readonly ILoggerFactory _loggerFactory;
    private readonly List<ISeeder> _seeders;

    public DataSeeder(
        AppDbContext context,
        UserManager<ApplicationUser> userManager,
        RoleManager<ApplicationRole> roleManager,
        ILoggerFactory loggerFactory)
    {
        _context = context;
        _userManager = userManager;
        _roleManager = roleManager;
        _loggerFactory = loggerFactory;
        _logger = loggerFactory.CreateLogger<DataSeeder>();

        // Initialize all seeders in dependency order
        _seeders = new List<ISeeder>
        {
            // Identity seeders (must run first)
            new RoleSeeder(_context, _roleManager, _loggerFactory.CreateLogger<RoleSeeder>()),
            new AdminUserSeeder(_context, _userManager, _loggerFactory.CreateLogger<AdminUserSeeder>()),
            new DemoUserSeeder(_context, _userManager, _loggerFactory.CreateLogger<DemoUserSeeder>()),
            
            // Content seeders (depend on users)
            new GroupSeeder(_context, _loggerFactory.CreateLogger<GroupSeeder>()),
            new PostCategorySeeder(_context, _loggerFactory.CreateLogger<PostCategorySeeder>()),
            new CommunityContentSeeder(_context, _loggerFactory.CreateLogger<CommunityContentSeeder>()),
            new PostSeeder(_context, _loggerFactory.CreateLogger<PostSeeder>()),
            new NewsSeeder(_context, _loggerFactory.CreateLogger<NewsSeeder>()),
            new MapsSeeder(_context, _loggerFactory.CreateLogger<MapsSeeder>()),
            
            // Media content seeders
            new VideoSeeder(_context, _loggerFactory.CreateLogger<VideoSeeder>()),
            new PodcastSeeder(_context, _loggerFactory.CreateLogger<PodcastSeeder>()),
            
            // Marketplace seeders
            new MarketplaceSeeder(_context, _loggerFactory.CreateLogger<MarketplaceSeeder>()),
            
            // Services seeders
            new ServicesSeeder(_context, _loggerFactory.CreateLogger<ServicesSeeder>()),
            
            // Community seeders
            new PageSeeder(_context, _loggerFactory.CreateLogger<PageSeeder>()),
            new StorySeeder(_context, _loggerFactory.CreateLogger<StorySeeder>())
        };
    }

    /// <summary>
    /// Run all seeders in order
    /// </summary>
    public async Task SeedAsync()
    {
        _logger.LogInformation("Starting database seeding process...");

        try
        {
            // Ensure database is created
            await _context.Database.EnsureCreatedAsync();

            // Run seeders in order
            var orderedSeeders = _seeders.OrderBy(s => s.Order).ToList();

            foreach (var seeder in orderedSeeders)
            {
                await seeder.SeedAsync();
            }

            _logger.LogInformation("Database seeding completed successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during database seeding: {Message}", ex.Message);
            throw;
        }
    }

    /// <summary>
    /// Run only identity seeders (for production)
    /// </summary>
    public async Task SeedProductionAsync()
    {
        _logger.LogInformation("Starting production database seeding...");

        try
        {
            await _context.Database.EnsureCreatedAsync();

            // Only run identity seeders for production
            var identitySeeders = _seeders
                .Where(s => s.GetType().Namespace!.Contains("Identity"))
                .OrderBy(s => s.Order)
                .ToList();

            foreach (var seeder in identitySeeders)
            {
                await seeder.SeedAsync();
            }

            _logger.LogInformation("Production database seeding completed successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during production database seeding: {Message}", ex.Message);
            throw;
        }
    }

    /*
    /// <summary>
    /// Run specific seeder by type
    /// </summary>
    public async Task SeedAsync<T>() where T : ISeeder
    {
        var seeder = _seeders.OfType<T>().FirstOrDefault();
        if (seeder != null)
        {
            await seeder.SeedAsync();
        }
        else
        {
            _logger.LogWarning("Seeder of type {SeederType} not found", typeof(T).Name);
        }
    }
    */
}
