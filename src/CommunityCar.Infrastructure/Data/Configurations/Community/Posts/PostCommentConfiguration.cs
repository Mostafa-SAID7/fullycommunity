using CommunityCar.Domain.Entities.Community.Posts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Posts;

public class PostCommentConfiguration : IEntityTypeConfiguration<PostComment>
{
    public void Configure(EntityTypeBuilder<PostComment> builder)
    {
        builder.ToTable("PostComments", "community");
        builder.HasOne(c => c.Post)
              .WithMany(p => p.Comments)
              .HasForeignKey(c => c.PostId)
              .OnDelete(DeleteBehavior.NoAction);
        builder.HasOne(c => c.Author)
              .WithMany()
              .HasForeignKey(c => c.AuthorId)
              .OnDelete(DeleteBehavior.NoAction);
    }
}
