using Gestion_Parking.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;

namespace Gestion_Parking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlaceParkingController : ControllerBase
    {
        private readonly string connectionString;

        public PlaceParkingController(IConfiguration configuration)
        {
            connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";
        }

        // Créer une Place de Parking
        [Authorize(Policy = "Admin")]
        [HttpPost]
        public IActionResult CreatePlaceParking([FromBody] PlaceParking placeParking)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    string sqlInsert = "INSERT INTO PlaceParkings (numero, etat) " +
                                       "VALUES (@Numero, @Etat)";
                    using (var commandInsert = new SqlCommand(sqlInsert, connection))
                    {
                        commandInsert.Parameters.AddWithValue("@Numero", placeParking.numero);
                        commandInsert.Parameters.AddWithValue("@Etat", placeParking.etat);
                        commandInsert.ExecuteNonQuery();
                    }

                    return Ok("Place de parking créée avec succès.");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { erreur = ex.Message });
            }
        }

        // Lire toutes les Places de Parking
        [AllowAnonymous]
        [HttpGet]
        public IActionResult GetAllPlaceParkings()
        {
            var placeParkingList = new List<PlaceParking>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    Console.WriteLine("Connexion à la base de données réussie."); // Log
                    string sql = "SELECT id, numero, etat FROM PlaceParkings";
                    using (var command = new SqlCommand(sql, connection))
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var placeParking = new PlaceParking
                            {
                                id = reader.GetInt32(0),
                                numero = reader.GetInt32(1),
                                etat = reader.GetString(2)
                            };
                            placeParkingList.Add(placeParking);
                        }
                    }
                }
                return Ok(placeParkingList);
            }
            catch (SqlException sqlEx)
            {
                Console.WriteLine($"Erreur SQL : {sqlEx.Message}");
                return StatusCode(500, new { erreur = "Une erreur SQL est survenue lors de la récupération des places de parking." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erreur générale : {ex.Message}");
                return StatusCode(500, new { erreur = "Une erreur est survenue lors de la récupération des places de parking." });
            }
        }


        // Lire une Place de Parking par son ID
        [Authorize(Policy = "EtudiantOuAdmin")]
        [HttpGet("{id}")]
        public IActionResult GetPlaceParkingById(int id)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sql = "SELECT id, numero, etat FROM PlaceParkings WHERE id = @Id";
                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@Id", id);
                        using (var reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                var placeParking = new PlaceParking
                                {
                                    id = reader.GetInt32(0),
                                    numero = reader.GetInt32(1),
                                    etat = reader.GetString(2)
                                };
                                return Ok(placeParking);
                            }
                            else
                            {
                                return NotFound("Place de parking non trouvée.");
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { erreur = "Une erreur est survenue lors de la récupération de la place de parking." });
            }
        }

        // Mettre à jour une Place de Parking
        [Authorize(Policy = "Admin")]
        [HttpPut("{id}")]
        public IActionResult UpdatePlaceParking(int id, [FromBody] PlaceParking placeParking)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sql = "UPDATE PlaceParkings SET numero = @Numero, etat = @Etat " +
                                 "WHERE id = @Id";
                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@Id", id);
                        command.Parameters.AddWithValue("@Numero", placeParking.numero);
                        command.Parameters.AddWithValue("@Etat", placeParking.etat);

                        int rowsAffected = command.ExecuteNonQuery();
                        if (rowsAffected == 0)
                        {
                            return NotFound("Place de parking non trouvée ou non mise à jour.");
                        }
                    }
                }
                return Ok("Place de parking mise à jour avec succès.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { erreur = "Une erreur est survenue lors de la mise à jour de la place de parking." });
            }
        }

        // Supprimer une Place de Parking
        [Authorize(Policy = "Admin")]
        [HttpDelete("{id}")]
        public IActionResult DeletePlaceParking(int id)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sql = "DELETE FROM PlaceParkings WHERE id = @Id";
                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@Id", id);

                        int rowsAffected = command.ExecuteNonQuery();
                        if (rowsAffected == 0)
                        {
                            return NotFound("Place de parking non trouvée ou déjà supprimée.");
                        }
                    }
                }
                return Ok("Place de parking supprimée avec succès.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { erreur = "Une erreur est survenue lors de la suppression de la place de parking." });
            }
        }
        [HttpGet("count")]
        public IActionResult GetPersonnesCount()
        {
            try
            {
                int count = 0;

                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sql = "SELECT COUNT(*) FROM PlaceParkings "; // Compter le nombre total de lignes

                    using (var command = new SqlCommand(sql, connection))
                    {
                        count = (int)command.ExecuteScalar(); // Retourne le nombre total de personnes
                    }
                }

                return Ok(new { count });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Une erreur s'est produite lors de la récupération du nombre de personnes.");
            }
        }
    }
}
