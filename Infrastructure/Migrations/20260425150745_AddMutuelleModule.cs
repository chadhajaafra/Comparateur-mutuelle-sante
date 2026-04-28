using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Comparateur.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddMutuelleModule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Garanties",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nom = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Icone = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Garanties", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Mutuelles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nom = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    Logo = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    SiteWeb = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    AssureurId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Mutuelles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Offres",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    MutuelleId = table.Column<Guid>(type: "uuid", nullable: false),
                    Nom = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Niveau = table.Column<int>(type: "integer", nullable: false),
                    PrixMensuel = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Offres", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Offres_Mutuelles_MutuelleId",
                        column: x => x.MutuelleId,
                        principalTable: "Mutuelles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OffreGaranties",
                columns: table => new
                {
                    OffreId = table.Column<Guid>(type: "uuid", nullable: false),
                    GarantieId = table.Column<Guid>(type: "uuid", nullable: false),
                    TauxRemboursement = table.Column<int>(type: "integer", nullable: false),
                    Plafond = table.Column<int>(type: "integer", nullable: true),
                    Details = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OffreGaranties", x => new { x.OffreId, x.GarantieId });
                    table.ForeignKey(
                        name: "FK_OffreGaranties_Garanties_GarantieId",
                        column: x => x.GarantieId,
                        principalTable: "Garanties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_OffreGaranties_Offres_OffreId",
                        column: x => x.OffreId,
                        principalTable: "Offres",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Garanties_Type",
                table: "Garanties",
                column: "Type");

            migrationBuilder.CreateIndex(
                name: "IX_Mutuelles_AssureurId",
                table: "Mutuelles",
                column: "AssureurId");

            migrationBuilder.CreateIndex(
                name: "IX_Mutuelles_Nom",
                table: "Mutuelles",
                column: "Nom");

            migrationBuilder.CreateIndex(
                name: "IX_OffreGaranties_GarantieId",
                table: "OffreGaranties",
                column: "GarantieId");

            migrationBuilder.CreateIndex(
                name: "IX_Offres_MutuelleId",
                table: "Offres",
                column: "MutuelleId");

            migrationBuilder.CreateIndex(
                name: "IX_Offres_Niveau",
                table: "Offres",
                column: "Niveau");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OffreGaranties");

            migrationBuilder.DropTable(
                name: "Garanties");

            migrationBuilder.DropTable(
                name: "Offres");

            migrationBuilder.DropTable(
                name: "Mutuelles");
        }
    }
}
