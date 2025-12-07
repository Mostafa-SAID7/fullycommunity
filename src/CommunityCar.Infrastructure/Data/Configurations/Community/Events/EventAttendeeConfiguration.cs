using CommunityCar.Domain.Entities.Community.Events;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Events;

public class EventAttendeeConfiguration : IEntityTypeConfiguration<EventAttendee>
{
    public void Configure(EntityTypeBuilder<EventAttendee> builder)
    {
        builder.ToTable("EventAttendee", "community");

        builder.HasOne(e => e.Event)
              .WithMany(ev => ev.Attendees)
              .HasForeignKey(e => e.EventId)
              .OnDelete(DeleteBehavior.NoAction);
    }
}
