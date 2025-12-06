using CommunityCar.Domain.Entities.Marketplace.Products;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Marketplace;

public class VehicleCompatibilityConfiguration : IEntityTypeConfiguration<VehicleCompatibility>
{
    public void Configure(EntityTypeBuilder<VehicleCompatibility> builder)
    {
        builder.ToTable("VehicleCompatibility", "marketplace");
        
        builder.HasIndex(e => new { e.ProductId, e.Make, e.Model });
        builder.HasIndex(e => e.Make);
        
        builder.Property(e => e.Make).HasMaxLength(100).IsRequired();
        builder.Property(e => e.Model).HasMaxLength(100);
        builder.Property(e => e.Trim).HasMaxLength(100);
        builder.Property(e => e.Engine).HasMaxLength(100);
        builder.Property(e => e.Notes).HasMaxLength(500);
        
        builder.HasOne(e => e.Product)
            .WithMany(p => p.Compatibility)
            .HasForeignKey(e => e.ProductId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
