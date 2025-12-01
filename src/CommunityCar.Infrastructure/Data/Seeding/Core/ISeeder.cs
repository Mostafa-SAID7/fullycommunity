namespace CommunityCar.Infrastructure.Data.Seeding.Core;

/// <summary>
/// Base interface for all seeders
/// </summary>
public interface ISeeder
{
    /// <summary>
    /// Execution order (lower numbers run first)
    /// </summary>
    int Order { get; }

    /// <summary>
    /// Seeder name for logging
    /// /// </summary>
    string Name { get; }

    /// <summary>
    /// Execute the seeding operation
    /// </summary>
    /// <summary>
    /// Execute the seeding operation
    /// </summary>
    Task SeedAsync();

    /// <summary>
    /// Check if seeding is needed
    /// /// </summary>
    Task<bool> ShouldSeedAsync();
}