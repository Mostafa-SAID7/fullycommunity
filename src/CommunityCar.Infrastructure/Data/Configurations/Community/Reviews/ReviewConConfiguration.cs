using CommunityCar.Domain.Entities.Community.Reviews;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Reviews;

public class ReviewConConfiguration : IEntityTypeConfiguration<ReviewCon>
{
    public void Configure(EntityTypeBuilder<ReviewCon> builder)
    {
        builder.ToTable("ReviewCon", "community");

        builder.HasKey(rc => rc.Id);

        builder.HasOne(rc => rc.Review)
            .WithMany(r => r.Cons)
            .HasForeignKey(rc => rc.ReviewId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(rc => rc.ReviewId);
        builder.HasIndex(rc => rc.SortOrder);
    }
}
