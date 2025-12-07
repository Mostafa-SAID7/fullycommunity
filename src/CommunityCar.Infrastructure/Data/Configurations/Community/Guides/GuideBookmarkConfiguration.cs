using CommunityCar.Domain.Entities.Community.Guides;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Guides;

public class GuideBookmarkConfiguration : IEntityTypeConfiguration<GuideBookmark>
{
    public void Configure(EntityTypeBuilder<GuideBookmark> builder)
    {
        builder.ToTable("GuideBookmarks", "community");

        builder.HasKey(gb => gb.Id);

        builder.HasOne(gb => gb.Guide)
            .WithMany()
            .HasForeignKey(gb => gb.GuideId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(gb => new { gb.GuideId, gb.UserId }).IsUnique();
    }
}
