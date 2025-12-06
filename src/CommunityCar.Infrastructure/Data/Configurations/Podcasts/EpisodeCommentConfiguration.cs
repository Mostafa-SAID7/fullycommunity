using CommunityCar.Domain.Entities.Podcasts.Engagement;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Podcasts;

public class EpisodeCommentConfiguration : IEntityTypeConfiguration<EpisodeComment>
{
    public void Configure(EntityTypeBuilder<EpisodeComment> builder)
    {
        builder.HasOne(c => c.Episode)
              .WithMany(e => e.Comments)
              .HasForeignKey(c => c.EpisodeId)
              .OnDelete(DeleteBehavior.NoAction);
    }
}
