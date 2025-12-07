using CommunityCar.Domain.Entities.Community.Reviews;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Reviews;

public class ReviewMediaConfiguration : IEntityTypeConfiguration<ReviewMedia>
{
    public void Configure(EntityTypeBuilder<ReviewMedia> builder)
    {
        builder.ToTable("ReviewMedia", "community");

        builder.HasKey(rm => rm.Id);

        builder.HasOne(rm => rm.Review)
            .WithMany(r => r.Media)
            .HasForeignKey(rm => rm.ReviewId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(rm => rm.ReviewId);
        builder.HasIndex(rm => rm.SortOrder);
    }
}
