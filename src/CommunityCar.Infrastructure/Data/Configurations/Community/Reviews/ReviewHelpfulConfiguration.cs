using CommunityCar.Domain.Entities.Community.Reviews;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Reviews;

public class ReviewHelpfulConfiguration : IEntityTypeConfiguration<ReviewHelpful>
{
    public void Configure(EntityTypeBuilder<ReviewHelpful> builder)
    {
        builder.ToTable("ReviewHelpful", "community");

        builder.HasKey(rh => rh.Id);

        builder.HasOne(rh => rh.Review)
            .WithMany()
            .HasForeignKey(rh => rh.ReviewId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(rh => new { rh.ReviewId, rh.UserId }).IsUnique();
        builder.HasIndex(rh => rh.CreatedAt);
    }
}
