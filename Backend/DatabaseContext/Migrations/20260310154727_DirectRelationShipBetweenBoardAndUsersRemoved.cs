using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DatabaseContext.Migrations
{
    /// <inheritdoc />
    public partial class DirectRelationShipBetweenBoardAndUsersRemoved : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_boards_users_UserId",
                table: "boards");

            migrationBuilder.DropIndex(
                name: "IX_boards_UserId",
                table: "boards");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "boards");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "boards",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_boards_UserId",
                table: "boards",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_boards_users_UserId",
                table: "boards",
                column: "UserId",
                principalTable: "users",
                principalColumn: "UserId");
        }
    }
}
