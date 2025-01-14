using Gestion_Parking.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;

namespace Gestion_Parking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlaceParkingController : ControllerBase
    {
        private readonly string _connectionString;
        private readonly AppDbContext _context;
        public PlaceParkingController(IConfiguration configuration, AppDbContext context)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";
            _context = context;
        }

      
        // Create a parking place
        [Authorize(Policy = "Admin")]
        [HttpPost]
        public IActionResult CreatePlaceParking([FromBody] PlaceParking placeParking)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                connection.Open();

                const string sqlInsert = @"INSERT INTO PlaceParkings (numero, etat, etage, dateFinReservation) 
                                   VALUES (@Numero, @Etat, @Etage, @DateFinReservation)";
                using var commandInsert = new SqlCommand(sqlInsert, connection);
                commandInsert.Parameters.AddWithValue("@Numero", placeParking.numero);
                commandInsert.Parameters.AddWithValue("@Etat", placeParking.etat);
                commandInsert.Parameters.AddWithValue("@Etage", placeParking.etage);
                commandInsert.Parameters.AddWithValue("@DateFinReservation",
                    placeParking.dateFinReservation.HasValue
                        ? placeParking.dateFinReservation.Value.Date
                        : DBNull.Value);

                commandInsert.ExecuteNonQuery();

                return Ok(new { message = "Place de parking créée avec succès." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { erreur = ex.Message });
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public IActionResult GetAllPlaceParkings()
        {
            var placeParkingList = new List<object>(); // Using dynamic object for enriched data
            try
            {
                using var connection = new SqlConnection(_connectionString);
                connection.Open();

                const string sql = @"
                           SELECT DISTINCT p.id, p.numero, p.etage, p.etat, p.dateFinReservation,
                       CASE 
                           WHEN p.dateFinReservation IS NULL THEN NULL 
                           ELSE pr.nom 
                       END AS nom,
                       CASE 
                           WHEN p.dateFinReservation IS NULL THEN NULL 
                           ELSE pr.prenom 
                       END AS prenom
                FROM PlaceParkings p
                LEFT JOIN Reservations r ON p.id = r.placeParking_id
                LEFT JOIN Personnes pr ON r.personne_id = pr.id
                WHERE r.etat != 'archive' OR r.etat IS NULL or p.etat = 'libre';";

                using var command = new SqlCommand(sql, connection);
                using var reader = command.ExecuteReader();

                while (reader.Read())
                {
                    var placeParking = new
                    {
                        id = reader.GetInt32(reader.GetOrdinal("id")),
                        numero = reader.GetInt32(reader.GetOrdinal("numero")),
                        etage = reader.GetInt32(reader.GetOrdinal("etage")),
                        etat = reader.GetString(reader.GetOrdinal("etat")),
                        dateFinReservation = reader.IsDBNull(reader.GetOrdinal("dateFinReservation"))
                            ? null
                            : reader.GetDateTime(reader.GetOrdinal("dateFinReservation")).ToString("yyyy-MM-dd"),
                        nom = reader.IsDBNull(reader.GetOrdinal("nom")) ? null : reader.GetString(reader.GetOrdinal("nom")),
                        prenom = reader.IsDBNull(reader.GetOrdinal("prenom")) ? null : reader.GetString(reader.GetOrdinal("prenom"))
                    };
                    placeParkingList.Add(placeParking);
                }

                return Ok(placeParkingList);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { erreur = "Une erreur est survenue lors de la récupération des places de parking.", details = ex.Message });
            }
        }



        [Authorize(Policy = "EtudiantOuAdmin")]
        [HttpGet("{id}")]
        public IActionResult GetPlaceParkingById(int id)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                connection.Open();

                const string sql = @"SELECT p.numero, p.etage, p.etat, p.dateFinReservation, pr.nom, pr.prenom
                             FROM PlaceParkings p
                             LEFT JOIN Reservations r ON p.id = r.placeParking_id
                             LEFT JOIN Personnes pr ON r.personne_id = pr.id
                             WHERE p.id = @Id";

                using var command = new SqlCommand(sql, connection);
                command.Parameters.AddWithValue("@Id", id);

                using var reader = command.ExecuteReader();
                if (reader.Read())
                {
                    var placeParking = new
                    {
                        numero = reader.GetInt32(reader.GetOrdinal("numero")),
                        etage = reader.GetInt32(reader.GetOrdinal("etage")),
                        etat = reader.GetString(reader.GetOrdinal("etat")),
                        dateFinReservation = reader.IsDBNull(reader.GetOrdinal("dateFinReservation"))
                            ? (DateOnly?)null
                            : DateOnly.FromDateTime(reader.GetDateTime(reader.GetOrdinal("dateFinReservation"))),
                        nom = reader.IsDBNull(reader.GetOrdinal("nom")) ? null : reader.GetString(reader.GetOrdinal("nom")),
                        prenom = reader.IsDBNull(reader.GetOrdinal("prenom")) ? null : reader.GetString(reader.GetOrdinal("prenom"))
                    };
                    return Ok(placeParking);
                }

                return NotFound(new { message = "Place de parking non trouvée." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { erreur = "Une erreur est survenue lors de la récupération de la place de parking.", details = ex.Message });
            }
        }

        //count Place Parking
        [Authorize(Policy = "EtudiantOuAdmin")]
        [HttpGet("count")]
        public IActionResult GetCountPlaceParking()
        {
            try
            {
                // Compte le nombre total de places de parking
                var totalPlaces = _context.PlaceParkings.Count();
                return Ok(new
                {
                    totalPlaces = totalPlaces
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    erreur = "Une erreur est survenue lors du comptage des places de parking.",
                    details = ex.Message
                });
            }
        }


        [Authorize(Policy = "Admin")]
        [HttpDelete("{id}")]
        public IActionResult DeletePlaceParking(int id)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                connection.Open();

                const string sql = "DELETE FROM PlaceParkings WHERE id = @Id";
                using var command = new SqlCommand(sql, connection);
                command.Parameters.AddWithValue("@Id", id);

                int rowsAffected = command.ExecuteNonQuery();
                if (rowsAffected == 0)
                {
                    return NotFound(new { message = "Place de parking non trouvée ou déjà supprimée." });
                }

                return Ok(new { message = "Place de parking supprimée avec succès." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { erreur = "Une erreur est survenue lors de la suppression de la place de parking.", details = ex.Message });
            }
        }

        [Authorize(Policy = "Admin")]
        [HttpPut("{id}")]
        public IActionResult UpdatePlaceParking(int id, [FromBody] PlaceParking placeParking)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                connection.Open();

                const string sql = @"UPDATE PlaceParkings 
                             SET numero = @Numero, etat = @Etat, etage = @Etage, dateFinReservation = @DateFinReservation 
                             WHERE id = @Id";
                using var command = new SqlCommand(sql, connection);
                command.Parameters.AddWithValue("@Id", id);
                command.Parameters.AddWithValue("@Numero", placeParking.numero);
                command.Parameters.AddWithValue("@Etat", placeParking.etat);
                command.Parameters.AddWithValue("@Etage", placeParking.etage);
                command.Parameters.AddWithValue("@DateFinReservation",
                    placeParking.dateFinReservation.HasValue
                        ? placeParking.dateFinReservation.Value.Date
                        : DBNull.Value);

                int rowsAffected = command.ExecuteNonQuery();
                if (rowsAffected == 0)
                {
                    return NotFound(new { message = "Place de parking non trouvée ou non mise à jour." });
                }

                return Ok(new { message = "Place de parking mise à jour avec succès." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { erreur = "Une erreur est survenue lors de la mise à jour de la place de parking.", details = ex.Message });
            }
        }

    }
}