using CommunityCar.Domain.Entities.Community.Events;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Events;

public class EventMediaConfiguration : IEntityTypeConfiguration<EventMedia>
{
    public void Configure(EntityTypeBuilder<EventMedia> builder)
    {
        builder.ToTable("EventMedia", "community");

        builder.HasKey(em => em.Id);

        builder.HasOne(em => em.Event)
            .WithMany(e => e.Media)
            .HasForeignKey(em => em.EventId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(em => em.EventId);
        builder.HasIndex(em => em.SortOrder);
    }
}
