// PodcastSeeder content commented out due to missing enums
/*
using CommunityCar.Domain.Entities.Podcasts.Shows;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Enums;
using CommunityCar.Infrastructure.Data.Seeding.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CommunityCar.Infrastructure.Data.Seeding.Content;

/// <summary>
/// Seeds podcast shows and episodes for the main application
/// </summary>
public class PodcastSeeder : BaseSeeder
{
    public PodcastSeeder(AppDbContext context, ILogger<PodcastSeeder> logger) 
        : base(context, logger)
    {
    }

    public override int Order => 11;
    public override string Name => "Podcast Seeder";

    public override async Task<bool> ShouldSeedAsync()
    {
        return !await Context.Set<PodcastShow>().AnyAsync();
    }

    protected override async Task ExecuteSeedAsync()
    {
        // ... (rest of the code)
    }
}
*/