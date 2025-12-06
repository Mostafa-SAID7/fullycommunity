using CommunityCar.Domain.Entities.Community.Events;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Events;

public class EventCommentConfiguration : IEntityTypeConfiguration<EventComment>
{
    public void Configure(EntityTypeBuilder<EventComment> builder)
    {
        builder.HasOne(e => e.Event)
              .WithMany(ev => ev.Comments)
              .HasForeignKey(e => e.EventId)
              .OnDelete(DeleteBehavior.NoAction);
    }
}
