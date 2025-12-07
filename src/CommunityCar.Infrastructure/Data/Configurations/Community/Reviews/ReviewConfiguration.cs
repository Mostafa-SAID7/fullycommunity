using CommunityCar.Domain.Entities.Community.Reviews;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Reviews;

public class ReviewConfiguration : IEntityTypeConfiguration<Review>
{
    public void Configure(EntityTypeBuilder<Review> builder)
    {
        builder.ToTable("Reviews", "community");

        builder.HasIndex(e => e.Slug).IsUnique();
        builder.HasIndex(e => e.AuthorId);
        builder.HasIndex(e => e.Status);
        builder.HasIndex(e => e.PublishedAt);
    }
}
