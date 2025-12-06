using CommunityCar.Domain.Entities.Community.Pages;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Pages;

public class PageReviewConfiguration : IEntityTypeConfiguration<PageReview>
{
    public void Configure(EntityTypeBuilder<PageReview> builder)
    {
        builder.ToTable("PageReviews", "community");
        builder.HasOne(r => r.Page)
              .WithMany(p => p.Reviews)
              .HasForeignKey(r => r.PageId)
              .OnDelete(DeleteBehavior.NoAction);
        builder.HasOne(r => r.User)
              .WithMany()
              .HasForeignKey(r => r.UserId)
              .OnDelete(DeleteBehavior.NoAction);
    }
}
