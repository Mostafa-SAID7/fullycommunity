using CommunityCar.Domain.Entities.Community.Posts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Posts;

public class PostMediaConfiguration : IEntityTypeConfiguration<PostMedia>
{
    public void Configure(EntityTypeBuilder<PostMedia> builder)
    {
        builder.ToTable("PostMedia", "community");
        builder.HasOne(m => m.Post)
              .WithMany(p => p.Media)
              .HasForeignKey(m => m.PostId)
              .OnDelete(DeleteBehavior.Cascade);
    }
}
