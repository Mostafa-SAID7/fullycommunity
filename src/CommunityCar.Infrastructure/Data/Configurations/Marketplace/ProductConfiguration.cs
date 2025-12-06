using CommunityCar.Domain.Entities.Marketplace.Products;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Marketplace;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("Products", "marketplace");
        
        builder.HasIndex(e => e.Slug).IsUnique();
        builder.HasIndex(e => e.SKU).IsUnique();
        builder.HasIndex(e => new { e.SellerId, e.Status });
        builder.HasIndex(e => new { e.Category, e.Status });
        builder.HasIndex(e => e.PublishedAt);
        
        builder.Property(e => e.Title).HasMaxLength(200).IsRequired();
        builder.Property(e => e.Subtitle).HasMaxLength(200);
        builder.Property(e => e.Description).HasMaxLength(5000).IsRequired();
        builder.Property(e => e.Slug).HasMaxLength(250);
        builder.Property(e => e.SKU).HasMaxLength(100).IsRequired();
        builder.Property(e => e.ConditionDescription).HasMaxLength(500);
        builder.Property(e => e.Currency).HasMaxLength(3);
        builder.Property(e => e.VideoUrl).HasMaxLength(500);
        builder.Property(e => e.Brand).HasMaxLength(100);
        builder.Property(e => e.Manufacturer).HasMaxLength(100);
        builder.Property(e => e.PartNumber).HasMaxLength(100);
        builder.Property(e => e.OEMNumber).HasMaxLength(100);
        builder.Property(e => e.WarrantyDescription).HasMaxLength(500);
        builder.Property(e => e.ShipsFrom).HasMaxLength(200);
        builder.Property(e => e.MetaTitle).HasMaxLength(200);
        builder.Property(e => e.MetaDescription).HasMaxLength(500);
        
        builder.HasOne(e => e.Seller)
            .WithMany()
            .HasForeignKey(e => e.SellerId)
            .OnDelete(DeleteBehavior.NoAction);
            
        builder.HasOne(e => e.SubCategory)
            .WithMany()
            .HasForeignKey(e => e.SubCategoryId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
