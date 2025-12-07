using CommunityCar.Domain.Entities.Community.Guides;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Guides;

public class GuideCommentConfiguration : IEntityTypeConfiguration<GuideComment>
{
    public void Configure(EntityTypeBuilder<GuideComment> builder)
    {
        builder.ToTable("GuideComment", "community");

        builder.HasOne(c => c.Guide)
              .WithMany(g => g.Comments)
              .HasForeignKey(c => c.GuideId)
              .OnDelete(DeleteBehavior.NoAction);
    }
}
