using CommunityCar.Domain.Entities.Community.Maps;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Maps;

public class MapLocationConfiguration : IEntityTypeConfiguration<MapLocation>
{
    public void Configure(EntityTypeBuilder<MapLocation> builder)
    {
        builder.ToTable("MapLocations", "community");
        builder.HasIndex(e => e.Slug).IsUnique();
        builder.HasOne(e => e.AddedBy)
              .WithMany()
              .HasForeignKey(e => e.AddedById)
              .OnDelete(DeleteBehavior.SetNull);
    }
}
