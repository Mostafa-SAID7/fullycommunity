using CommunityCar.Domain.Entities.Marketplace.Orders;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Marketplace;

public class OrderAddressConfiguration : IEntityTypeConfiguration<OrderAddress>
{
    public void Configure(EntityTypeBuilder<OrderAddress> builder)
    {
        builder.ToTable("OrderAddresses", "marketplace");
        
        builder.Property(e => e.FullName).HasMaxLength(200).IsRequired();
        builder.Property(e => e.Phone).HasMaxLength(20).IsRequired();
        builder.Property(e => e.AddressLine1).HasMaxLength(200).IsRequired();
        builder.Property(e => e.AddressLine2).HasMaxLength(200);
        builder.Property(e => e.City).HasMaxLength(100).IsRequired();
        builder.Property(e => e.State).HasMaxLength(100);
        builder.Property(e => e.PostalCode).HasMaxLength(20).IsRequired();
        builder.Property(e => e.Country).HasMaxLength(100).IsRequired();
    }
}
