using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Comparateur.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateComparateurModule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AssureActuellement",
                table: "ComparaisonSessions",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Civilite",
                table: "ComparaisonSessions",
                type: "character varying(5)",
                maxLength: 5,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CodePostal",
                table: "ComparaisonSessions",
                type: "character varying(10)",
                maxLength: 10,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Couverture",
                table: "ComparaisonSessions",
                type: "character varying(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DateEffet",
                table: "ComparaisonSessions",
                type: "character varying(10)",
                maxLength: 10,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DateNaissance",
                table: "ComparaisonSessions",
                type: "character varying(10)",
                maxLength: 10,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PersonnesSupp",
                table: "ComparaisonSessions",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Profession",
                table: "ComparaisonSessions",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RegimeSocial",
                table: "ComparaisonSessions",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AssureActuellement",
                table: "ComparaisonSessions");

            migrationBuilder.DropColumn(
                name: "Civilite",
                table: "ComparaisonSessions");

            migrationBuilder.DropColumn(
                name: "CodePostal",
                table: "ComparaisonSessions");

            migrationBuilder.DropColumn(
                name: "Couverture",
                table: "ComparaisonSessions");

            migrationBuilder.DropColumn(
                name: "DateEffet",
                table: "ComparaisonSessions");

            migrationBuilder.DropColumn(
                name: "DateNaissance",
                table: "ComparaisonSessions");

            migrationBuilder.DropColumn(
                name: "PersonnesSupp",
                table: "ComparaisonSessions");

            migrationBuilder.DropColumn(
                name: "Profession",
                table: "ComparaisonSessions");

            migrationBuilder.DropColumn(
                name: "RegimeSocial",
                table: "ComparaisonSessions");
        }
    }
}
