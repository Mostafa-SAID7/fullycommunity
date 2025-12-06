using CommunityCar.Domain.Entities.Videos.Playlists;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Videos;

public class PlaylistItemConfiguration : IEntityTypeConfiguration<PlaylistItem>
{
    public void Configure(EntityTypeBuilder<PlaylistItem> builder)
    {
        builder.HasOne(p => p.Video)
              .WithMany()
              .HasForeignKey(p => p.VideoId)
              .OnDelete(DeleteBehavior.NoAction);
    }
}
