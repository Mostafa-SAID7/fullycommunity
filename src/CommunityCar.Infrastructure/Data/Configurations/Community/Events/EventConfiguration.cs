using CommunityCar.Domain.Entities.Community.Events;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Events;

public class EventConfiguration : IEntityTypeConfiguration<Event>
{
    public void Configure(EntityTypeBuilder<Event> builder)
    {
        builder.ToTable("Events", "community");

        builder.HasIndex(e => e.Slug);
        builder.HasIndex(e => new { e.StartDate, e.EndDate });
        builder.HasIndex(e => e.OrganizerId);
    }
}
