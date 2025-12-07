using CommunityCar.Domain.Entities.Community.Guides;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Guides;

public class GuideStepConfiguration : IEntityTypeConfiguration<GuideStep>
{
    public void Configure(EntityTypeBuilder<GuideStep> builder)
    {
        builder.ToTable("GuideSteps", "community");

        builder.HasKey(gs => gs.Id);

        builder.HasOne(gs => gs.Guide)
            .WithMany(g => g.Steps)
            .HasForeignKey(gs => gs.GuideId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(gs => new { gs.GuideId, gs.StepNumber });
    }
}
