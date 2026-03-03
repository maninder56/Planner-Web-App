using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DatabaseContext.Migrations
{
    /// <inheritdoc />
    public partial class ColoursTableAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BackgroundColour",
                table: "boardlists");

            migrationBuilder.CreateTable(
                name: "colours",
                columns: table => new
                {
                    Name = table.Column<string>(type: "varchar(30)", maxLength: 30, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    HexValue = table.Column<string>(type: "varchar(10)", maxLength: 10, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_colours", x => x.Name);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_boards_BackgroundColour",
                table: "boards",
                column: "BackgroundColour");

            migrationBuilder.AddForeignKey(
                name: "FK_boards_colours_BackgroundColour",
                table: "boards",
                column: "BackgroundColour",
                principalTable: "colours",
                principalColumn: "Name",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_boards_colours_BackgroundColour",
                table: "boards");

            migrationBuilder.DropTable(
                name: "colours");

            migrationBuilder.DropIndex(
                name: "IX_boards_BackgroundColour",
                table: "boards");

            migrationBuilder.AddColumn<string>(
                name: "BackgroundColour",
                table: "boardlists",
                type: "varchar(30)",
                maxLength: 30,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");
        }
    }
}
