using CommunityCar.Domain.Entities.Marketplace.Orders;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Marketplace;

public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
{
    public void Configure(EntityTypeBuilder<OrderItem> builder)
    {
        builder.ToTable("OrderItems", "marketplace");
        
        builder.HasIndex(e => e.OrderId);
        builder.HasIndex(e => e.ProductId);
        
        builder.Property(e => e.ProductTitle).HasMaxLength(200).IsRequired();
        builder.Property(e => e.ProductSKU).HasMaxLength(100);
        builder.Property(e => e.ProductImageUrl).HasMaxLength(500);
        
        builder.HasOne(e => e.Order)
            .WithMany(o => o.Items)
            .HasForeignKey(e => e.OrderId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
