using CommunityCar.Domain.Entities.Videos.Content;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations;

public class VideoConfiguration : IEntityTypeConfiguration<Video>
{
    public void Configure(EntityTypeBuilder<Video> builder)
    {
        builder.HasKey(v => v.Id);

        // Self-referencing relationship for Duets
        builder.HasOne(v => v.DuetOfVideo)
            .WithMany()
            .HasForeignKey(v => v.DuetOfVideoId)
            .OnDelete(DeleteBehavior.Restrict)
            .IsRequired(false);

        // Self-referencing relationship for Stitches
        builder.HasOne(v => v.StitchOfVideo)
            .WithMany()
            .HasForeignKey(v => v.StitchOfVideoId)
            .OnDelete(DeleteBehavior.Restrict)
            .IsRequired(false);

        // Self-referencing relationship for Replies
        builder.HasOne(v => v.ReplyToVideo)
            .WithMany()
            .HasForeignKey(v => v.ReplyToVideoId)
            .OnDelete(DeleteBehavior.Restrict)
            .IsRequired(false);

        // Channel relationship
        builder.HasOne(v => v.Channel)
            .WithMany()
            .HasForeignKey(v => v.ChannelId)
            .OnDelete(DeleteBehavior.Cascade);

        // Category relationship
        builder.HasOne(v => v.Category)
            .WithMany()
            .HasForeignKey(v => v.CategoryId)
            .OnDelete(DeleteBehavior.SetNull)
            .IsRequired(false);

        // Sound relationship
        builder.HasOne(v => v.Sound)
            .WithMany()
            .HasForeignKey(v => v.SoundId)
            .OnDelete(DeleteBehavior.SetNull)
            .IsRequired(false);
    }
}
