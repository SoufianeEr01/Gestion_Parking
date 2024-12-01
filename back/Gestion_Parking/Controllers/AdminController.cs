using Gestion_Parking.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;

namespace Gestion_Parking.Controllers
{
    [Authorize(Policy = "Admin")] // Autorisation basée sur le rôle Admin
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly string connectionString;

        public AdminController(IConfiguration configuration)
        {
            connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";
        }

        // Créer un Admin
        [AllowAnonymous]
        [HttpPost]
        public IActionResult CreateAdmin([FromBody] Admin admin)
        {
            try
            {
                // Hashage du mot de passe
                string hashedPassword = Personne.HashPassword(admin.motdepasse);

                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    // Vérification si l'email existe déjà
                    string checkEmailQuery = "SELECT COUNT(*) FROM Personnes WHERE email = @Email";
                    using (var checkCommand = new SqlCommand(checkEmailQuery, connection))
                    {
                        checkCommand.Parameters.AddWithValue("@Email", admin.email);
                        int emailCount = (int)checkCommand.ExecuteScalar();

                        if (emailCount > 0)
                        {
                            return BadRequest(new { erreur = "Cet email est déjà utilisé." });
                        }
                    }

                    // Insérer l'admin dans la table Personnes avec le Discriminator 'Admin'
                    string sqlInsert = "INSERT INTO Personnes (nom, prenom, email, motdepasse, Discriminator) " +
                                       "VALUES (@Nom, @Prenom, @Email, @Motdepasse, 'Admin')";
                    using (var commandInsert = new SqlCommand(sqlInsert, connection))
                    {
                        commandInsert.Parameters.AddWithValue("@Nom", admin.nom);
                        commandInsert.Parameters.AddWithValue("@Prenom", admin.prenom);
                        commandInsert.Parameters.AddWithValue("@Email", admin.email);
                        commandInsert.Parameters.AddWithValue("@Motdepasse", hashedPassword);
                        commandInsert.ExecuteNonQuery();
                    }

                    return Ok("Admin créé avec succès.");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { erreur = ex.Message });
            }
        }


        // Lire tous les enregistrements des Admins
        //[AllowAnonymous]
        [HttpGet]
        public IActionResult GetAllAdmins()
        {
            var adminList = new List<Admin>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sql = "SELECT id, nom, prenom, email FROM Personnes WHERE Discriminator = 'Admin'";
                    using (var command = new SqlCommand(sql, connection))
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var admin = new Admin
                            {
                                id = reader.GetInt32(0),
                                nom = reader.GetString(1),
                                prenom = reader.GetString(2),
                                email = reader.GetString(3)
                            };
                            adminList.Add(admin);
                        }
                    }
                }
                return Ok(adminList);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { erreur = "Une erreur est survenue lors de la récupération des données des admins." });
            }
        }

        // Lire un Admin par son ID
        [HttpGet("{id}")]
        public IActionResult GetAdminById(int id)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sql = "SELECT id, nom, prenom, email FROM Personnes WHERE id = @Id AND Discriminator = 'Admin'";
                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@Id", id);
                        using (var reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                var admin = new Admin
                                {
                                    id = reader.GetInt32(0),
                                    nom = reader.GetString(1),
                                    prenom = reader.GetString(2),
                                    email = reader.GetString(3)
                                };
                                return Ok(admin);
                            }
                            else
                            {
                                return NotFound("Admin non trouvé.");
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { erreur = "Une erreur est survenue lors de la récupération de l'admin." });
            }
        }

        // Mettre à jour un Admin
        [HttpPut("{id}")]
        public IActionResult UpdateAdmin(int id, [FromBody] Admin admin)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sql = "UPDATE Personnes SET nom = @Nom, prenom = @Prenom, email = @Email " +
                                 "WHERE id = @Id AND Discriminator = 'Admin'"; // Ajout de l'espace avant WHERE
                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@Id", id);
                        command.Parameters.AddWithValue("@Nom", admin.nom);
                        command.Parameters.AddWithValue("@Prenom", admin.prenom);
                        command.Parameters.AddWithValue("@Email", admin.email);

                        int rowsAffected = command.ExecuteNonQuery();
                        if (rowsAffected == 0)
                        {
                            return NotFound("Admin non trouvé ou non mis à jour.");
                        }
                    }
                }
                return Ok("Admin mis à jour avec succès.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { erreur = "Une erreur est survenue lors de la mise à jour de l'admin.", details = ex.Message });
            }
        }


        // Supprimer un Admin
        [HttpDelete("{id}")]
        public IActionResult DeleteAdmin(int id)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sql = "DELETE FROM Personnes WHERE id = @Id AND Discriminator = 'Admin'";
                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@Id", id);

                        int rowsAffected = command.ExecuteNonQuery();
                        if (rowsAffected == 0)
                        {
                            return NotFound("Admin non trouvé ou déjà supprimé.");
                        }
                    }
                }
                return Ok("Admin supprimé avec succès.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { erreur = "Une erreur est survenue lors de la suppression de l'admin." });
            }
        }
    }
}
