using CommunityCar.Domain.Entities.Marketplace.Auctions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Marketplace;

public class AuctionConfiguration : IEntityTypeConfiguration<Auction>
{
    public void Configure(EntityTypeBuilder<Auction> builder)
    {
        builder.ToTable("Auctions", "marketplace");
        
        builder.HasIndex(e => e.AuctionNumber).IsUnique();
        builder.HasIndex(e => new { e.Status, e.EndTime });
        builder.HasIndex(e => e.SellerId);
        builder.HasIndex(e => e.ProductId).IsUnique();
        
        builder.Property(e => e.AuctionNumber).HasMaxLength(50).IsRequired();
        builder.Property(e => e.Currency).HasMaxLength(3);
        builder.Property(e => e.TermsAndConditions).HasMaxLength(2000);
        
        builder.HasOne(e => e.Product)
            .WithMany()
            .HasForeignKey(e => e.ProductId)
            .OnDelete(DeleteBehavior.NoAction);
            
        builder.HasOne(e => e.Seller)
            .WithMany()
            .HasForeignKey(e => e.SellerId)
            .OnDelete(DeleteBehavior.NoAction);
            
        builder.HasOne(e => e.WinningBid)
            .WithMany()
            .HasForeignKey(e => e.WinningBidId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}
