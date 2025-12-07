using CommunityCar.Domain.Entities.Community.Guides;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Guides;

public class GuideRatingConfiguration : IEntityTypeConfiguration<GuideRating>
{
    public void Configure(EntityTypeBuilder<GuideRating> builder)
    {
        builder.ToTable("GuideRatings", "community");

        builder.HasKey(gr => gr.Id);

        builder.HasOne(gr => gr.Guide)
            .WithMany(g => g.Ratings)
            .HasForeignKey(gr => gr.GuideId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(gr => gr.User)
            .WithMany()
            .HasForeignKey(gr => gr.UserId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.HasIndex(gr => new { gr.GuideId, gr.UserId }).IsUnique();
    }
}
