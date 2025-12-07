using CommunityCar.Domain.Entities.Community.Maps;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Maps;

public class LocationReviewMediaConfiguration : IEntityTypeConfiguration<LocationReviewMedia>
{
    public void Configure(EntityTypeBuilder<LocationReviewMedia> builder)
    {
        builder.ToTable("LocationReviewMedia", "community");

        builder.HasKey(lrm => lrm.Id);

        builder.HasOne(lrm => lrm.LocationReview)
            .WithMany(r => r.Media)
            .HasForeignKey(lrm => lrm.LocationReviewId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
