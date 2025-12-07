using CommunityCar.Domain.Entities.Community.Friendships;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Friendships;

public class UserBlockConfiguration : IEntityTypeConfiguration<UserBlock>
{
    public void Configure(EntityTypeBuilder<UserBlock> builder)
    {
        builder.ToTable("UserBlocks", "community");

        builder.HasKey(ub => ub.Id);

        // Configure relationships with NO ACTION to avoid cascade cycles
        builder.HasOne(ub => ub.Blocker)
            .WithMany()
            .HasForeignKey(ub => ub.BlockerId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.HasOne(ub => ub.BlockedUser)
            .WithMany()
            .HasForeignKey(ub => ub.BlockedUserId)
            .OnDelete(DeleteBehavior.NoAction);

        // Indexes
        builder.HasIndex(ub => new { ub.BlockerId, ub.BlockedUserId }).IsUnique();
        builder.HasIndex(ub => ub.CreatedAt);
    }
}
