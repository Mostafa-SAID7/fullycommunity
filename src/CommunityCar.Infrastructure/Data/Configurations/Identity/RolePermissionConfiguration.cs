using CommunityCar.Domain.Entities.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CommunityCar.Infrastructure.Data.Configurations.Identity;

public class RolePermissionConfiguration : IEntityTypeConfiguration<RolePermission>
{
    public void Configure(EntityTypeBuilder<RolePermission> builder)
    {
        builder.ToTable("RolePermissions", "identity");
        builder.HasKey(e => new { e.RoleId, e.PermissionId });
        builder.HasOne(e => e.Role)
              .WithMany(r => r.Permissions)
              .HasForeignKey(e => e.RoleId);
        builder.HasOne(e => e.Permission)
              .WithMany(p => p.RolePermissions)
              .HasForeignKey(e => e.PermissionId);
    }
}
