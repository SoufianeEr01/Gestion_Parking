using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Gestion_Parking.Migrations
{
    /// <inheritdoc />
    public partial class firstMigratioNAfteR1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reponse_Contacts_ContactId",
                table: "Reponse");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Reponse",
                table: "Reponse");

            migrationBuilder.RenameTable(
                name: "Reponse",
                newName: "Reponses");

            migrationBuilder.RenameIndex(
                name: "IX_Reponse_ContactId",
                table: "Reponses",
                newName: "IX_Reponses_ContactId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Reponses",
                table: "Reponses",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Reponses_Contacts_ContactId",
                table: "Reponses",
                column: "ContactId",
                principalTable: "Contacts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reponses_Contacts_ContactId",
                table: "Reponses");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Reponses",
                table: "Reponses");

            migrationBuilder.RenameTable(
                name: "Reponses",
                newName: "Reponse");

            migrationBuilder.RenameIndex(
                name: "IX_Reponses_ContactId",
                table: "Reponse",
                newName: "IX_Reponse_ContactId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Reponse",
                table: "Reponse",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Reponse_Contacts_ContactId",
                table: "Reponse",
                column: "ContactId",
                principalTable: "Contacts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
