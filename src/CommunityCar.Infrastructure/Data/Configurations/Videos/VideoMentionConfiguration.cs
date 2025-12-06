using CommunityCar.Domain.Entities.Videos.Engagement;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Videos;

public class VideoMentionConfiguration : IEntityTypeConfiguration<VideoMention>
{
    public void Configure(EntityTypeBuilder<VideoMention> builder)
    {
        builder.HasOne(m => m.Video)
              .WithMany(v => v.Mentions)
              .HasForeignKey(m => m.VideoId)
              .OnDelete(DeleteBehavior.NoAction);
    }
}
