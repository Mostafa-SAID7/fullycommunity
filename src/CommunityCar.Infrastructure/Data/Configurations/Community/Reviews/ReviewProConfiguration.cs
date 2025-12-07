using CommunityCar.Domain.Entities.Community.Reviews;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Reviews;

public class ReviewProConfiguration : IEntityTypeConfiguration<ReviewPro>
{
    public void Configure(EntityTypeBuilder<ReviewPro> builder)
    {
        builder.ToTable("ReviewPro", "community");

        builder.HasKey(rp => rp.Id);

        builder.HasOne(rp => rp.Review)
            .WithMany(r => r.Pros)
            .HasForeignKey(rp => rp.ReviewId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(rp => rp.ReviewId);
        builder.HasIndex(rp => rp.SortOrder);
    }
}
