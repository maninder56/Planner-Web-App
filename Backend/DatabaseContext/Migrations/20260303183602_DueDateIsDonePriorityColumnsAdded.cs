using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DatabaseContext.Migrations
{
    /// <inheritdoc />
    public partial class DueDateIsDonePriorityColumnsAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateOnly>(
                name: "DueDate",
                table: "cards",
                type: "date",
                nullable: false,
                defaultValueSql: "(CURRENT_TIMESTAMP)");

            migrationBuilder.AddColumn<bool>(
                name: "IsDone",
                table: "cards",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Priority",
                table: "cards",
                type: "varchar(20)",
                nullable: false,
                defaultValue: "Low")
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DueDate",
                table: "cards");

            migrationBuilder.DropColumn(
                name: "IsDone",
                table: "cards");

            migrationBuilder.DropColumn(
                name: "Priority",
                table: "cards");
        }
    }
}
