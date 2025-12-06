using CommunityCar.Domain.Entities.Community.Posts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Posts;

public class PostConfiguration : IEntityTypeConfiguration<Post>
{
    public void Configure(EntityTypeBuilder<Post> builder)
    {
        builder.ToTable("Posts", "community");
        builder.HasIndex(e => e.Slug).IsUnique();
        builder.HasOne(p => p.Author)
              .WithMany()
              .HasForeignKey(p => p.AuthorId)
              .OnDelete(DeleteBehavior.NoAction);
        builder.HasOne(p => p.Category)
              .WithMany()
              .HasForeignKey(p => p.CategoryId)
              .OnDelete(DeleteBehavior.SetNull);
    }
}
