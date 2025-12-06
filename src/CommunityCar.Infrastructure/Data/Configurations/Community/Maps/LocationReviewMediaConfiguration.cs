using CommunityCar.Domain.Entities.Community.Maps;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Maps;

public class LocationReviewMediaConfiguration : IEntityTypeConfiguration<LocationReviewMedia>
{
    public void Configure(EntityTypeBuilder<LocationReviewMedia> builder)
    {
        builder.ToTable("LocationReviewMedia", "community");
        builder.HasOne(m => m.LocationReview)
              .WithMany(r => r.Media)
              .HasForeignKey(m => m.LocationReviewId)
              .OnDelete(DeleteBehavior.Cascade);
    }
}
