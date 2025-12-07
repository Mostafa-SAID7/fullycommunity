using CommunityCar.Domain.Entities.Community.Posts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Posts;

public class CommentLikeConfiguration : IEntityTypeConfiguration<CommentLike>
{
    public void Configure(EntityTypeBuilder<CommentLike> builder)
    {
        builder.ToTable("CommentLike", "community");

        builder.HasOne(l => l.Comment)
              .WithMany(c => c.Likes)
              .HasForeignKey(l => l.CommentId)
              .OnDelete(DeleteBehavior.NoAction);
    }
}
