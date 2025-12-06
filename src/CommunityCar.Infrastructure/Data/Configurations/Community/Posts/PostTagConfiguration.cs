using CommunityCar.Domain.Entities.Community.Posts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Posts;

public class PostTagConfiguration : IEntityTypeConfiguration<PostTag>
{
    public void Configure(EntityTypeBuilder<PostTag> builder)
    {
        builder.ToTable("PostTags", "community");
        builder.HasOne(t => t.Post)
              .WithMany(p => p.Tags)
              .HasForeignKey(t => t.PostId)
              .OnDelete(DeleteBehavior.Cascade);
    }
}
