using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DatabaseContext.Migrations
{
    /// <inheritdoc />
    public partial class AddUserLastBoardNavigation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_users_LastBoardId",
                table: "users",
                column: "LastBoardId");

            migrationBuilder.AddForeignKey(
                name: "FK_users_boards_LastBoardId",
                table: "users",
                column: "LastBoardId",
                principalTable: "boards",
                principalColumn: "BoardId",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_users_boards_LastBoardId",
                table: "users");

            migrationBuilder.DropIndex(
                name: "IX_users_LastBoardId",
                table: "users");
        }
    }
}
