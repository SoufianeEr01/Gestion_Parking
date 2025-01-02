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
    public class ReponseController : ControllerBase
    {
        private readonly string connectionString;

        public ReponseController(IConfiguration configuration)
        {
            connectionString = configuration["ConnectionStrings:DefaultConnection"] ?? "";
        }

        // Ajouter une réponse à un message
        [Authorize(Policy = "Admin")]
        [HttpPost("add")]
        public IActionResult AddReponse([FromBody] Reponse reponse)
        {
            if (reponse == null || string.IsNullOrEmpty(reponse.MessageReponse) || reponse.ContactId == 0)
            {
                return BadRequest(new { erreur = "Le champ MessageReponse et ContactId sont requis." });
            }

            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string query = "INSERT INTO Reponses (ContactId, MessageReponse, DateReponse) VALUES (@ContactId, @MessageReponse, @DateReponse)";
                    using (var command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@ContactId", reponse.ContactId);
                        command.Parameters.AddWithValue("@MessageReponse", reponse.MessageReponse);
                        command.Parameters.AddWithValue("@DateReponse", DateTime.Now);

                        command.ExecuteNonQuery();
                    }
                }
                return Ok("Réponse ajoutée avec succès.");
            }
            catch (SqlException sqlEx)
            {
                return StatusCode(500, new { erreur = $"Erreur SQL : {sqlEx.Message}" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { erreur = $"Une erreur est survenue : {ex.Message}" });
            }
        }

        // Récupérer les réponses pour un message spécifique
        [AllowAnonymous]
        [HttpGet("{contactId}")]
        public IActionResult GetReponsesByContactId(int contactId)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    // Requête SQL avec une jointure entre Contacts et Reponses
                    string query = @"
                SELECT r.MessageReponse 
                FROM Reponses r
                JOIN Contacts c ON r.ContactId = c.Id
                WHERE r.ContactId = @ContactId";

                    using (var command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@ContactId", contactId);

                        using (var reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                var messageReponse = reader.GetString(0); // Obtient MessageReponse
                                return Ok(new { MessageReponse = messageReponse });
                            }
                            else
                            {
                                return NotFound(new { erreur = "Aucune réponse trouvée pour ce contact." });
                            }
                        }
                    }
                }
            }
            catch (SqlException sqlEx)
            {
                return StatusCode(500, new { erreur = $"Erreur SQL : {sqlEx.Message}" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { erreur = $"Une erreur est survenue : {ex.Message}" });
            }
        }


        // Supprimer une réponse par ID
        [Authorize(Policy = "Admin")]
        [HttpDelete("{id}")]
        public IActionResult DeleteReponse(int id)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string query = "DELETE FROM Reponses WHERE Id = @Id";
                    using (var command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@Id", id);

                        int rowsAffected = command.ExecuteNonQuery();
                        if (rowsAffected == 0)
                        {
                            return NotFound("Réponse non trouvée ou déjà supprimée.");
                        }
                    }
                }
                return Ok("Réponse supprimée avec succès.");
            }
            catch (SqlException sqlEx)
            {
                return StatusCode(500, new { erreur = $"Erreur SQL : {sqlEx.Message}" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { erreur = $"Une erreur est survenue : {ex.Message}" });
            }
        }
    }
}
