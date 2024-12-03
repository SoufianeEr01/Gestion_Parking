using Gestion_Parking.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Collections.Generic;

namespace Gestion_Parking.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class GroupController : ControllerBase
    {
        private readonly string connectionString;

        public GroupController(IConfiguration configuration)
        {
            connectionString = configuration["ConnectionStrings:DefaultConnection"] ?? string.Empty;
        }

        [Authorize(Policy = "Admin")] // Restriction aux administrateurs
        [HttpPost]
        public IActionResult CreateGroup(Groupe group)
        {
            if (string.IsNullOrWhiteSpace(group.nom))
            {
                return BadRequest(new { erreur = "Le nom du groupe est obligatoire." });
            }

            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    const string sql = "INSERT INTO Groupes (nom) VALUES (@Nom)"; // Supposant ID auto-incrémenté
                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@Nom", group.nom);
                        command.ExecuteNonQuery();
                    }
                }
                return Ok(new { message = "Groupe créé avec succès." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { erreur = ex.Message });
            }
        }
        
        [HttpGet]
        public IActionResult GetAllGroups()
        {
            var groups = new List<Groupe>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sql = "SELECT * FROM Groupes";
                    using (var command = new SqlCommand(sql, connection))
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var group = new Groupe
                            {
                                id = reader.GetInt32(0),  // Utilisez GetInt32 pour l'id
                                nom = reader.GetString(1)
                            };
                            groups.Add(group);
                        }
                    }
                }
                return Ok(groups);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Une erreur est survenue lors de la récupération des groupes.");
            }
        }

        [Authorize(Policy = "EtudiantOuAdmin")]
        [HttpGet("{id}")]
        public IActionResult GetGroupById(int id)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sql = "SELECT * FROM Groupes WHERE id = @Id";
                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@Id", id);

                        using (var reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                var group = new Groupe
                                {
                                    id = reader.GetInt32(0),  // Assurez-vous que la colonne ID est bien en premier
                                    nom = reader.GetString(1) // Assurez-vous que la colonne Nom est bien en deuxième
                                };
                                return Ok(group);
                            }
                            else
                            {
                                return NotFound(new { erreur = "Groupe non trouvé." });
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { erreur = ex.Message });
            }
        }


        [Authorize(Policy = "Admin")]
        [HttpPut("{id}")]
        public IActionResult UpdateGroup(int id, Groupe group)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sql = "UPDATE Groupes SET nom = @Nom WHERE id = @Id";
                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@Id", id);
                        command.Parameters.AddWithValue("@Nom", group.nom);

                        int rowsAffected = command.ExecuteNonQuery();
                        if (rowsAffected == 0) return NotFound("Groupe non trouvé.");
                    }
                }
                return Ok("Groupe mis à jour avec succès.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Une erreur est survenue lors de la mise à jour du groupe.");
            }
        }

        [Authorize(Policy = "Admin")]
        [HttpDelete("{id}")]
        public IActionResult DeleteGroup(int id)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sql = "DELETE FROM Groupes WHERE id = @Id";
                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@Id", id);

                        int rowsAffected = command.ExecuteNonQuery();
                        if (rowsAffected == 0) return NotFound("Groupe non trouvé.");
                    }
                }
                return Ok("Groupe supprimé avec succès.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Une erreur est survenue lors de la suppression du groupe.");
            }
        }
    }
}
