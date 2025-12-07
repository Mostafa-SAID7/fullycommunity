using CommunityCar.Domain.Entities.Community.Posts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Posts;

public class PostCategoryConfiguration : IEntityTypeConfiguration<PostCategory>
{
    public void Configure(EntityTypeBuilder<PostCategory> builder)
    {
        builder.ToTable("PostCategories", "community");

        builder.HasKey(pc => pc.Id);

        builder.HasIndex(pc => pc.Slug).IsUnique();
    }
}
