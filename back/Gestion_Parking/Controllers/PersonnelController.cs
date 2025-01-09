using Gestion_Parking.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Collections.Generic;

namespace Gestion_Parking.Controllers
{
    [Authorize(Policy = "PersonnelOuAdmin")]
    [Route("api/[controller]")]
    [ApiController]
    public class PersonnelController : ControllerBase
    {
        private readonly string connectionString;

        public PersonnelController(IConfiguration configuration)
        {
            connectionString = configuration["ConnectionStrings:DefaultConnection"] ?? "";
        }

        // Créer un Personnel
        [AllowAnonymous]
        [HttpPost]
        public IActionResult CreatePersonnel(Personnel personnel)
        {
            try
            {
                // Hashage du mot de passe
                string hashedPassword = Personne.HashPassword(personnel.motdepasse);

                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    // Vérification si l'email existe déjà
                    string checkEmailQuery = "SELECT COUNT(*) FROM Personnes WHERE email = @Email";
                    using (var checkCommand = new SqlCommand(checkEmailQuery, connection))
                    {
                        checkCommand.Parameters.AddWithValue("@Email", personnel.email);
                        int emailCount = (int)checkCommand.ExecuteScalar();

                        if (emailCount > 0)
                        {
                            return BadRequest(new { erreur = "Cet email est déjà utilisé." });
                        }
                    }

                    // Insertion du personnel si l'email n'existe pas
                    string insertQuery = "INSERT INTO Personnes (nom, prenom, email, motdepasse, Discriminator, role) " +
                                         "VALUES (@Nom, @Prenom, @Email, @Motdepasse, 'Personnel', @Role)";
                    using (var insertCommand = new SqlCommand(insertQuery, connection))
                    {
                        insertCommand.Parameters.AddWithValue("@Nom", personnel.nom);
                        insertCommand.Parameters.AddWithValue("@Prenom", personnel.prenom);
                        insertCommand.Parameters.AddWithValue("@Email", personnel.email);
                        insertCommand.Parameters.AddWithValue("@Motdepasse", hashedPassword);
                        insertCommand.Parameters.AddWithValue("@Role", personnel.role);
                        insertCommand.ExecuteNonQuery();
                    }

                    // Si le rôle est Administrateur, générer l'emploi
                    if (personnel.role == "Administrateur")
                    {
                        GenerateEmploiPourAdministrateur(personnel.email);
                    }
                }

                return Ok("Personnel créé avec succès.");
            }
            catch (Exception ex)
            {
                // Gérer les exceptions générales
                return BadRequest(new { erreur = ex.Message });
            }
        }

        private void GenerateEmploiPourAdministrateur(string email)
        {
            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();

                // Récupérer l'ID de l'administrateur basé sur son email
                string getAdminIdQuery = "SELECT Id FROM Personnes WHERE email = @Email AND role = 'Administrateur'";
                int adminId;

                using (var getAdminIdCommand = new SqlCommand(getAdminIdQuery, connection))
                {
                    getAdminIdCommand.Parameters.AddWithValue("@Email", email);
                    adminId = (int)getAdminIdCommand.ExecuteScalar();
                }

                // Générer l'emploi pour cet administrateur
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
                        checkCommand.Parameters.AddWithValue("@PersonnelId", adminId);
                        checkCommand.Parameters.AddWithValue("@Jour", ((Jour)jour).ToString());
                        emploiExiste = (int)checkCommand.ExecuteScalar() > 0;
                    }

