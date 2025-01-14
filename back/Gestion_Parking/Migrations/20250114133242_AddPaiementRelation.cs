using System;
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
            migrationBuilder.CreateTable(
                name: "Contacts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateEnvoi = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Contacts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Groupes",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    nom = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Groupes", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "PlaceParkings",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    numero = table.Column<int>(type: "int", nullable: false),
                    etage = table.Column<int>(type: "int", nullable: false),
                    etat = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    dateFinReservation = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlaceParkings", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Reponses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ContactId = table.Column<int>(type: "int", nullable: false),
                    MessageReponse = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateReponse = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reponses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Reponses_Contacts_ContactId",
                        column: x => x.ContactId,
                        principalTable: "Contacts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Emplois",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Groupe_Id = table.Column<int>(type: "int", nullable: false),
                    Jour = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    DateDebut = table.Column<TimeSpan>(type: "time", nullable: false),
                    DateFin = table.Column<TimeSpan>(type: "time", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Emplois", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Emplois_Groupes_Groupe_Id",
                        column: x => x.Groupe_Id,
                        principalTable: "Groupes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Personnes",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    prenom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    motdepasse = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Discriminator = table.Column<string>(type: "nvarchar(13)", maxLength: 13, nullable: false),
                    GroupeId = table.Column<int>(type: "int", nullable: true),
                    role = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Personnes", x => x.id);
                    table.ForeignKey(
                        name: "FK_Personnes_Groupes_GroupeId",
                        column: x => x.GroupeId,
                        principalTable: "Groupes",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "EmploiPersonnels",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PersonnelId = table.Column<int>(type: "int", nullable: false),
                    Jour = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    HeureDebut = table.Column<TimeSpan>(type: "time", nullable: false),
                    HeureFin = table.Column<TimeSpan>(type: "time", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmploiPersonnels", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EmploiPersonnels_Personnes_PersonnelId",
                        column: x => x.PersonnelId,
                        principalTable: "Personnes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

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

            migrationBuilder.CreateTable(
                name: "Reservations",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    date = table.Column<DateOnly>(type: "date", nullable: false),
                    heureDebut = table.Column<TimeOnly>(type: "time", nullable: false),
                    heureFin = table.Column<TimeOnly>(type: "time", nullable: false),
                    lieu = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    etat = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    personne_id = table.Column<int>(type: "int", nullable: false),
                    placeParking_id = table.Column<int>(type: "int", nullable: false),
                    Etudiantid = table.Column<int>(type: "int", nullable: true),
                    Personnelid = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reservations", x => x.id);
                    table.ForeignKey(
                        name: "FK_Reservations_Personnes_Etudiantid",
                        column: x => x.Etudiantid,
                        principalTable: "Personnes",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_Reservations_Personnes_Personnelid",
                        column: x => x.Personnelid,
                        principalTable: "Personnes",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_Reservations_Personnes_personne_id",
                        column: x => x.personne_id,
                        principalTable: "Personnes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Reservations_PlaceParkings_placeParking_id",
                        column: x => x.placeParking_id,
                        principalTable: "PlaceParkings",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EmploiPersonnels_PersonnelId",
                table: "EmploiPersonnels",
                column: "PersonnelId");

            migrationBuilder.CreateIndex(
                name: "IX_Emplois_Groupe_Id",
                table: "Emplois",
                column: "Groupe_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Paiements_personne_id",
                table: "Paiements",
                column: "personne_id");

            migrationBuilder.CreateIndex(
                name: "IX_Personnes_GroupeId",
                table: "Personnes",
                column: "GroupeId");

            migrationBuilder.CreateIndex(
                name: "IX_Reponses_ContactId",
                table: "Reponses",
                column: "ContactId");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_Etudiantid",
                table: "Reservations",
                column: "Etudiantid");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_personne_id",
                table: "Reservations",
                column: "personne_id");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_Personnelid",
                table: "Reservations",
                column: "Personnelid");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_placeParking_id",
                table: "Reservations",
                column: "placeParking_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EmploiPersonnels");

            migrationBuilder.DropTable(
                name: "Emplois");

            migrationBuilder.DropTable(
                name: "Paiements");

            migrationBuilder.DropTable(
                name: "Reponses");

            migrationBuilder.DropTable(
                name: "Reservations");

            migrationBuilder.DropTable(
                name: "Contacts");

            migrationBuilder.DropTable(
                name: "Personnes");

            migrationBuilder.DropTable(
                name: "PlaceParkings");

            migrationBuilder.DropTable(
                name: "Groupes");
        }
    }
}
