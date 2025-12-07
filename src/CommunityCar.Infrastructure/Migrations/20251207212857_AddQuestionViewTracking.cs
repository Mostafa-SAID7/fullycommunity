using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CommunityCar.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddQuestionViewTracking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "QuestionViews",
                schema: "community",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    QuestionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AnonymousId = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: true),
                    ViewedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionViews", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionViews_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_QuestionViews_Questions_QuestionId",
                        column: x => x.QuestionId,
                        principalSchema: "community",
                        principalTable: "Questions",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_QuestionViews_QuestionId_AnonymousId",
                schema: "community",
                table: "QuestionViews",
                columns: new[] { "QuestionId", "AnonymousId" },
                unique: true,
                filter: "[AnonymousId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionViews_QuestionId_UserId",
                schema: "community",
                table: "QuestionViews",
                columns: new[] { "QuestionId", "UserId" },
                unique: true,
                filter: "[UserId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionViews_UserId",
                schema: "community",
                table: "QuestionViews",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionViews_ViewedAt",
                schema: "community",
                table: "QuestionViews",
                column: "ViewedAt");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "QuestionViews",
                schema: "community");
        }
    }
}
