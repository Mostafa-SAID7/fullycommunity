using CommunityCar.Domain.Entities.Podcasts.Engagement;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Podcasts;

public class EpisodeReactionConfiguration : IEntityTypeConfiguration<EpisodeReaction>
{
    public void Configure(EntityTypeBuilder<EpisodeReaction> builder)
    {
        builder.HasOne(r => r.Episode)
              .WithMany(e => e.Reactions)
              .HasForeignKey(r => r.EpisodeId)
              .OnDelete(DeleteBehavior.NoAction);
    }
}
