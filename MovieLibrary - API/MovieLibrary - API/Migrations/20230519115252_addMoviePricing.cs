using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MovieLibrary___API.Migrations
{
    /// <inheritdoc />
    public partial class addMoviePricing : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<short>(
                name: "MoviePrice",
                table: "movies",
                type: "smallint",
                nullable: false,
                defaultValue: (short)0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MoviePrice",
                table: "movies");
        }
    }
}
