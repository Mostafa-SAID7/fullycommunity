using CommunityCar.Domain.Entities.Community.QA;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.QA;

public class QuestionBookmarkConfiguration : IEntityTypeConfiguration<QuestionBookmark>
{
    public void Configure(EntityTypeBuilder<QuestionBookmark> builder)
    {
        builder.HasOne(b => b.Question)
              .WithMany(q => q.Bookmarks)
              .HasForeignKey(b => b.QuestionId)
              .OnDelete(DeleteBehavior.Cascade);
    }
}
