using CommunityCar.Domain.Entities.Community.Maps;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Maps;

public class LocationFeatureConfiguration : IEntityTypeConfiguration<LocationFeature>
{
    public void Configure(EntityTypeBuilder<LocationFeature> builder)
    {
        builder.ToTable("LocationFeatures", "community");
        builder.HasOne(f => f.Location)
              .WithMany(l => l.Features)
              .HasForeignKey(f => f.LocationId)
              .OnDelete(DeleteBehavior.Cascade);
    }
}
