using CommunityCar.Domain.Entities.Community.QA;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.QA;

public class QuestionTagConfiguration : IEntityTypeConfiguration<QuestionTag>
{
    public void Configure(EntityTypeBuilder<QuestionTag> builder)
    {
        builder.ToTable("QuestionTags", "community");

        builder.HasOne(t => t.Question)
              .WithMany(q => q.Tags)
              .HasForeignKey(t => t.QuestionId)
              .OnDelete(DeleteBehavior.Cascade);
    }
}
