using Gestion_Parking.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;

namespace Gestion_Parking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmploiPersonnelController : ControllerBase
    {
        private readonly string connectionString;
        private readonly ILogger<EmploiPersonnelController> _logger;

        public EmploiPersonnelController(IConfiguration configuration, ILogger<EmploiPersonnelController> logger)
        {
            connectionString = configuration["ConnectionStrings:DefaultConnection"] ?? "";
            _logger = logger;
        }

        [Authorize(Policy = "Admin")]
        [HttpPost]
        public IActionResult CreateEmploiEnseignant([FromBody] EmploiPersonnel emploi)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Données invalides.");
            }

            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    // Vérifier l'existence d'un emploi pour le même jour et personnel
                    string checkSql = "SELECT COUNT(*) FROM EmploiPersonnels WHERE Jour = @Jour AND PersonnelId = @PersonnelId";
                    using (var checkCommand = new SqlCommand(checkSql, connection))
                    {
                        checkCommand.Parameters.AddWithValue("@Jour", emploi.Jour.ToString());
                        checkCommand.Parameters.AddWithValue("@PersonnelId", emploi.PersonnelId);

                        int count = (int)checkCommand.ExecuteScalar();
                        if (count > 0)
                        {
                            return BadRequest("Un emploi existe déjà pour ce jour et ce personnel.");
                        }
                    }

                    // Ajouter le nouvel emploi personnel
                    string insertSql = @"
                INSERT INTO EmploiPersonnels (Jour, HeureDebut, HeureFin, Role, PersonnelId) 
                VALUES (@Jour, @HeureDebut, @HeureFin, @Role, @PersonnelId)";
                    using (var insertCommand = new SqlCommand(insertSql, connection))
                    {
                        insertCommand.Parameters.AddWithValue("@Jour", emploi.Jour.ToString());
                        insertCommand.Parameters.AddWithValue("@HeureDebut", emploi.HeureDebut);
                        insertCommand.Parameters.AddWithValue("@HeureFin", emploi.HeureFin);
                        insertCommand.Parameters.AddWithValue("@Role", emploi.Role);
                        insertCommand.Parameters.AddWithValue("@PersonnelId", emploi.PersonnelId);

                        insertCommand.ExecuteNonQuery();
                    }
                }
                return Ok("Emploi de l'enseignant ajouté avec succès.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de l'ajout de l'emploi enseignant.");
                return StatusCode(500, "Une erreur est survenue.");
            }
        }

        [Authorize(Policy = "Admin")]
        [HttpPost("GenerateEmploiAdministrateurs")]
        public IActionResult GenerateEmploiAdministrateurs()
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    // Sélectionner tous les administrateurs
                    string selectSql = @"
                SELECT Id, Nom, Prenom 
                FROM Personnes 
                WHERE Discriminator = 'Personnel' AND Role = 'administrateur';";
                    var administrateurs = new List<dynamic>();

                    using (var selectCommand = new SqlCommand(selectSql, connection))
                    using (var reader = selectCommand.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            administrateurs.Add(new
                            {
                                Id = reader.GetInt32(0),
                                Nom = reader.GetString(1),
                                Prenom = reader.GetString(2)
                            });
                        }
                    }

                    // Insérer les emplois pour chaque administrateur s'ils n'existent pas déjà
                    foreach (var admin in administrateurs)
                    {
                        for (int jour = 0; jour <= 5; jour++) // Lundi à Samedi
                        {
                            // Vérifier si l'emploi existe déjà
                            string checkSql = @"
                        SELECT COUNT(1) 
                        FROM EmploiPersonnels 
                        WHERE PersonnelId = @PersonnelId AND Jour = @Jour;";
                            bool emploiExiste;

                            using (var checkCommand = new SqlCommand(checkSql, connection))
                            {
                                checkCommand.Parameters.AddWithValue("@PersonnelId", admin.Id);
                                checkCommand.Parameters.AddWithValue("@Jour", ((Jour)jour).ToString());
                                emploiExiste = (int)checkCommand.ExecuteScalar() > 0;
                            }

                            // Si l'emploi n'existe pas, l'insérer
                            if (!emploiExiste)
                            {
                                var emploi = new EmploiPersonnel
                                {
                                    Jour = (Jour)jour,
                                    HeureDebut = jour == 5 ? new TimeSpan(8, 30, 0) : new TimeSpan(8, 30, 0),
                                    HeureFin = jour == 5 ? new TimeSpan(12, 30, 0) : new TimeSpan(16, 30, 0),
                                    Role = "administrateur",
                                    PersonnelId = admin.Id
                                };

                                string insertSql = @"
                            INSERT INTO EmploiPersonnels (Jour, HeureDebut, HeureFin, Role, PersonnelId) 
                            VALUES (@Jour, @HeureDebut, @HeureFin, @Role, @PersonnelId)";
                                using (var insertCommand = new SqlCommand(insertSql, connection))
                                {
                                    insertCommand.Parameters.AddWithValue("@Jour", emploi.Jour.ToString());
                                    insertCommand.Parameters.AddWithValue("@HeureDebut", emploi.HeureDebut);
                                    insertCommand.Parameters.AddWithValue("@HeureFin", emploi.HeureFin);
                                    insertCommand.Parameters.AddWithValue("@Role", emploi.Role);
                                    insertCommand.Parameters.AddWithValue("@PersonnelId", emploi.PersonnelId);

                                    insertCommand.ExecuteNonQuery();
                                }
                            }
                        }
                    }
                }

                return Ok("Emplois générés pour tous les administrateurs.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la génération des emplois pour les administrateurs.");
                return StatusCode(500, "Une erreur est survenue.");
            }
        }




        // Récupérer les emplois d'un personnel spécifique
        [AllowAnonymous]
        [HttpGet("personnel/{personnelId}")]
        public IActionResult GetEmploiByPersonnel(int personnelId)
        {
            var emplois = new List<EmploiPersonnel>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sql = @"
                        SELECT Id, Jour, HeureDebut, HeureFin, Role, PersonnelId 
                        FROM EmploiPersonnels 
                        WHERE PersonnelId = @PersonnelId ORDER BY Jour ";
                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@PersonnelId", personnelId);

                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                emplois.Add(new EmploiPersonnel
                                {
                                    Id = reader.GetInt32(0),
                                    Jour = Enum.Parse<Jour>(reader.GetString(1)),
                                    HeureDebut = reader.GetTimeSpan(2),
                                    HeureFin = reader.GetTimeSpan(3),
                                    Role = reader.GetString(4),
                                    PersonnelId = reader.GetInt32(5)
                                });
                            }
                        }
                    }
                }

                if (emplois.Count == 0)
                {
                    return NotFound("Aucun emploi trouvé pour ce personnel.");
                }

                return Ok(emplois);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la récupération des emplois.");
                return StatusCode(500, "Une erreur est survenue.");
            }
        }

        [Authorize(Policy = "Admin")]
        [HttpGet("personnel")]
        public IActionResult GetEmploiPersonnels()
        {
            var emplois = new List<EmploiPersonnel>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sql = @"
                        SELECT Id, Jour, HeureDebut, HeureFin, Role, PersonnelId 
                        FROM EmploiPersonnels ";
                    using (var command = new SqlCommand(sql, connection))
                    {
                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                emplois.Add(new EmploiPersonnel
                                {
                                    Id = reader.GetInt32(0),
                                    Jour = Enum.Parse<Jour>(reader.GetString(1)),
                                    HeureDebut = reader.GetTimeSpan(2),
                                    HeureFin = reader.GetTimeSpan(3),
                                    Role = reader.GetString(4),
                                    PersonnelId = reader.GetInt32(5)
                                });
                            }
                        }
                    }
                }

                if (emplois.Count == 0)
                {
                    return NotFound("Aucun emploi trouvé pour les personnels.");
                }

                return Ok(emplois);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la récupération des emplois.");
                return StatusCode(500, "Une erreur est survenue.");
            }
        }

        // Modifier un emploi personnel
        [Authorize(Policy = "Admin")]
        [HttpPut("{id}")]
        public IActionResult UpdateEmploiPersonnel(int id, [FromBody] EmploiPersonnel emploi)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sql = @"
                        UPDATE EmploiPersonnels 
                        SET Jour = @Jour, HeureDebut = @HeureDebut, HeureFin = @HeureFin, Role = @Role, PersonnelId = @PersonnelId 
                        WHERE Id = @Id";
                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@Id", id);
                        command.Parameters.AddWithValue("@Jour", emploi.Jour.ToString());
                        command.Parameters.AddWithValue("@HeureDebut", emploi.HeureDebut);
                        command.Parameters.AddWithValue("@HeureFin", emploi.HeureFin);
                        command.Parameters.AddWithValue("@Role", emploi.Role);
                        command.Parameters.AddWithValue("@PersonnelId", emploi.PersonnelId);

                        int rowsAffected = command.ExecuteNonQuery();
                        if (rowsAffected == 0) return NotFound("Emploi non trouvé.");
                    }
                }
                return Ok("Emploi modifié avec succès.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la modification de l'emploi.");
                return StatusCode(500, "Une erreur est survenue.");
            }
        }

        // Supprimer un emploi personnel
        [Authorize(Policy = "Admin")]
        [HttpDelete("{id}")]
        public IActionResult DeleteEmploiPersonnel(int id)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sql = "DELETE FROM EmploiPersonnels WHERE Id = @Id";
                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@Id", id);

                        int rowsAffected = command.ExecuteNonQuery();
                        if (rowsAffected == 0) return NotFound("Emploi non trouvé.");
                    }
                }
                return Ok("Emploi supprimé avec succès.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la suppression de l'emploi.");
                return StatusCode(500, "Une erreur est survenue.");
            }
        }
    }
}
