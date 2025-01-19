using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Gestion_Parking.Migrations
{
    /// <inheritdoc />
    public partial class AddPaiementRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Etat",
                table: "Reservations",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Paiements",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    mode_paiement = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    prix_paye = table.Column<float>(type: "real", nullable: false),
                    personne_id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Paiements", x => x.id);
                    table.ForeignKey(
                        name: "FK_Paiements_Personnes_personne_id",
                        column: x => x.personne_id,
                        principalTable: "Personnes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Paiements_personne_id",
                table: "Paiements",
                column: "personne_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Paiements");

            migrationBuilder.DropColumn(
                name: "Etat",
                table: "Reservations");
        }
    }
}
