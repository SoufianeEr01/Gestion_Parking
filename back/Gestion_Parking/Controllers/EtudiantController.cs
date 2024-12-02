using Gestion_Parking.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Collections.Generic;
using BCrypt.Net;

namespace Gestion_Parking.Controllers
{

    
    [Route("api/[controller]")]
    [ApiController]
    public class EtudiantController : ControllerBase
    {
        private readonly string connectionString;

        public EtudiantController(IConfiguration configuration)
        {
            connectionString = configuration["ConnectionStrings:DefaultConnection"] ?? "";
        }

        // Créer un Étudiant
        
        [HttpPost]

        public IActionResult CreateEtudiant(Etudiant etudiant)
        {
            try
            {
                // Hashage du mot de passe avec la méthode de la classe Personne
                string hashedPassword = Personne.HashPassword(etudiant.motdepasse);

                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    // Vérifier si l'email existe déjà
                    string checkEmailQuery = "SELECT COUNT(*) FROM Personnes WHERE email = @Email";
                    using (var checkCommand = new SqlCommand(checkEmailQuery, connection))
                    {
                        checkCommand.Parameters.AddWithValue("@Email", etudiant.email);
                        int emailCount = (int)checkCommand.ExecuteScalar();

                        if (emailCount > 0)
                        {
                            return BadRequest(new { erreur = "Cet email est déjà utilisé." });
                        }
                    }

                    // Insérer l'étudiant si l'email n'existe pas
                    string insertQuery = "INSERT INTO Personnes (nom, prenom, email, motdepasse, Discriminator, GroupeId) " +
                                         "VALUES (@Nom, @Prenom, @Email, @Motdepasse, 'Etudiant', @GroupeId)";
                    using (var insertCommand = new SqlCommand(insertQuery, connection))
                    {
                        insertCommand.Parameters.AddWithValue("@Nom", etudiant.nom);
                        insertCommand.Parameters.AddWithValue("@Prenom", etudiant.prenom);
                        insertCommand.Parameters.AddWithValue("@Email", etudiant.email);
                        insertCommand.Parameters.AddWithValue("@Motdepasse", hashedPassword);
                        insertCommand.Parameters.AddWithValue("@GroupeId", etudiant.GroupeId);
                        insertCommand.ExecuteNonQuery();
                    }
                }
                return Ok("Étudiant créé avec succès.");
            }
            catch (SqlException sqlEx)
            {
                // Gérer les erreurs liées à la base de données
                return BadRequest(new { erreur = $"Database error: {sqlEx.Message}" });
            }
            catch (Exception ex)
            {
                // Gérer les autres exceptions
                return BadRequest(new { erreur = $"Unexpected error: {ex.Message}" });
            }
        }




        // Lire tous les enregistrements d'Étudiants
        [Authorize(Policy = "Admin")]
        [HttpGet]
        public IActionResult GetAllEtudiants()
        {
            var etudiantsList = new List<Etudiant>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sql = "SELECT id, nom, prenom, email, GroupeId FROM Personnes WHERE Discriminator = 'Etudiant'";
                    using (var command = new SqlCommand(sql, connection))
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var etudiant = new Etudiant
                            {
                                id = reader.GetInt32(0),
                                nom = reader.GetString(1),
                                prenom = reader.GetString(2),
                                email = reader.GetString(3),
                                GroupeId = reader.IsDBNull(4) ? 0 : reader.GetInt32(4) // Corrected index
                            };
                            etudiantsList.Add(etudiant);
                        }
                    }
                }
                return Ok(etudiantsList);
            }
            catch (Exception ex)
            {
                // Loguer l'erreur complète pour un meilleur diagnostic
                return StatusCode(500, new { erreur = $"Une erreur est survenue: {ex.Message}" });
            }
        }

        [Authorize(Policy = "EtudiantOuAdmin")]
        // Lire un Étudiant par son ID
        [HttpGet("{id}")]
        public IActionResult GetEtudiantById(int id)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sql = "SELECT id, nom, prenom, email, GroupeId FROM Personnes WHERE id = @Id AND Discriminator = 'Etudiant'";
                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@Id", id);
                        using (var reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                var etudiant = new Etudiant
                                {
                                    id = reader.GetInt32(0),
                                    nom = reader.GetString(1),
                                    prenom = reader.GetString(2),
                                    email = reader.GetString(3),
                                    GroupeId = reader.IsDBNull(4) ? 0 : reader.GetInt32(4)
                                };
                                return Ok(etudiant);
                            }
                            else
                            {
                                return NotFound("Étudiant non trouvé.");
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { erreur = "Une erreur est survenue lors de la récupération des données de l'étudiant." });
            }
        }

        // Mettre à jour un Étudiant
        [Authorize(Policy = "EtudiantOuAdmin")]
        [HttpPut("{id}")]
        public IActionResult UpdateEtudiant(int id, Etudiant etudiant)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sql = "UPDATE Personnes SET nom = @Nom, prenom = @Prenom, email = @Email, GroupeId = @GroupeId " +
                                 "WHERE id = @Id AND Discriminator = 'Etudiant'";
                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@Id", id);
                        command.Parameters.AddWithValue("@Nom", etudiant.nom);
                        command.Parameters.AddWithValue("@Prenom", etudiant.prenom);
                        command.Parameters.AddWithValue("@Email", etudiant.email);
                        command.Parameters.AddWithValue("@GroupeId", etudiant.GroupeId);

                        int rowsAffected = command.ExecuteNonQuery();
                        if (rowsAffected == 0)
                        {
                            return NotFound("Étudiant non trouvé ou non mis à jour.");
                        }
                    }
                }
                return Ok("Étudiant mis à jour avec succès.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { erreur = "Une erreur est survenue lors de la mise à jour de l'étudiant.", details = ex.Message });
            }
        }

        // Supprimer un Étudiant
        [Authorize(Policy = "EtudiantOuAdmin")]
        [HttpDelete("{id}")]
        public IActionResult DeleteEtudiant(int id)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sql = "DELETE FROM Personnes WHERE id = @Id AND Discriminator = 'Etudiant'";
                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@Id", id);

                        int rowsAffected = command.ExecuteNonQuery();
                        if (rowsAffected == 0)
                        {
                            return NotFound("Étudiant non trouvé ou déjà supprimé.");
                        }
                    }
                }
                return Ok("Étudiant supprimé avec succès.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { erreur = "Une erreur est survenue lors de la suppression de l'étudiant." });
            }
        }
    }
}
