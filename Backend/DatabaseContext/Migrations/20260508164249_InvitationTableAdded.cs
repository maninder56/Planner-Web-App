using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DatabaseContext.Migrations
{
    /// <inheritdoc />
    public partial class InvitationTableAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "invitations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    BoardId = table.Column<int>(type: "int", nullable: false),
                    InvitedByUserId = table.Column<int>(type: "int", nullable: false),
                    InvitedUserId = table.Column<int>(type: "int", nullable: false),
                    InvitedUserEmail = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Role = table.Column<string>(type: "varchar(50)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Status = table.Column<string>(type: "varchar(50)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ExpiresAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "(CURRENT_TIMESTAMP)"),
                    AcceptedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_invitations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_invitations_boards_BoardId",
                        column: x => x.BoardId,
                        principalTable: "boards",
                        principalColumn: "BoardId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_invitations_users_InvitedByUserId",
                        column: x => x.InvitedByUserId,
                        principalTable: "users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_invitations_users_InvitedUserId",
                        column: x => x.InvitedUserId,
                        principalTable: "users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_invitations_BoardId_InvitedUserEmail",
                table: "invitations",
                columns: new[] { "BoardId", "InvitedUserEmail" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_invitations_InvitedByUserId",
                table: "invitations",
                column: "InvitedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_invitations_InvitedUserId",
                table: "invitations",
                column: "InvitedUserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "invitations");
        }
    }
}
