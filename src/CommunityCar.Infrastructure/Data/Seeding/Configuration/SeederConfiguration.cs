namespace CommunityCar.Infrastructure.Data.Seeding.Configuration;

/// <summary>
/// Configuration options for data seeding
/// </summary>
public class SeederConfiguration
{
    /// <summary>
    /// Whether to seed demo data (false for production)
    /// </summary>
    public bool SeedDemoData { get; set; } = true;

    /// <summary>
    /// Whether to seed content data
    /// </summary>
    public bool SeedContentData { get; set; } = true;

    /// <summary>
    /// Whether to force re-seeding (dangerous - will clear existing data)
    /// </summary>
    public bool ForceReseed { get; set; } = false;

    /// <summary>
    /// Environment name for conditional seeding
    /// </summary>
    public string Environment { get; set; } = "Development";

    /// <summary>
    /// Number of demo users to create per role
    /// </summary>
    public int DemoUsersPerRole { get; set; } = 2;

    /// <summary>
    /// /// Number of demo content items to create
    /// </summary>
    public int DemoContentCount { get; set; } = 10;

    /// <summary>
    /// /// Whether this is a production environment
    /// </summary>
    /// public bool IsProduction => Environment.Equals("Production", StringComparison.OrdinalIgnoreCase);

    /// <summary>
    /// Whether this is a development environment
    /// </summary>
    public bool IsDevelopment => Environment.Equals("Development", StringComparison.OrdinalIgnoreCase);
}