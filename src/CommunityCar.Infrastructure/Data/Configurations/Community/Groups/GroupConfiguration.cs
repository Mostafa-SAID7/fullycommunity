using CommunityCar.Domain.Entities.Community.Groups;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Groups;

public class GroupConfiguration : IEntityTypeConfiguration<Group>
{
    public void Configure(EntityTypeBuilder<Group> builder)
    {
        builder.ToTable("Groups", "community");

        builder.HasIndex(e => e.Slug).IsUnique();
        builder.HasIndex(e => e.OwnerId);
        builder.HasIndex(e => e.Privacy);
    }
}
