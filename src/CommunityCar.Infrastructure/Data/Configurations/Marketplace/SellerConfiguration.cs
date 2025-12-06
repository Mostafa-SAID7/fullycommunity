using CommunityCar.Domain.Entities.Marketplace.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Marketplace;

public class SellerConfiguration : IEntityTypeConfiguration<Seller>
{
    public void Configure(EntityTypeBuilder<Seller> builder)
    {
        builder.ToTable("Sellers", "marketplace");
        
        builder.HasIndex(e => e.Slug).IsUnique();
        builder.HasIndex(e => e.UserId).IsUnique();
        builder.HasIndex(e => new { e.Status, e.AverageRating });
        
        builder.Property(e => e.StoreName).HasMaxLength(200).IsRequired();
        builder.Property(e => e.StoreDescription).HasMaxLength(2000);
        builder.Property(e => e.LogoUrl).HasMaxLength(500);
        builder.Property(e => e.BannerUrl).HasMaxLength(500);
        builder.Property(e => e.Slug).HasMaxLength(250);
        builder.Property(e => e.BusinessPhone).HasMaxLength(20);
        builder.Property(e => e.BusinessEmail).HasMaxLength(256);
        builder.Property(e => e.Website).HasMaxLength(500);
        builder.Property(e => e.Address).HasMaxLength(500);
        builder.Property(e => e.City).HasMaxLength(100);
        builder.Property(e => e.State).HasMaxLength(100);
        builder.Property(e => e.Country).HasMaxLength(100);
        builder.Property(e => e.PostalCode).HasMaxLength(20);
        builder.Property(e => e.BusinessRegistrationNumber).HasMaxLength(100);
        builder.Property(e => e.TaxId).HasMaxLength(100);
        builder.Property(e => e.ReturnPolicy).HasMaxLength(2000);
        builder.Property(e => e.ShippingPolicy).HasMaxLength(2000);
        
        builder.HasOne(e => e.User)
            .WithMany()
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}
