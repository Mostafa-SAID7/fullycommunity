using CommunityCar.Domain.Entities.Home;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Home;

public class StoryConfiguration : IEntityTypeConfiguration<Story>
{
    public void Configure(EntityTypeBuilder<Story> builder)
    {
        builder.ToTable("Stories", "home");
        builder.HasOne(s => s.User)
              .WithMany()
              .HasForeignKey(s => s.UserId)
              .OnDelete(DeleteBehavior.NoAction);
        builder.HasOne(s => s.Page)
              .WithMany(p => p.Stories)
              .HasForeignKey(s => s.PageId)
              .OnDelete(DeleteBehavior.SetNull);
    }
}
