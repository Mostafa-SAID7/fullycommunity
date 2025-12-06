using CommunityCar.Domain.Entities.Community.Posts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Posts;

public class PostLikeConfiguration : IEntityTypeConfiguration<PostLike>
{
    public void Configure(EntityTypeBuilder<PostLike> builder)
    {
        builder.ToTable("PostLikes", "community");
        builder.HasOne(l => l.Post)
              .WithMany(p => p.Likes)
              .HasForeignKey(l => l.PostId)
              .OnDelete(DeleteBehavior.NoAction);
        builder.HasOne(l => l.User)
              .WithMany()
              .HasForeignKey(l => l.UserId)
              .OnDelete(DeleteBehavior.NoAction);
    }
}
