using CommunityCar.Domain.Entities.Community.QA;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.QA;

public class QuestionBookmarkConfiguration : IEntityTypeConfiguration<QuestionBookmark>
{
    public void Configure(EntityTypeBuilder<QuestionBookmark> builder)
    {
        builder.ToTable("QuestionBookmarks", "community");

        builder.HasKey(qb => qb.Id);

        builder.HasOne(qb => qb.Question)
            .WithMany(q => q.Bookmarks)
            .HasForeignKey(qb => qb.QuestionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(qb => new { qb.QuestionId, qb.UserId }).IsUnique();
    }
}
