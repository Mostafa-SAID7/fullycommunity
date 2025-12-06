using CommunityCar.Domain.Entities.Marketplace.Auctions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Marketplace;

public class BidConfiguration : IEntityTypeConfiguration<Bid>
{
    public void Configure(EntityTypeBuilder<Bid> builder)
    {
        builder.ToTable("Bids", "marketplace");
        
        builder.HasIndex(e => new { e.AuctionId, e.BidTime });
        builder.HasIndex(e => e.BidderId);
        
        builder.Property(e => e.IpAddress).HasMaxLength(50);
        
        builder.HasOne(e => e.Auction)
            .WithMany(a => a.Bids)
            .HasForeignKey(e => e.AuctionId)
            .OnDelete(DeleteBehavior.Cascade);
            
        builder.HasOne(e => e.Bidder)
            .WithMany()
            .HasForeignKey(e => e.BidderId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}
