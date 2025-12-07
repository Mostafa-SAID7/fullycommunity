using CommunityCar.Domain.Entities.Community.Guides;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Guides;

public class GuideConfiguration : IEntityTypeConfiguration<Guide>
{
    public void Configure(EntityTypeBuilder<Guide> builder)
    {
        builder.ToTable("Guides", "community");

        builder.HasIndex(e => e.Slug).IsUnique();
        builder.HasIndex(e => e.AuthorId);
        builder.HasIndex(e => e.Status);
        builder.HasIndex(e => e.PublishedAt);
    }
}
