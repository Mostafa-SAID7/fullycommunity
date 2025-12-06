using CommunityCar.Domain.Entities.Home;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Home;

public class StoryLikeConfiguration : IEntityTypeConfiguration<StoryLike>
{
    public void Configure(EntityTypeBuilder<StoryLike> builder)
    {
        builder.ToTable("StoryLikes", "home");
        builder.HasOne(l => l.Story)
              .WithMany(s => s.Likes)
              .HasForeignKey(l => l.StoryId)
              .OnDelete(DeleteBehavior.NoAction);
        builder.HasOne(l => l.User)
              .WithMany()
              .HasForeignKey(l => l.UserId)
              .OnDelete(DeleteBehavior.NoAction);
    }
}
