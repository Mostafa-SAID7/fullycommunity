using CommunityCar.Domain.Entities.Community.QA;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.QA;

public class AnswerVoteConfiguration : IEntityTypeConfiguration<AnswerVote>
{
    public void Configure(EntityTypeBuilder<AnswerVote> builder)
    {
        builder.ToTable("AnswerVotes", "community");

        builder.HasKey(av => av.Id);

        builder.HasOne(av => av.Answer)
            .WithMany()
            .HasForeignKey(av => av.AnswerId)
            .OnDelete(DeleteBehavior.Cascade);

        // User relationship with NoAction to avoid cascade cycles
        builder.HasIndex(av => new { av.AnswerId, av.UserId }).IsUnique();
        builder.HasIndex(av => av.CreatedAt);
    }
}
