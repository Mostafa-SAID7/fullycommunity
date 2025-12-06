using CommunityCar.Domain.Entities.Marketplace.Products;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Marketplace;

public class ProductSubCategoryConfiguration : IEntityTypeConfiguration<ProductSubCategory>
{
    public void Configure(EntityTypeBuilder<ProductSubCategory> builder)
    {
        builder.ToTable("ProductSubCategories", "marketplace");
        
        builder.HasIndex(e => e.Slug).IsUnique();
        builder.HasIndex(e => new { e.ParentCategory, e.IsActive });
        
        builder.Property(e => e.Name).HasMaxLength(100).IsRequired();
        builder.Property(e => e.Description).HasMaxLength(500);
        builder.Property(e => e.Slug).HasMaxLength(150);
        builder.Property(e => e.IconUrl).HasMaxLength(500);
    }
}
