using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MovieLibrary___API.Migrations
{
    /// <inheritdoc />
    public partial class addingReleaseYear : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ReleaseYear",
                table: "movies",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReleaseYear",
                table: "movies");
        }
    }
}
