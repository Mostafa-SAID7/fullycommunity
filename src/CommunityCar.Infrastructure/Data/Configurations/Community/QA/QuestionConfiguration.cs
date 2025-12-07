using CommunityCar.Domain.Entities.Community.QA;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.QA;

public class QuestionConfiguration : IEntityTypeConfiguration<Question>
{
    public void Configure(EntityTypeBuilder<Question> builder)
    {
        builder.ToTable("Questions", "community");

        builder.HasOne(q => q.AcceptedAnswer)
              .WithOne()
              .HasForeignKey<Question>(q => q.AcceptedAnswerId)
              .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(q => q.Answers)
              .WithOne(a => a.Question)
              .HasForeignKey(a => a.QuestionId)
              .OnDelete(DeleteBehavior.NoAction);
    }
}
