using Gestion_Parking.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;

namespace Gestion_Parking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        private readonly string connectionString;

        public ContactController(IConfiguration configuration)
        {
            connectionString = configuration["ConnectionStrings:DefaultConnection"] ?? "";
        }

        // Ajouter un nouveau contact
        [HttpPost]
        public IActionResult CreateContact(Contact contact)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string query = "INSERT INTO Contacts (Nom, Email, Message, DateEnvoi) VALUES (@Nom, @Email, @Message, @DateEnvoi)";
                    using (var command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@Nom", contact.Nom);
                        command.Parameters.AddWithValue("@Email", contact.Email);
                        command.Parameters.AddWithValue("@Message", contact.Message);
                        command.Parameters.AddWithValue("@DateEnvoi", DateTime.Now);
                        command.ExecuteNonQuery();
                    }
                }
                return Ok("Contact ajouté avec succès.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { erreur = $"Une erreur est survenue : {ex.Message}" });
            }
        }

        // Récupérer tous les contacts
        [Authorize(Policy = "Admin")]
        [HttpGet]
        public IActionResult GetAllContacts()
        {
            var contacts = new List<Contact>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string query = "SELECT Id, Nom, Email, Message, DateEnvoi FROM Contacts";
                    using (var command = new SqlCommand(query, connection))
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            contacts.Add(new Contact
                            {
                                Id = reader.GetInt32(0),
                                Nom = reader.GetString(1),
                                Email = reader.GetString(2),
                                Message = reader.GetString(3),
                                DateEnvoi = reader.GetDateTime(4)
                            });
                        }
                    }
                }
                return Ok(contacts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { erreur = $"Une erreur est survenue : {ex.Message}" });
            }
        }

        // Récupérer un contact par ID
        [Authorize(Policy = "Admin")]
        [HttpGet("{id}")]
        public IActionResult GetContactById(int id)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string query = "SELECT Id, Nom, Email, Message, DateEnvoi FROM Contacts WHERE Id = @Id";
                    using (var command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@Id", id);
                        using (var reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                var contact = new Contact
                                {
                                    Id = reader.GetInt32(0),
                                    Nom = reader.GetString(1),
                                    Email = reader.GetString(2),
                                    Message = reader.GetString(3),
                                    DateEnvoi = reader.GetDateTime(4)
                                };
                                return Ok(contact);
                            }
                            return NotFound("Contact non trouvé.");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { erreur = $"Une erreur est survenue : {ex.Message}" });
            }
        }

        // Mettre à jour un contact
        [Authorize(Policy = "Admin")]
        [HttpPut("{id}")]
        public IActionResult UpdateContact(int id, Contact contact)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string query = "UPDATE Contacts SET Nom = @Nom, Email = @Email, Message = @Message WHERE Id = @Id";
                    using (var command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@Id", id);
                        command.Parameters.AddWithValue("@Nom", contact.Nom);
                        command.Parameters.AddWithValue("@Email", contact.Email);
                        command.Parameters.AddWithValue("@Message", contact.Message);

                        int rowsAffected = command.ExecuteNonQuery();
                        if (rowsAffected == 0)
                        {
                            return NotFound("Contact non trouvé ou non mis à jour.");
                        }
                    }
                }
                return Ok("Contact mis à jour avec succès.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { erreur = $"Une erreur est survenue : {ex.Message}" });
            }
        }

        // Supprimer un contact
        [Authorize(Policy = "Admin")]
        [HttpDelete("{id}")]
        public IActionResult DeleteContact(int id)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string query = "DELETE FROM Contacts WHERE Id = @Id";
                    using (var command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@Id", id);

                        int rowsAffected = command.ExecuteNonQuery();
                        if (rowsAffected == 0)
                        {
                            return NotFound("Contact non trouvé ou déjà supprimé.");
                        }
                    }
                }
                return Ok("Contact supprimé avec succès.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { erreur = $"Une erreur est survenue : {ex.Message}" });
            }
        }
    }
}
