using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CommunityCar.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class CommunitySchemaComplete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AnswerComments_Answers_AnswerId1",
                schema: "community",
                table: "AnswerComments");

            migrationBuilder.DropForeignKey(
                name: "FK_GuideRating_AspNetUsers_UserId",
                schema: "community",
                table: "GuideRating");

            migrationBuilder.DropForeignKey(
                name: "FK_GuideRating_Guides_GuideId",
                schema: "community",
                table: "GuideRating");

            migrationBuilder.DropForeignKey(
                name: "FK_GuideStep_Guides_GuideId",
                schema: "community",
                table: "GuideStep");

            migrationBuilder.DropForeignKey(
                name: "FK_GuideStepMedia_GuideStep_StepId",
                schema: "community",
                table: "GuideStepMedia");

            migrationBuilder.DropForeignKey(
                name: "FK_NewsComments_AspNetUsers_AuthorId",
                schema: "community",
                table: "NewsComments");

            migrationBuilder.DropForeignKey(
                name: "FK_NewsComments_NewsArticles_ArticleId",
                schema: "community",
                table: "NewsComments");

            migrationBuilder.DropForeignKey(
                name: "FK_NewsLikes_AspNetUsers_UserId",
                schema: "Community",
                table: "NewsLikes");

            migrationBuilder.DropForeignKey(
                name: "FK_PageAdmins_Pages_PageId",
                schema: "community",
                table: "PageAdmins");

            migrationBuilder.DropForeignKey(
                name: "FK_PageFollowers_Pages_PageId",
                schema: "community",
                table: "PageFollowers");

            migrationBuilder.DropForeignKey(
                name: "FK_PostLikes_Posts_PostId",
                schema: "community",
                table: "PostLikes");

            migrationBuilder.DropIndex(
                name: "IX_QuestionBookmarks_QuestionId",
                schema: "community",
                table: "QuestionBookmarks");

            migrationBuilder.DropIndex(
                name: "IX_PostLikes_PostId",
                schema: "community",
                table: "PostLikes");

            migrationBuilder.DropIndex(
                name: "IX_PageFollowers_PageId",
                schema: "community",
                table: "PageFollowers");

            migrationBuilder.DropIndex(
                name: "IX_PageAdmins_PageId",
                schema: "community",
                table: "PageAdmins");

            migrationBuilder.DropIndex(
                name: "IX_GuideLikes_CreatedAt",
                schema: "community",
                table: "GuideLikes");

            migrationBuilder.DropIndex(
                name: "IX_AnswerComments_AnswerId1",
                schema: "community",
                table: "AnswerComments");

            migrationBuilder.DropIndex(
                name: "IX_AnswerComments_CreatedAt",
                schema: "community",
                table: "AnswerComments");

            migrationBuilder.DropPrimaryKey(
                name: "PK_GuideStep",
                schema: "community",
                table: "GuideStep");

            migrationBuilder.DropPrimaryKey(
                name: "PK_GuideRating",
                schema: "community",
                table: "GuideRating");

            migrationBuilder.DropIndex(
                name: "IX_GuideRating_GuideId",
                schema: "community",
                table: "GuideRating");

            migrationBuilder.DropColumn(
                name: "AnswerId1",
                schema: "community",
                table: "AnswerComments");

            migrationBuilder.RenameTable(
                name: "NewsLikes",
                schema: "Community",
                newName: "NewsLikes",
                newSchema: "community");

            migrationBuilder.RenameTable(
                name: "GuideStep",
                schema: "community",
                newName: "GuideSteps",
                newSchema: "community");

            migrationBuilder.RenameTable(
                name: "GuideRating",
                schema: "community",
                newName: "GuideRatings",
                newSchema: "community");

            migrationBuilder.RenameIndex(
                name: "IX_GuideStep_GuideId_StepNumber",
                schema: "community",
                table: "GuideSteps",
                newName: "IX_GuideSteps_GuideId_StepNumber");

            migrationBuilder.RenameIndex(
                name: "IX_GuideRating_UserId",
                schema: "community",
                table: "GuideRatings",
                newName: "IX_GuideRatings_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_GuideSteps",
                schema: "community",
                table: "GuideSteps",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_GuideRatings",
                schema: "community",
                table: "GuideRatings",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "GuideBookmarks",
                schema: "community",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    GuideId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuideBookmarks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuideBookmarks_Guides_GuideId",
                        column: x => x.GuideId,
                        principalSchema: "community",
                        principalTable: "Guides",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SavedLocations",
                schema: "community",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LocationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ListName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Note = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SavedLocations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SavedLocations_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SavedLocations_MapLocations_LocationId",
                        column: x => x.LocationId,
                        principalSchema: "community",
                        principalTable: "MapLocations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_QuestionBookmarks_QuestionId_UserId",
                schema: "community",
                table: "QuestionBookmarks",
                columns: new[] { "QuestionId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PostLikes_PostId_UserId",
                schema: "community",
                table: "PostLikes",
                columns: new[] { "PostId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PageFollowers_PageId_UserId",
                schema: "community",
                table: "PageFollowers",
                columns: new[] { "PageId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PageAdmins_PageId_UserId",
                schema: "community",
                table: "PageAdmins",
                columns: new[] { "PageId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GuideRatings_GuideId_UserId",
                schema: "community",
                table: "GuideRatings",
                columns: new[] { "GuideId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GuideBookmarks_GuideId_UserId",
                schema: "community",
                table: "GuideBookmarks",
                columns: new[] { "GuideId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SavedLocations_LocationId_UserId",
                schema: "community",
                table: "SavedLocations",
                columns: new[] { "LocationId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SavedLocations_UserId",
                schema: "community",
                table: "SavedLocations",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_GuideRatings_AspNetUsers_UserId",
                schema: "community",
                table: "GuideRatings",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_GuideRatings_Guides_GuideId",
                schema: "community",
                table: "GuideRatings",
                column: "GuideId",
                principalSchema: "community",
                principalTable: "Guides",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GuideStepMedia_GuideSteps_StepId",
                schema: "community",
                table: "GuideStepMedia",
                column: "StepId",
                principalSchema: "community",
                principalTable: "GuideSteps",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GuideSteps_Guides_GuideId",
                schema: "community",
                table: "GuideSteps",
                column: "GuideId",
                principalSchema: "community",
                principalTable: "Guides",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_NewsComments_AspNetUsers_AuthorId",
                schema: "community",
                table: "NewsComments",
                column: "AuthorId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_NewsComments_NewsArticles_ArticleId",
                schema: "community",
                table: "NewsComments",
                column: "ArticleId",
                principalSchema: "community",
                principalTable: "NewsArticles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_NewsLikes_AspNetUsers_UserId",
                schema: "community",
                table: "NewsLikes",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PageAdmins_Pages_PageId",
                schema: "community",
                table: "PageAdmins",
                column: "PageId",
                principalSchema: "community",
                principalTable: "Pages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PageFollowers_Pages_PageId",
                schema: "community",
                table: "PageFollowers",
                column: "PageId",
                principalSchema: "community",
                principalTable: "Pages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PostLikes_Posts_PostId",
                schema: "community",
                table: "PostLikes",
                column: "PostId",
                principalSchema: "community",
                principalTable: "Posts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GuideRatings_AspNetUsers_UserId",
                schema: "community",
                table: "GuideRatings");

            migrationBuilder.DropForeignKey(
                name: "FK_GuideRatings_Guides_GuideId",
                schema: "community",
                table: "GuideRatings");

            migrationBuilder.DropForeignKey(
                name: "FK_GuideStepMedia_GuideSteps_StepId",
                schema: "community",
                table: "GuideStepMedia");

            migrationBuilder.DropForeignKey(
                name: "FK_GuideSteps_Guides_GuideId",
                schema: "community",
                table: "GuideSteps");

            migrationBuilder.DropForeignKey(
                name: "FK_NewsComments_AspNetUsers_AuthorId",
                schema: "community",
                table: "NewsComments");

            migrationBuilder.DropForeignKey(
                name: "FK_NewsComments_NewsArticles_ArticleId",
                schema: "community",
                table: "NewsComments");

            migrationBuilder.DropForeignKey(
                name: "FK_NewsLikes_AspNetUsers_UserId",
                schema: "community",
                table: "NewsLikes");

            migrationBuilder.DropForeignKey(
                name: "FK_PageAdmins_Pages_PageId",
                schema: "community",
                table: "PageAdmins");

            migrationBuilder.DropForeignKey(
                name: "FK_PageFollowers_Pages_PageId",
                schema: "community",
                table: "PageFollowers");

            migrationBuilder.DropForeignKey(
                name: "FK_PostLikes_Posts_PostId",
                schema: "community",
                table: "PostLikes");

            migrationBuilder.DropTable(
                name: "GuideBookmarks",
                schema: "community");

            migrationBuilder.DropTable(
                name: "SavedLocations",
                schema: "community");

            migrationBuilder.DropIndex(
                name: "IX_QuestionBookmarks_QuestionId_UserId",
                schema: "community",
                table: "QuestionBookmarks");

            migrationBuilder.DropIndex(
                name: "IX_PostLikes_PostId_UserId",
                schema: "community",
                table: "PostLikes");

            migrationBuilder.DropIndex(
                name: "IX_PageFollowers_PageId_UserId",
                schema: "community",
                table: "PageFollowers");

            migrationBuilder.DropIndex(
                name: "IX_PageAdmins_PageId_UserId",
                schema: "community",
                table: "PageAdmins");

            migrationBuilder.DropPrimaryKey(
                name: "PK_GuideSteps",
                schema: "community",
                table: "GuideSteps");

            migrationBuilder.DropPrimaryKey(
                name: "PK_GuideRatings",
                schema: "community",
                table: "GuideRatings");

            migrationBuilder.DropIndex(
                name: "IX_GuideRatings_GuideId_UserId",
                schema: "community",
                table: "GuideRatings");

            migrationBuilder.EnsureSchema(
                name: "Community");

            migrationBuilder.RenameTable(
                name: "NewsLikes",
                schema: "community",
                newName: "NewsLikes",
                newSchema: "Community");

            migrationBuilder.RenameTable(
                name: "GuideSteps",
                schema: "community",
                newName: "GuideStep",
                newSchema: "community");

            migrationBuilder.RenameTable(
                name: "GuideRatings",
                schema: "community",
                newName: "GuideRating",
                newSchema: "community");

            migrationBuilder.RenameIndex(
                name: "IX_GuideSteps_GuideId_StepNumber",
                schema: "community",
                table: "GuideStep",
                newName: "IX_GuideStep_GuideId_StepNumber");

            migrationBuilder.RenameIndex(
                name: "IX_GuideRatings_UserId",
                schema: "community",
                table: "GuideRating",
                newName: "IX_GuideRating_UserId");

            migrationBuilder.AddColumn<Guid>(
                name: "AnswerId1",
                schema: "community",
                table: "AnswerComments",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_GuideStep",
                schema: "community",
                table: "GuideStep",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_GuideRating",
                schema: "community",
                table: "GuideRating",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionBookmarks_QuestionId",
                schema: "community",
                table: "QuestionBookmarks",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_PostLikes_PostId",
                schema: "community",
                table: "PostLikes",
                column: "PostId");

            migrationBuilder.CreateIndex(
                name: "IX_PageFollowers_PageId",
                schema: "community",
                table: "PageFollowers",
                column: "PageId");

            migrationBuilder.CreateIndex(
                name: "IX_PageAdmins_PageId",
                schema: "community",
                table: "PageAdmins",
                column: "PageId");

            migrationBuilder.CreateIndex(
                name: "IX_GuideLikes_CreatedAt",
                schema: "community",
                table: "GuideLikes",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_AnswerComments_AnswerId1",
                schema: "community",
                table: "AnswerComments",
                column: "AnswerId1");

            migrationBuilder.CreateIndex(
                name: "IX_AnswerComments_CreatedAt",
                schema: "community",
                table: "AnswerComments",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_GuideRating_GuideId",
                schema: "community",
                table: "GuideRating",
                column: "GuideId");

            migrationBuilder.AddForeignKey(
                name: "FK_AnswerComments_Answers_AnswerId1",
                schema: "community",
                table: "AnswerComments",
                column: "AnswerId1",
                principalSchema: "community",
                principalTable: "Answers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_GuideRating_AspNetUsers_UserId",
                schema: "community",
                table: "GuideRating",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GuideRating_Guides_GuideId",
                schema: "community",
                table: "GuideRating",
                column: "GuideId",
                principalSchema: "community",
                principalTable: "Guides",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_GuideStep_Guides_GuideId",
                schema: "community",
                table: "GuideStep",
                column: "GuideId",
                principalSchema: "community",
                principalTable: "Guides",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GuideStepMedia_GuideStep_StepId",
                schema: "community",
                table: "GuideStepMedia",
                column: "StepId",
                principalSchema: "community",
                principalTable: "GuideStep",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_NewsComments_AspNetUsers_AuthorId",
                schema: "community",
                table: "NewsComments",
                column: "AuthorId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_NewsComments_NewsArticles_ArticleId",
                schema: "community",
                table: "NewsComments",
                column: "ArticleId",
                principalSchema: "community",
                principalTable: "NewsArticles",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_NewsLikes_AspNetUsers_UserId",
                schema: "Community",
                table: "NewsLikes",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PageAdmins_Pages_PageId",
                schema: "community",
                table: "PageAdmins",
                column: "PageId",
                principalSchema: "community",
                principalTable: "Pages",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PageFollowers_Pages_PageId",
                schema: "community",
                table: "PageFollowers",
                column: "PageId",
                principalSchema: "community",
                principalTable: "Pages",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PostLikes_Posts_PostId",
                schema: "community",
                table: "PostLikes",
                column: "PostId",
                principalSchema: "community",
                principalTable: "Posts",
                principalColumn: "Id");
        }
    }
}
