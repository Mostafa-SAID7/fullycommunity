using CommunityCar.Domain.Entities.Community.Maps;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Maps;

public class LocationReviewConfiguration : IEntityTypeConfiguration<LocationReview>
{
    public void Configure(EntityTypeBuilder<LocationReview> builder)
    {
        builder.ToTable("LocationReviews", "community");
        builder.HasOne(r => r.Location)
              .WithMany(l => l.Reviews)
              .HasForeignKey(r => r.LocationId)
              .OnDelete(DeleteBehavior.NoAction);
        builder.HasOne(r => r.Author)
              .WithMany()
              .HasForeignKey(r => r.AuthorId)
              .OnDelete(DeleteBehavior.NoAction);
    }
}
