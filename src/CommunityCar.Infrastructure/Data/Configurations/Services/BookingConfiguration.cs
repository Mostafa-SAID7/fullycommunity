using CommunityCar.Domain.Entities.Services.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Services;

public class BookingConfiguration : IEntityTypeConfiguration<Booking>
{
    public void Configure(EntityTypeBuilder<Booking> builder)
    {
        builder.ToTable("Bookings", "services");
        
        builder.HasIndex(e => e.BookingNumber).IsUnique();
        builder.HasIndex(e => new { e.CustomerId, e.Status });
        builder.HasIndex(e => new { e.ProviderId, e.Status });
        builder.HasIndex(e => e.ScheduledStart);
        
        builder.Property(e => e.BookingNumber).HasMaxLength(50).IsRequired();
        builder.Property(e => e.ServiceType).HasMaxLength(100).IsRequired();
        builder.Property(e => e.ServiceDescription).HasMaxLength(1000);
        builder.Property(e => e.ServiceAddress).HasMaxLength(500);
        builder.Property(e => e.VehicleMake).HasMaxLength(100);
        builder.Property(e => e.VehicleModel).HasMaxLength(100);
        builder.Property(e => e.LicensePlate).HasMaxLength(20);
        builder.Property(e => e.CustomerNotes).HasMaxLength(1000);
        builder.Property(e => e.ProviderNotes).HasMaxLength(1000);
        builder.Property(e => e.InternalNotes).HasMaxLength(1000);
        builder.Property(e => e.CancellationReason).HasMaxLength(500);
        builder.Property(e => e.ReviewText).HasMaxLength(2000);
        
        builder.HasOne(e => e.Customer)
            .WithMany()
            .HasForeignKey(e => e.CustomerId)
            .OnDelete(DeleteBehavior.NoAction);
            
        builder.HasOne(e => e.Provider)
            .WithMany()
            .HasForeignKey(e => e.ProviderId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}
