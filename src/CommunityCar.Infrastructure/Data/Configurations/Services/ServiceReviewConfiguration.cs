using CommunityCar.Domain.Entities.Services.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Services;

public class ServiceReviewConfiguration : IEntityTypeConfiguration<ServiceReview>
{
    public void Configure(EntityTypeBuilder<ServiceReview> builder)
    {
        builder.ToTable("ServiceReviews", "services");
        
        builder.HasIndex(e => new { e.ProviderId, e.IsApproved });
        builder.HasIndex(e => new { e.CustomerId, e.ProviderId }).IsUnique();
        builder.HasIndex(e => e.OverallRating);
        
        builder.Property(e => e.Title).HasMaxLength(200);
        builder.Property(e => e.Comment).HasMaxLength(2000);
        builder.Property(e => e.ProviderResponse).HasMaxLength(1000);
        builder.Property(e => e.FlagReason).HasMaxLength(500);
        
        builder.HasOne(e => e.Provider)
            .WithMany()
            .HasForeignKey(e => e.ProviderId)
            .OnDelete(DeleteBehavior.NoAction);
            
        builder.HasOne(e => e.Customer)
            .WithMany()
            .HasForeignKey(e => e.CustomerId)
            .OnDelete(DeleteBehavior.NoAction);
            
        builder.HasOne(e => e.Booking)
            .WithMany()
            .HasForeignKey(e => e.BookingId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
