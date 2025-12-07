using CommunityCar.Domain.Entities.Community.QA;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.QA;

public class QuestionVoteConfiguration : IEntityTypeConfiguration<QuestionVote>
{
    public void Configure(EntityTypeBuilder<QuestionVote> builder)
    {
        builder.ToTable("QuestionVotes", "community");

        builder.HasOne(v => v.Question)
              .WithMany(q => q.Votes)
              .HasForeignKey(v => v.QuestionId)
              .OnDelete(DeleteBehavior.Cascade);
    }
}
