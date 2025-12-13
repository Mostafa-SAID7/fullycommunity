using CommunityCar.Domain.Entities.Services.FuelCharging;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Services;

public class FuelStationConfiguration : IEntityTypeConfiguration<FuelStation>
{
    public void Configure(EntityTypeBuilder<FuelStation> builder)
    {
        builder.ToTable("FuelStations", "services");

        builder.HasIndex(e => e.Name);
        builder.HasIndex(e => e.Brand);
        builder.HasIndex(e => new { e.City, e.Status });
        builder.HasIndex(e => new { e.Latitude, e.Longitude });

        builder.Property(e => e.Name).HasMaxLength(200).IsRequired();
        builder.Property(e => e.Brand).HasMaxLength(100);
        builder.Property(e => e.Description).HasMaxLength(2000);
        builder.Property(e => e.Address).HasMaxLength(500);
        builder.Property(e => e.City).HasMaxLength(100);
        builder.Property(e => e.State).HasMaxLength(100);
        builder.Property(e => e.Country).HasMaxLength(100);
        builder.Property(e => e.PetrolPrice).HasPrecision(18, 2);
        builder.Property(e => e.DieselPrice).HasPrecision(18, 2);
        builder.Property(e => e.PremiumPrice).HasPrecision(18, 2);

        builder.HasOne(e => e.Provider)
            .WithMany()
            .HasForeignKey(e => e.ProviderId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
