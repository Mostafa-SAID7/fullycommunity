using CommunityCar.Domain.Entities.Community.QA;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.QA;

public class QuestionViewConfiguration : IEntityTypeConfiguration<QuestionView>
{
    public void Configure(EntityTypeBuilder<QuestionView> builder)
    {
        builder.ToTable("QuestionViews", "community");

        builder.HasKey(qv => qv.Id);

        builder.HasOne(qv => qv.Question)
            .WithMany()
            .HasForeignKey(qv => qv.QuestionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(qv => qv.User)
            .WithMany()
            .HasForeignKey(qv => qv.UserId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.Property(qv => qv.AnonymousId)
            .HasMaxLength(128);

        // Unique constraint: one view per user per question
        builder.HasIndex(qv => new { qv.QuestionId, qv.UserId })
            .HasFilter("[UserId] IS NOT NULL")
            .IsUnique();

        // Unique constraint: one view per anonymous user per question
        builder.HasIndex(qv => new { qv.QuestionId, qv.AnonymousId })
            .HasFilter("[AnonymousId] IS NOT NULL")
            .IsUnique();

        builder.HasIndex(qv => qv.ViewedAt);
    }
}
