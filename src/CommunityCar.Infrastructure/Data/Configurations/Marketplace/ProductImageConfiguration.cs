using CommunityCar.Domain.Entities.Marketplace.Products;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Marketplace;

public class ProductImageConfiguration : IEntityTypeConfiguration<ProductImage>
{
    public void Configure(EntityTypeBuilder<ProductImage> builder)
    {
        builder.ToTable("ProductImages", "marketplace");
        
        builder.HasIndex(e => new { e.ProductId, e.SortOrder });
        
        builder.Property(e => e.Url).HasMaxLength(500).IsRequired();
        builder.Property(e => e.ThumbnailUrl).HasMaxLength(500);
        builder.Property(e => e.AltText).HasMaxLength(200);
        
        builder.HasOne(e => e.Product)
            .WithMany(p => p.Images)
            .HasForeignKey(e => e.ProductId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
