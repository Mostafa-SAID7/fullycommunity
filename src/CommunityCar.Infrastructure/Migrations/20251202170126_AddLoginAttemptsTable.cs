using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CommunityCar.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddLoginAttemptsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "profiles");

            migrationBuilder.EnsureSchema(
                name: "security");

            migrationBuilder.EnsureSchema(
                name: "identity");

            migrationBuilder.RenameTable(
                name: "VendorProfiles",
                newName: "VendorProfiles",
                newSchema: "profiles");

            migrationBuilder.RenameTable(
                name: "UserSessions",
                newName: "UserSessions",
                newSchema: "security");

            migrationBuilder.RenameTable(
                name: "UserActivities",
                newName: "UserActivities",
                newSchema: "security");

            migrationBuilder.RenameTable(
                name: "TwoFactorBackupCodes",
                newName: "TwoFactorBackupCodes",
                newSchema: "security");

            migrationBuilder.RenameTable(
                name: "StudentProfiles",
                newName: "StudentProfiles",
                newSchema: "profiles");

            migrationBuilder.RenameTable(
                name: "SecurityAlerts",
                newName: "SecurityAlerts",
                newSchema: "security");

            migrationBuilder.RenameTable(
                name: "RolePermissions",
                newName: "RolePermissions",
                newSchema: "identity");

            migrationBuilder.RenameTable(
                name: "ReviewerProfiles",
                newName: "ReviewerProfiles",
                newSchema: "profiles");

            migrationBuilder.RenameTable(
                name: "Permissions",
                newName: "Permissions",
                newSchema: "identity");

            migrationBuilder.RenameTable(
                name: "OtpCodes",
                newName: "OtpCodes",
                newSchema: "identity");

            migrationBuilder.RenameTable(
                name: "MechanicProfiles",
                newName: "MechanicProfiles",
                newSchema: "profiles");

            migrationBuilder.RenameTable(
                name: "LoginAttempts",
                newName: "LoginAttempts",
                newSchema: "security");

            migrationBuilder.RenameTable(
                name: "InstructorProfiles",
                newName: "InstructorProfiles",
                newSchema: "profiles");

            migrationBuilder.RenameTable(
                name: "GarageOwnerProfiles",
                newName: "GarageOwnerProfiles",
                newSchema: "profiles");

            migrationBuilder.RenameTable(
                name: "ExpertProfiles",
                newName: "ExpertProfiles",
                newSchema: "profiles");

            migrationBuilder.RenameTable(
                name: "BlockedIps",
                newName: "BlockedIps",
                newSchema: "security");

            migrationBuilder.RenameTable(
                name: "AuthorProfiles",
                newName: "AuthorProfiles",
                newSchema: "profiles");

            migrationBuilder.RenameTable(
                name: "AuditLogs",
                newName: "AuditLogs",
                newSchema: "security");

            migrationBuilder.RenameTable(
                name: "AffiliateProfiles",
                newName: "AffiliateProfiles",
                newSchema: "profiles");

            migrationBuilder.RenameTable(
                name: "AdminProfiles",
                newName: "AdminProfiles",
                newSchema: "profiles");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameTable(
                name: "VendorProfiles",
                schema: "profiles",
                newName: "VendorProfiles");

            migrationBuilder.RenameTable(
                name: "UserSessions",
                schema: "security",
                newName: "UserSessions");

            migrationBuilder.RenameTable(
                name: "UserActivities",
                schema: "security",
                newName: "UserActivities");

            migrationBuilder.RenameTable(
                name: "TwoFactorBackupCodes",
                schema: "security",
                newName: "TwoFactorBackupCodes");

            migrationBuilder.RenameTable(
                name: "StudentProfiles",
                schema: "profiles",
                newName: "StudentProfiles");

            migrationBuilder.RenameTable(
                name: "SecurityAlerts",
                schema: "security",
                newName: "SecurityAlerts");

            migrationBuilder.RenameTable(
                name: "RolePermissions",
                schema: "identity",
                newName: "RolePermissions");

            migrationBuilder.RenameTable(
                name: "ReviewerProfiles",
                schema: "profiles",
                newName: "ReviewerProfiles");

            migrationBuilder.RenameTable(
                name: "Permissions",
                schema: "identity",
                newName: "Permissions");

            migrationBuilder.RenameTable(
                name: "OtpCodes",
                schema: "identity",
                newName: "OtpCodes");

            migrationBuilder.RenameTable(
                name: "MechanicProfiles",
                schema: "profiles",
                newName: "MechanicProfiles");

            migrationBuilder.RenameTable(
                name: "LoginAttempts",
                schema: "security",
                newName: "LoginAttempts");

            migrationBuilder.RenameTable(
                name: "InstructorProfiles",
                schema: "profiles",
                newName: "InstructorProfiles");

            migrationBuilder.RenameTable(
                name: "GarageOwnerProfiles",
                schema: "profiles",
                newName: "GarageOwnerProfiles");

            migrationBuilder.RenameTable(
                name: "ExpertProfiles",
                schema: "profiles",
                newName: "ExpertProfiles");

            migrationBuilder.RenameTable(
                name: "BlockedIps",
                schema: "security",
                newName: "BlockedIps");

            migrationBuilder.RenameTable(
                name: "AuthorProfiles",
                schema: "profiles",
                newName: "AuthorProfiles");

            migrationBuilder.RenameTable(
                name: "AuditLogs",
                schema: "security",
                newName: "AuditLogs");

            migrationBuilder.RenameTable(
                name: "AffiliateProfiles",
                schema: "profiles",
                newName: "AffiliateProfiles");

            migrationBuilder.RenameTable(
                name: "AdminProfiles",
                schema: "profiles",
                newName: "AdminProfiles");
        }
    }
}
