using CommunityCar.Domain.Entities.Marketplace.Orders;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Marketplace;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.ToTable("Orders", "marketplace");
        
        builder.HasIndex(e => e.OrderNumber).IsUnique();
        builder.HasIndex(e => new { e.BuyerId, e.Status });
        builder.HasIndex(e => new { e.SellerId, e.Status });
        builder.HasIndex(e => e.CreatedAt);
        
        builder.Property(e => e.OrderNumber).HasMaxLength(50).IsRequired();
        builder.Property(e => e.Currency).HasMaxLength(3);
        builder.Property(e => e.CouponCode).HasMaxLength(50);
        builder.Property(e => e.PaymentIntentId).HasMaxLength(200);
        builder.Property(e => e.TrackingNumber).HasMaxLength(100);
        builder.Property(e => e.TrackingUrl).HasMaxLength(500);
        builder.Property(e => e.Carrier).HasMaxLength(100);
        builder.Property(e => e.BuyerNotes).HasMaxLength(1000);
        builder.Property(e => e.SellerNotes).HasMaxLength(1000);
        builder.Property(e => e.InternalNotes).HasMaxLength(1000);
        builder.Property(e => e.CancellationReason).HasMaxLength(500);
        builder.Property(e => e.RefundReason).HasMaxLength(500);
        
        builder.HasOne(e => e.Buyer)
            .WithMany()
            .HasForeignKey(e => e.BuyerId)
            .OnDelete(DeleteBehavior.NoAction);
            
        builder.HasOne(e => e.Seller)
            .WithMany()
            .HasForeignKey(e => e.SellerId)
            .OnDelete(DeleteBehavior.NoAction);
            
        builder.HasOne(e => e.ShippingAddress)
            .WithMany()
            .HasForeignKey(e => e.ShippingAddressId)
            .OnDelete(DeleteBehavior.NoAction);
            
        builder.HasOne(e => e.BillingAddress)
            .WithMany()
            .HasForeignKey(e => e.BillingAddressId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}
