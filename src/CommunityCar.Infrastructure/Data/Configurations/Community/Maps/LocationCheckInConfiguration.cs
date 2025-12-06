using CommunityCar.Domain.Entities.Community.Maps;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Maps;

public class LocationCheckInConfiguration : IEntityTypeConfiguration<LocationCheckIn>
{
    public void Configure(EntityTypeBuilder<LocationCheckIn> builder)
    {
        builder.ToTable("LocationCheckIns", "community");
        builder.HasOne(c => c.Location)
              .WithMany(l => l.CheckIns)
              .HasForeignKey(c => c.LocationId)
              .OnDelete(DeleteBehavior.NoAction);
    }
}
