using CommunityCar.Domain.Entities.Podcasts.Engagement;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Podcasts;

public class PodcastSubscriptionConfiguration : IEntityTypeConfiguration<PodcastSubscription>
{
    public void Configure(EntityTypeBuilder<PodcastSubscription> builder)
    {
        builder.HasOne(s => s.PodcastShow)
              .WithMany(sh => sh.Subscriptions)
              .HasForeignKey(s => s.PodcastShowId)
              .OnDelete(DeleteBehavior.NoAction);
    }
}
