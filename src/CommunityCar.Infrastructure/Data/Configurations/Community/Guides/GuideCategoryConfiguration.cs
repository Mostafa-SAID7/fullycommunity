using CommunityCar.Domain.Entities.Community.Guides;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Guides;

public class GuideCategoryConfiguration : IEntityTypeConfiguration<GuideCategory>
{
    public void Configure(EntityTypeBuilder<GuideCategory> builder)
    {
        builder.ToTable("GuideCategory", "community");

        builder.HasKey(gc => gc.Id);

        builder.HasIndex(gc => gc.Slug).IsUnique();
        builder.HasIndex(gc => gc.Name);
    }
}
