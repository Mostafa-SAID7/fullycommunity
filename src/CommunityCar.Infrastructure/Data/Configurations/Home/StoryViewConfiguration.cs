using CommunityCar.Domain.Entities.Home;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Home;

public class StoryViewConfiguration : IEntityTypeConfiguration<StoryView>
{
    public void Configure(EntityTypeBuilder<StoryView> builder)
    {
        builder.ToTable("StoryViews", "home");
        builder.HasOne(v => v.Story)
              .WithMany(s => s.Views)
              .HasForeignKey(v => v.StoryId)
              .OnDelete(DeleteBehavior.NoAction);
        builder.HasOne(v => v.User)
              .WithMany()
              .HasForeignKey(v => v.UserId)
              .OnDelete(DeleteBehavior.NoAction);
    }
}
