using Microsoft.Extensions.Logging;

namespace CommunityCar.Infrastructure.Data.Seeding.Core;

/// <summary>
/// Base class for all seeders with common functionality
/// </summary>
public abstract class BaseSeeder : ISeeder
{
    protected readonly AppDbContext Context;
    protected readonly ILogger Logger;

    protected BaseSeeder(AppDbContext context, ILogger logger)
    {
        Context = context;
        Logger = logger;
    }

    public abstract int Order { get; }
    public abstract string Name { get; }

    public async Task SeedAsync()
    {
        try
        {
            if (!await ShouldSeedAsync())
            {
                Logger.LogInformation("Skipping {SeederName} - already seeded", Name);
                return;
            }

            Logger.LogInformation("Starting {SeederName}", Name);
            
            await ExecuteSeedAsync();
            await Context.SaveChangesAsync();
            
            Logger.LogInformation("Completed {SeederName}", Name);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Error in {SeederName}: {Message}", Name, ex.Message);
            throw;
        }
    }

    public abstract Task<bool> ShouldSeedAsync();
    
    /// <summary>
    /// Override this method to implement seeding logic
    /// </summary>
    protected abstract Task ExecuteSeedAsync();
}