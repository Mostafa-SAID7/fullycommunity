using CommunityCar.Domain.Entities.Community.Reviews;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Reviews;

public class ReviewCommentConfiguration : IEntityTypeConfiguration<ReviewComment>
{
    public void Configure(EntityTypeBuilder<ReviewComment> builder)
    {
        builder.ToTable("ReviewComment", "community");

        builder.HasOne(c => c.Review)
              .WithMany(r => r.Comments)
              .HasForeignKey(c => c.ReviewId)
              .OnDelete(DeleteBehavior.NoAction);
    }
}
