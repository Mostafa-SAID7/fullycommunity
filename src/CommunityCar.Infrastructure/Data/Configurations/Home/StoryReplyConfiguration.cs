using CommunityCar.Domain.Entities.Home;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Home;

public class StoryReplyConfiguration : IEntityTypeConfiguration<StoryReply>
{
    public void Configure(EntityTypeBuilder<StoryReply> builder)
    {
        builder.ToTable("StoryReplies", "home");
        builder.HasOne(r => r.Story)
              .WithMany(s => s.Replies)
              .HasForeignKey(r => r.StoryId)
              .OnDelete(DeleteBehavior.NoAction);
        builder.HasOne(r => r.User)
              .WithMany()
              .HasForeignKey(r => r.UserId)
              .OnDelete(DeleteBehavior.NoAction);
    }
}
