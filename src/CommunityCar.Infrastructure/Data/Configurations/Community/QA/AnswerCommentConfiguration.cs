using CommunityCar.Domain.Entities.Community.QA;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.QA;

public class AnswerCommentConfiguration : IEntityTypeConfiguration<AnswerComment>
{
    public void Configure(EntityTypeBuilder<AnswerComment> builder)
    {
        builder.ToTable("AnswerComments", "community");

        builder.HasKey(ac => ac.Id);

        builder.HasOne(ac => ac.Answer)
            .WithMany(a => a.Comments)
            .HasForeignKey(ac => ac.AnswerId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ac => ac.Author)
            .WithMany()
            .HasForeignKey(ac => ac.AuthorId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}
