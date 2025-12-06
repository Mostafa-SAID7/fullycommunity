using CommunityCar.Domain.Entities.Services.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Services;

public class ServiceProviderConfiguration : IEntityTypeConfiguration<ServiceProvider>
{
    public void Configure(EntityTypeBuilder<ServiceProvider> builder)
    {
        builder.ToTable("ServiceProviders", "services");
        
        builder.HasIndex(e => e.BusinessName);
        builder.HasIndex(e => new { e.City, e.Status });
        builder.HasIndex(e => e.Status);
        builder.HasIndex(e => e.AverageRating);
        
        builder.Property(e => e.BusinessName).HasMaxLength(200).IsRequired();
        builder.Property(e => e.Description).HasMaxLength(2000);
        builder.Property(e => e.LogoUrl).HasMaxLength(500);
        builder.Property(e => e.BannerUrl).HasMaxLength(500);
        builder.Property(e => e.Phone).HasMaxLength(20).IsRequired();
        builder.Property(e => e.Email).HasMaxLength(256);
        builder.Property(e => e.Website).HasMaxLength(500);
        builder.Property(e => e.Address).HasMaxLength(500).IsRequired();
        builder.Property(e => e.City).HasMaxLength(100).IsRequired();
        builder.Property(e => e.State).HasMaxLength(100);
        builder.Property(e => e.Country).HasMaxLength(100).IsRequired();
        builder.Property(e => e.PostalCode).HasMaxLength(20);
        builder.Property(e => e.LicenseNumber).HasMaxLength(100);
        builder.Property(e => e.TaxId).HasMaxLength(100);
        
        builder.HasOne(e => e.Owner)
            .WithMany()
            .HasForeignKey(e => e.OwnerId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}
