using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CommunityCar.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddServicesEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Experts",
                schema: "services",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Bio = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    PhotoUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Specialties = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BrandsExpertise = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    YearsExperience = table.Column<int>(type: "int", nullable: false),
                    Certifications = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Languages = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OffersChat = table.Column<bool>(type: "bit", nullable: false),
                    OffersVoiceCall = table.Column<bool>(type: "bit", nullable: false),
                    OffersVideoCall = table.Column<bool>(type: "bit", nullable: false),
                    OffersInPerson = table.Column<bool>(type: "bit", nullable: false),
                    ChatRatePerMin = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    VoiceRatePerMin = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    VideoRatePerMin = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    InPersonRatePerHour = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Currency = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    AvailabilityScheduleJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ResponseTimeMins = table.Column<int>(type: "int", nullable: false),
                    AverageRating = table.Column<double>(type: "float", nullable: false),
                    TotalReviews = table.Column<int>(type: "int", nullable: false),
                    TotalConsultations = table.Column<int>(type: "int", nullable: false),
                    QuestionsAnswered = table.Column<int>(type: "int", nullable: false),
                    VerificationLevel = table.Column<int>(type: "int", nullable: false),
                    VerifiedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AcceptsAITriagedCases = table.Column<bool>(type: "bit", nullable: false),
                    AIMatchScore = table.Column<double>(type: "float", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Experts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Experts_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FuelStations",
                schema: "services",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProviderId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Brand = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    LogoUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    City = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    State = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Country = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Latitude = table.Column<double>(type: "float", nullable: false),
                    Longitude = table.Column<double>(type: "float", nullable: false),
                    Is24Hours = table.Column<bool>(type: "bit", nullable: false),
                    OperatingHoursJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HasPetrol = table.Column<bool>(type: "bit", nullable: false),
                    HasDiesel = table.Column<bool>(type: "bit", nullable: false),
                    HasPremium = table.Column<bool>(type: "bit", nullable: false),
                    HasCNG = table.Column<bool>(type: "bit", nullable: false),
                    HasLPG = table.Column<bool>(type: "bit", nullable: false),
                    PetrolPrice = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    DieselPrice = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    PremiumPrice = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    CNGPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    LPGPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Currency = table.Column<int>(type: "int", nullable: false),
                    PricesUpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    HasConvenienceStore = table.Column<bool>(type: "bit", nullable: false),
                    HasRestroom = table.Column<bool>(type: "bit", nullable: false),
                    HasATM = table.Column<bool>(type: "bit", nullable: false),
                    HasCarWash = table.Column<bool>(type: "bit", nullable: false),
                    HasAirPump = table.Column<bool>(type: "bit", nullable: false),
                    HasFoodService = table.Column<bool>(type: "bit", nullable: false),
                    AcceptsCash = table.Column<bool>(type: "bit", nullable: false),
                    AcceptsCard = table.Column<bool>(type: "bit", nullable: false),
                    AcceptsMobilePayment = table.Column<bool>(type: "bit", nullable: false),
                    HasLoyaltyProgram = table.Column<bool>(type: "bit", nullable: false),
                    AverageRating = table.Column<double>(type: "float", nullable: false),
                    TotalReviews = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FuelStations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FuelStations_ServiceProviders_ProviderId",
                        column: x => x.ProviderId,
                        principalSchema: "services",
                        principalTable: "ServiceProviders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Workshops",
                schema: "services",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProviderId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    Specialties = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BrandsServiced = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VehicleTypesServiced = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsOEMCertified = table.Column<bool>(type: "bit", nullable: false),
                    Certifications = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ServiceBays = table.Column<int>(type: "int", nullable: false),
                    MechanicsCount = table.Column<int>(type: "int", nullable: false),
                    AverageWaitTimeMins = table.Column<int>(type: "int", nullable: false),
                    HasDiagnosticEquipment = table.Column<bool>(type: "bit", nullable: false),
                    OffersPickupDelivery = table.Column<bool>(type: "bit", nullable: false),
                    HasLoanerCars = table.Column<bool>(type: "bit", nullable: false),
                    HasWaitingArea = table.Column<bool>(type: "bit", nullable: false),
                    OffersWarranty = table.Column<bool>(type: "bit", nullable: false),
                    WarrantyDays = table.Column<int>(type: "int", nullable: false),
                    LaborRatePerHour = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Currency = table.Column<int>(type: "int", nullable: false),
                    UsesOEMParts = table.Column<bool>(type: "bit", nullable: false),
                    UsesAftermarketParts = table.Column<bool>(type: "bit", nullable: false),
                    AIMatchScore = table.Column<double>(type: "float", nullable: false),
                    IsAIRecommended = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Workshops", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Workshops_ServiceProviders_ProviderId",
                        column: x => x.ProviderId,
                        principalSchema: "services",
                        principalTable: "ServiceProviders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Mechanics",
                schema: "services",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    WorkshopId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    PhotoUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Bio = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    YearsExperience = table.Column<int>(type: "int", nullable: false),
                    Specialties = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Certifications = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AverageRating = table.Column<double>(type: "float", nullable: false),
                    TotalReviews = table.Column<int>(type: "int", nullable: false),
                    JobsCompleted = table.Column<int>(type: "int", nullable: false),
                    IsLeadMechanic = table.Column<bool>(type: "bit", nullable: false),
                    IsAvailable = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Mechanics", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Mechanics_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Mechanics_Workshops_WorkshopId",
                        column: x => x.WorkshopId,
                        principalSchema: "services",
                        principalTable: "Workshops",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WorkshopServices",
                schema: "services",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    WorkshopId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    Category = table.Column<int>(type: "int", nullable: false),
                    BasePrice = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    MaxPrice = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    PricingType = table.Column<int>(type: "int", nullable: false),
                    Currency = table.Column<int>(type: "int", nullable: false),
                    EstimatedDurationMins = table.Column<int>(type: "int", nullable: false),
                    RequiresAppointment = table.Column<bool>(type: "bit", nullable: false),
                    IsPopular = table.Column<bool>(type: "bit", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    WarrantyDays = table.Column<int>(type: "int", nullable: false),
                    WarrantyTerms = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkshopServices", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WorkshopServices_Workshops_WorkshopId",
                        column: x => x.WorkshopId,
                        principalSchema: "services",
                        principalTable: "Workshops",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Experts_AverageRating",
                schema: "services",
                table: "Experts",
                column: "AverageRating");

            migrationBuilder.CreateIndex(
                name: "IX_Experts_FullName",
                schema: "services",
                table: "Experts",
                column: "FullName");

            migrationBuilder.CreateIndex(
                name: "IX_Experts_Status",
                schema: "services",
                table: "Experts",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Experts_UserId",
                schema: "services",
                table: "Experts",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_FuelStations_Brand",
                schema: "services",
                table: "FuelStations",
                column: "Brand");

            migrationBuilder.CreateIndex(
                name: "IX_FuelStations_City_Status",
                schema: "services",
                table: "FuelStations",
                columns: new[] { "City", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_FuelStations_Latitude_Longitude",
                schema: "services",
                table: "FuelStations",
                columns: new[] { "Latitude", "Longitude" });

            migrationBuilder.CreateIndex(
                name: "IX_FuelStations_Name",
                schema: "services",
                table: "FuelStations",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_FuelStations_ProviderId",
                schema: "services",
                table: "FuelStations",
                column: "ProviderId");

            migrationBuilder.CreateIndex(
                name: "IX_Mechanics_FullName",
                schema: "services",
                table: "Mechanics",
                column: "FullName");

            migrationBuilder.CreateIndex(
                name: "IX_Mechanics_UserId",
                schema: "services",
                table: "Mechanics",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Mechanics_WorkshopId",
                schema: "services",
                table: "Mechanics",
                column: "WorkshopId");

            migrationBuilder.CreateIndex(
                name: "IX_Workshops_Name",
                schema: "services",
                table: "Workshops",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_Workshops_ProviderId",
                schema: "services",
                table: "Workshops",
                column: "ProviderId");

            migrationBuilder.CreateIndex(
                name: "IX_WorkshopServices_Category",
                schema: "services",
                table: "WorkshopServices",
                column: "Category");

            migrationBuilder.CreateIndex(
                name: "IX_WorkshopServices_WorkshopId",
                schema: "services",
                table: "WorkshopServices",
                column: "WorkshopId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Experts",
                schema: "services");

            migrationBuilder.DropTable(
                name: "FuelStations",
                schema: "services");

            migrationBuilder.DropTable(
                name: "Mechanics",
                schema: "services");

            migrationBuilder.DropTable(
                name: "WorkshopServices",
                schema: "services");

            migrationBuilder.DropTable(
                name: "Workshops",
                schema: "services");
        }
    }
}
