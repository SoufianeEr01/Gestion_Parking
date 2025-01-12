using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Gestion_Parking.Migrations
{
    /// <inheritdoc />
    public partial class AddPaiementRelation2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Etat",
                table: "Reservations",
                newName: "etat");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "etat",
                table: "Reservations",
                newName: "Etat");
        }
    }
}
