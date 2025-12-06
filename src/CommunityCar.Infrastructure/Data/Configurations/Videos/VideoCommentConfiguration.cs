using CommunityCar.Domain.Entities.Videos.Engagement;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Videos;

public class VideoCommentConfiguration : IEntityTypeConfiguration<VideoComment>
{
    public void Configure(EntityTypeBuilder<VideoComment> builder)
    {
        builder.HasOne(c => c.Video)
              .WithMany(v => v.Comments)
              .HasForeignKey(c => c.VideoId)
              .OnDelete(DeleteBehavior.NoAction);
    }
}