                    // Si l'emploi n'existe pas, l'insérer
                    if (!emploiExiste)
                    {
                        string insertSql = @"
                INSERT INTO EmploiPersonnels (Jour, HeureDebut, HeureFin, Role, PersonnelId) 
                VALUES (@Jour, @HeureDebut, @HeureFin, @Role, @PersonnelId)";
                        using (var insertCommand = new SqlCommand(insertSql, connection))
                        {
                            insertCommand.Parameters.AddWithValue("@Jour", ((Jour)jour).ToString());
                            insertCommand.Parameters.AddWithValue("@HeureDebut", jour == 5 ? new TimeSpan(8, 30, 0) : new TimeSpan(8, 30, 0));
                            insertCommand.Parameters.AddWithValue("@HeureFin", jour == 5 ? new TimeSpan(12, 30, 0) : new TimeSpan(16, 30, 0));
                            insertCommand.Parameters.AddWithValue("@Role", "Administrateur");
                            insertCommand.Parameters.AddWithValue("@PersonnelId", adminId);

                            insertCommand.ExecuteNonQuery();
                        }
                    }
                }
            }
        }



        // Lire tous les enregistrements de Personnel
        [HttpGet]
        public IActionResult GetAllPersonnel()
        {
            var personnelList = new List<Personnel>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sql = "SELECT id, nom, prenom, email, role FROM Personnes WHERE Discriminator = 'Personnel'";
                    using (var command = new SqlCommand(sql, connection))
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var personnel = new Personnel
                            {
                                id = reader.GetInt32(0),
                                nom = reader.GetString(1),
                                prenom = reader.GetString(2),
                                email = reader.GetString(3),
                                role = reader.IsDBNull(4) ? null : reader.GetString(4)
                            };
                            personnelList.Add(personnel);
                        }
                    }
                }
                return Ok(personnelList);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { erreur = "Une erreur est survenue lors de la récupération des données de personnel." });
            }
        }

        // Lire un Personnel par ID
        [HttpGet("{id}")]
        public IActionResult GetPersonnelById(int id)
        {
            try
            {
                Personnel personnel = null;
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sql = "SELECT id, nom, prenom, email, role FROM Personnes WHERE id = @Id AND Discriminator = 'Personnel'";
                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@Id", id);
                        using (var reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                personnel = new Personnel
                                {
                                    id = reader.GetInt32(0),
                                    nom = reader.GetString(1),
                                    prenom = reader.GetString(2),
                                    email = reader.GetString(3),
                                    role = reader.IsDBNull(4) ? null : reader.GetString(4)
                                };
                            }
                        }
                    }
                }

                if (personnel == null)
                {
                    return NotFound("Personnel non trouvé.");
                }

                return Ok(personnel);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { erreur = "Une erreur est survenue lors de la récupération du personnel.", details = ex.Message });
            }
        }


        // Mettre à jour un Personnel
        [HttpPut("{id}")]
        public IActionResult UpdatePersonnel(int id, Personnel personnel)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sql = "UPDATE Personnes SET nom = @Nom, prenom = @Prenom, email = @Email, role = @Role " +
                                 "WHERE id = @Id AND Discriminator = 'Personnel'";
                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@Id", id);
                        command.Parameters.AddWithValue("@Nom", personnel.nom);
                        command.Parameters.AddWithValue("@Prenom", personnel.prenom);
                        command.Parameters.AddWithValue("@Email", personnel.email);
                        command.Parameters.AddWithValue("@Role", personnel.role);

                        int rowsAffected = command.ExecuteNonQuery();
                        if (rowsAffected == 0)
                        {
                            return NotFound("Personnel non trouvé ou non mis à jour.");
                        }
                    }
                }
                return Ok("Personnel mis à jour avec succès.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { erreur = "Une erreur est survenue lors de la mise à jour du personnel." });
            }
        }

        // Supprimer un Personnel
        [HttpDelete("{id}")]
        public IActionResult DeletePersonnel(int id)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sql = "DELETE FROM Personnes WHERE id = @Id AND Discriminator = 'Personnel'";
                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@Id", id);

                        int rowsAffected = command.ExecuteNonQuery();
                        if (rowsAffected == 0)
                        {
                            return NotFound("Personnel non trouvé ou déjà supprimé.");
                        }
                    }
                }
                return Ok("Personnel supprimé avec succès.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { erreur = "Une erreur est survenue lors de la suppression du personnel." });
            }
        }
    }
}
