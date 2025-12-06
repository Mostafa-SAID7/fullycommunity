using CommunityCar.Domain.Entities.Videos.Engagement;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Videos;

public class VideoReactionConfiguration : IEntityTypeConfiguration<VideoReaction>
{
    public void Configure(EntityTypeBuilder<VideoReaction> builder)
    {
        builder.HasOne(r => r.Video)
              .WithMany(v => v.Reactions)
              .HasForeignKey(r => r.VideoId)
              .OnDelete(DeleteBehavior.NoAction);
    }
}
