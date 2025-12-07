using CommunityCar.Domain.Entities.Community.Guides;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Guides;

public class GuideStepMediaConfiguration : IEntityTypeConfiguration<GuideStepMedia>
{
    public void Configure(EntityTypeBuilder<GuideStepMedia> builder)
    {
        builder.ToTable("GuideStepMedia", "community");

        builder.HasKey(gsm => gsm.Id);

        builder.HasOne(gsm => gsm.Step)
            .WithMany(gs => gs.Media)
            .HasForeignKey(gsm => gsm.StepId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(gsm => gsm.StepId);
        builder.HasIndex(gsm => gsm.SortOrder);
    }
}
