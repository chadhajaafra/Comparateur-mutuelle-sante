using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Comparateur.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddComparateurModule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ComparaisonSessions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true),
                    SessionToken = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    BudgetMax = table.Column<int>(type: "integer", nullable: true),
                    NiveauSouhaite = table.Column<int>(type: "integer", nullable: true),
                    TypesGarantieSouhaites = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ComparaisonSessions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ComparaisonItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SessionId = table.Column<Guid>(type: "uuid", nullable: false),
                    OffreId = table.Column<Guid>(type: "uuid", nullable: false),
                    Position = table.Column<int>(type: "integer", nullable: false),
                    AddedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ComparaisonItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ComparaisonItems_ComparaisonSessions_SessionId",
                        column: x => x.SessionId,
                        principalTable: "ComparaisonSessions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ComparaisonItems_Offres_OffreId",
                        column: x => x.OffreId,
                        principalTable: "Offres",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ComparaisonItems_OffreId",
                table: "ComparaisonItems",
                column: "OffreId");

            migrationBuilder.CreateIndex(
                name: "IX_ComparaisonItems_SessionId",
                table: "ComparaisonItems",
                column: "SessionId");

            migrationBuilder.CreateIndex(
                name: "IX_ComparaisonSessions_SessionToken",
                table: "ComparaisonSessions",
                column: "SessionToken");

            migrationBuilder.CreateIndex(
                name: "IX_ComparaisonSessions_UserId",
                table: "ComparaisonSessions",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ComparaisonItems");

            migrationBuilder.DropTable(
                name: "ComparaisonSessions");
        }
    }
}
