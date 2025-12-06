using CommunityCar.Domain.Entities.Community.Groups;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Community.Groups;

public class GroupMemberConfiguration : IEntityTypeConfiguration<GroupMember>
{
    public void Configure(EntityTypeBuilder<GroupMember> builder)
    {
        builder.HasOne(m => m.Group)
              .WithMany(g => g.Members)
              .HasForeignKey(m => m.GroupId)
              .OnDelete(DeleteBehavior.NoAction);
    }
}
