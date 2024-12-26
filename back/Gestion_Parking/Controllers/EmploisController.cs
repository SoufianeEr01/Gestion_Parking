using Gestion_Parking.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Collections.Generic;

namespace Gestion_Parking.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class EmploisController : ControllerBase
    {
        private readonly string connectionString;

        public EmploisController(IConfiguration configuration)
        {
            connectionString = configuration["ConnectionStrings:DefaultConnection"] ?? "";
        }

        // Créer un nouvel emploi
        [Authorize(Policy = "Admin")]
        [HttpPost]
        public IActionResult CreateEmploi([FromBody] Emploi emploi)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            

            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sql = @"INSERT INTO Emplois (Jour, DateDebut, DateFin, Groupe_Id) 
                           VALUES (@Jour, @DateDebut, @DateFin, @Groupe_Id)";
                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@Jour", emploi.Jour.ToString()); // Utilisation de l'énumération
                        command.Parameters.AddWithValue("@DateDebut", emploi.DateDebut);
                        command.Parameters.AddWithValue("@DateFin", emploi.DateFin);
                        command.Parameters.AddWithValue("@Groupe_Id", emploi.Groupe_Id);

                        command.ExecuteNonQuery();
                    }
                }
                return Ok("Emploi créé avec succès.");
            }
            catch (Exception ex)
            {
                return BadRequest(new { erreur = ex.Message });
            }
        }



        // Récupérer tous les emplois
        [Authorize(Policy = "EtudiantOuAdmin")]
        [HttpGet]
        public IActionResult GetAllEmplois()
        {
            var emplois = new List<Emploi>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sql = "SELECT * FROM Emplois";
                    using (var command = new SqlCommand(sql, connection))
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var emploi = new Emploi
                            {
                                Jour = Enum.Parse<Jour>(reader.GetString(0)), // Utilisation de l'énumération
                                DateDebut = reader.GetTimeSpan(1),
                                DateFin = reader.GetTimeSpan(2),
                                Groupe_Id = reader.GetInt32(3)
                            };
                            emplois.Add(emploi);
                        }
                    }
                }
                return Ok(emplois);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Une erreur est survenue lors de la récupération des emplois.");
            }
        }

        [Authorize(Policy = "EtudiantOuAdmin")]
        // Récupérer un emploi par Jour
        [HttpGet("{jour}")]
        public IActionResult GetEmploiByJour(Jour jour)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sql = "SELECT * FROM Emplois WHERE Jour = @Jour";
                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@Jour", jour.ToString()); // Utilisation de l'énumération
                        using (var reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                var emploi = new Emploi
                                {
                                    Jour = Enum.Parse<Jour>(reader.GetString(0)),
                                    DateDebut = reader.GetTimeSpan(1),
                                    DateFin = reader.GetTimeSpan(2),
                                    Groupe_Id = reader.GetInt32(3)
                                };
                                return Ok(emploi);
                            }
                            return NotFound("Emploi non trouvé.");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Une erreur est survenue lors de la récupération de l'emploi.");
            }
        }

        // Nouvelle fonction : Récupérer les emplois par ID d'étudiant
        [Authorize(Policy = "EtudiantOuAdmin")]
        [HttpGet("etudiant/{idEtudiant}")]
        public IActionResult GetEmploiByIdEtudiant(int idEtudiant)
        {
            var emplois = new List<Emploi>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sql = @"SELECT P.id AS IdEtudiant, E.* 
                                     FROM Emplois E 
                                     JOIN Groupes G ON E.Groupe_Id = G.Id 
                                     JOIN Personnes P ON G.Id = P.GroupeId 
                                     WHERE P.id = @idEtudiant";

                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@idEtudiant", idEtudiant);

                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                var emploi = new Emploi
                                {
                                    Jour = Enum.Parse<Jour>(reader.GetString(1)), // Supposant que la colonne Jour est en position 1
                                    DateDebut = reader.GetTimeSpan(2),
                                    DateFin = reader.GetTimeSpan(3),
                                    Groupe_Id = reader.GetInt32(4)
                                };
                                emplois.Add(emploi);
                            }
                        }
                    }
                }

                if (emplois.Count == 0)
                {
                    return NotFound("Aucun emploi trouvé pour cet étudiant.");
                }

                return Ok(emplois);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { erreur = ex.Message });
            }
        }

        [Authorize(Policy = "Admin")]
        // Mettre à jour un emploi
        [HttpPut("{jour}")]
        public IActionResult UpdateEmploi(Jour jour, Emploi emploi)
        {

            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sql = @"UPDATE Emplois 
                                   SET DateDebut = @DateDebut, DateFin = @DateFin, Groupe_Id = @Groupe_Id 
                                   WHERE Jour = @Jour";
                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@Jour", jour.ToString()); // Utilisation de l'énumération
                        command.Parameters.AddWithValue("@DateDebut", emploi.DateDebut);
                        command.Parameters.AddWithValue("@DateFin", emploi.DateFin);
                        command.Parameters.AddWithValue("@Groupe_Id", emploi.Groupe_Id);

                        int rowsAffected = command.ExecuteNonQuery();
                        if (rowsAffected == 0) return NotFound("Emploi non trouvé.");
                    }
                }
                return Ok("Emploi mis à jour avec succès.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Une erreur est survenue lors de la mise à jour de l'emploi.");
            }
        }

        [Authorize(Policy = "Admin")]
        // Supprimer un emploi
        [HttpDelete("{jour}")]
        public IActionResult DeleteEmploi(Jour jour)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sql = "DELETE FROM Emplois WHERE Jour = @Jour";
                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@Jour", jour.ToString()); // Utilisation de l'énumération

                        int rowsAffected = command.ExecuteNonQuery();
                        if (rowsAffected == 0) return NotFound("Emploi non trouvé.");
                    }
                }
                return Ok("Emploi supprimé avec succès.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Une erreur est survenue lors de la suppression de l'emploi.");
            }
        }
    }
}
