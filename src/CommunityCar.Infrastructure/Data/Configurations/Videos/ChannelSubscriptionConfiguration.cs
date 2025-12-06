using CommunityCar.Domain.Entities.Videos.Channels;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Videos;

public class ChannelSubscriptionConfiguration : IEntityTypeConfiguration<ChannelSubscription>
{
    public void Configure(EntityTypeBuilder<ChannelSubscription> builder)
    {
        builder.HasOne(s => s.Channel)
              .WithMany(c => c.Subscribers)
              .HasForeignKey(s => s.ChannelId)
              .OnDelete(DeleteBehavior.NoAction);
        builder.HasOne(s => s.Subscriber)
              .WithMany()
              .HasForeignKey(s => s.SubscriberId)
              .OnDelete(DeleteBehavior.NoAction);
    }
}
