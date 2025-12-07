using CommunityCar.Domain.Entities.Community.Maps;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Maps;

public class LocationMediaConfiguration : IEntityTypeConfiguration<LocationMedia>
{
    public void Configure(EntityTypeBuilder<LocationMedia> builder)
    {
        builder.ToTable("LocationMedia", "community");

        builder.HasKey(lm => lm.Id);

        builder.HasOne(lm => lm.Location)
            .WithMany(l => l.Media)
            .HasForeignKey(lm => lm.LocationId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
