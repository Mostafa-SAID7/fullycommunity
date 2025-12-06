using CommunityCar.Domain.Entities.Community.Maps;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Maps;

public class LocationMediaConfiguration : IEntityTypeConfiguration<LocationMedia>
{
    public void Configure(EntityTypeBuilder<LocationMedia> builder)
    {
        builder.ToTable("LocationMedia", "community");
        builder.HasOne(m => m.Location)
              .WithMany(l => l.Media)
              .HasForeignKey(m => m.LocationId)
              .OnDelete(DeleteBehavior.Cascade);
    }
}
