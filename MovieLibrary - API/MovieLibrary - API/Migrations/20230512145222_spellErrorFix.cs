using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MovieLibrary___API.Migrations
{
    /// <inheritdoc />
    public partial class spellErrorFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsAvilable",
                table: "movies",
                newName: "IsAvailable");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsAvailable",
                table: "movies",
                newName: "IsAvilable");
        }
    }
}
