using CommunityCar.Domain.Entities.Community.News;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.News;

public class NewsCategoryConfiguration : IEntityTypeConfiguration<NewsCategory>
{
    public void Configure(EntityTypeBuilder<NewsCategory> builder)
    {
        builder.ToTable("NewsCategories", "community");

        builder.HasKey(nc => nc.Id);

        builder.HasIndex(nc => nc.Slug).IsUnique();
    }
}
