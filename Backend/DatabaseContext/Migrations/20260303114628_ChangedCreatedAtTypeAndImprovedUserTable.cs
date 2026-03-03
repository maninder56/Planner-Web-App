using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DatabaseContext.Migrations
{
    /// <inheritdoc />
    public partial class ChangedCreatedAtTypeAndImprovedUserTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_users_boards_LastBoardId",
                table: "users");

            migrationBuilder.DropIndex(
                name: "IX_users_LastBoardId",
                table: "users");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "users",
                type: "datetime(6)",
                nullable: false,
                defaultValueSql: "(CURRENT_TIMESTAMP)",
                oldClrType: typeof(DateOnly),
                oldType: "date",
                oldDefaultValueSql: "(CURRENT_TIMESTAMP)");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "boardstar",
                type: "datetime(6)",
                nullable: false,
                defaultValueSql: "(CURRENT_TIMESTAMP)",
                oldClrType: typeof(DateOnly),
                oldType: "date",
                oldDefaultValueSql: "(CURRENT_TIMESTAMP)");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "boards",
                type: "datetime(6)",
                nullable: false,
                defaultValueSql: "(CURRENT_TIMESTAMP)",
                oldClrType: typeof(DateOnly),
                oldType: "date",
                oldDefaultValueSql: "(CURRENT_TIMESTAMP)");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AlterColumn<DateOnly>(
                name: "CreatedAt",
                table: "users",
                type: "date",
                nullable: false,
                defaultValueSql: "(CURRENT_TIMESTAMP)",
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldDefaultValueSql: "(CURRENT_TIMESTAMP)");

            migrationBuilder.AlterColumn<DateOnly>(
                name: "CreatedAt",
                table: "boardstar",
                type: "date",
                nullable: false,
                defaultValueSql: "(CURRENT_TIMESTAMP)",
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldDefaultValueSql: "(CURRENT_TIMESTAMP)");

            migrationBuilder.AlterColumn<DateOnly>(
                name: "CreatedAt",
                table: "boards",
                type: "date",
                nullable: false,
                defaultValueSql: "(CURRENT_TIMESTAMP)",
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldDefaultValueSql: "(CURRENT_TIMESTAMP)");

            migrationBuilder.CreateIndex(
                name: "IX_users_LastBoardId",
                table: "users",
                column: "LastBoardId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_users_boards_LastBoardId",
                table: "users",
                column: "LastBoardId",
                principalTable: "boards",
                principalColumn: "BoardId");
        }
    }
}
