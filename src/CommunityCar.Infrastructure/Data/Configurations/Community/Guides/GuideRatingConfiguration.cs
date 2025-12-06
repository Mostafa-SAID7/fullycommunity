using CommunityCar.Domain.Entities.Community.Guides;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Guides;

public class GuideRatingConfiguration : IEntityTypeConfiguration<GuideRating>
{
    public void Configure(EntityTypeBuilder<GuideRating> builder)
    {
        builder.HasOne(r => r.Guide)
              .WithMany(g => g.Ratings)
              .HasForeignKey(r => r.GuideId)
              .OnDelete(DeleteBehavior.NoAction);
    }
}
