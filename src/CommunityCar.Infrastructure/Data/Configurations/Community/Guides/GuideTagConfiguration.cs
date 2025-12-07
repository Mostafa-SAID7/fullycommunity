using CommunityCar.Domain.Entities.Community.Guides;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Guides;

public class GuideTagConfiguration : IEntityTypeConfiguration<GuideTag>
{
    public void Configure(EntityTypeBuilder<GuideTag> builder)
    {
        builder.ToTable("GuideTag", "community");

        builder.HasKey(gt => gt.Id);

        builder.HasOne(gt => gt.Guide)
            .WithMany(g => g.Tags)
            .HasForeignKey(gt => gt.GuideId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(gt => new { gt.GuideId, gt.Tag });
    }
}
