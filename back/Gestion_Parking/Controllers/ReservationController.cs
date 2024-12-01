using Gestion_Parking.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;

namespace Gestion_Parking.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ReservationController : ControllerBase
    {
        private readonly string connectionString;

        public ReservationController(IConfiguration configuration)
        {
            connectionString = configuration["ConnectionStrings:DefaultConnection"] ?? "";
        }

        // Créer une réservation
        [HttpPost]
        public IActionResult CreateReservation(Reservation reservation)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sql = "INSERT INTO Reservations (date, heureDebut, heureFin, lieu, personne_id, placeParking_id) " +
                                 "VALUES (@Date, @HeureDebut, @HeureFin, @Lieu, @PersonneId, @PlaceParkingId)";
                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@Date", reservation.date);
                        command.Parameters.AddWithValue("@HeureDebut", reservation.heureDebut);
                        command.Parameters.AddWithValue("@HeureFin", reservation.heureFin);
                        command.Parameters.AddWithValue("@Lieu", reservation.lieu);
                        command.Parameters.AddWithValue("@PersonneId", reservation.personne_id);
                        command.Parameters.AddWithValue("@PlaceParkingId", reservation.placeParking_id);

                        command.ExecuteNonQuery();
                    }
                }
                return Ok("Réservation créée avec succès.");
            }
            catch (Exception ex)
            {
                return BadRequest(new { erreur = ex.Message });
            }
        }

        // Lire toutes les réservations
        // Lire toutes les réservations
        [HttpGet]
        public IActionResult GetAllReservations()
        {
            var reservations = new List<Reservation>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sql = "SELECT id, date, heureDebut, heureFin, lieu, personne_id, placeParking_id FROM Reservations";
                    using (var command = new SqlCommand(sql, connection))
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var reservation = new Reservation
                            {
                                id = reader.GetInt32(0),
                                date = DateOnly.FromDateTime(reader.GetDateTime(1)), // Assuming `date` is DATETIME
                                heureDebut = TimeOnly.FromTimeSpan(reader.GetTimeSpan(2)), // Handle TIME as TimeSpan
                                heureFin = TimeOnly.FromTimeSpan(reader.GetTimeSpan(3)),   // Handle TIME as TimeSpan
                                lieu = reader.GetString(4),
                                personne_id = reader.GetInt32(5),
                                placeParking_id = reader.GetInt32(6)
                            };
                            reservations.Add(reservation);
                        }
                    }
                }
                return Ok(reservations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { erreur = ex.Message });
            }
        }

        // Lire une réservation par ID
        [HttpGet("{id}")]
        public IActionResult GetReservationById(int id)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sql = "SELECT id, date, heureDebut, heureFin, lieu, personne_id, placeParking_id FROM Reservations WHERE id = @Id";
                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@Id", id);
                        using (var reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                var reservation = new Reservation
                                {
                                    id = reader.GetInt32(0),
                                    date = DateOnly.FromDateTime(reader.GetDateTime(1)), // Assuming `date` is DATETIME
                                    heureDebut = TimeOnly.FromTimeSpan(reader.GetTimeSpan(2)), // Handle TIME as TimeSpan
                                    heureFin = TimeOnly.FromTimeSpan(reader.GetTimeSpan(3)),   // Handle TIME as TimeSpan
                                    lieu = reader.GetString(4),
                                    personne_id = reader.GetInt32(5),
                                    placeParking_id = reader.GetInt32(6)
                                };
                                return Ok(reservation);
                            }
                            else
                            {
                                return NotFound("Réservation non trouvée.");
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


        // Mettre à jour une réservation
        [HttpPut("{id}")]
        public IActionResult UpdateReservation(int id, Reservation reservation)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sql = "UPDATE Reservations SET date = @Date, heureDebut = @HeureDebut, heureFin = @HeureFin, lieu = @Lieu, " +
                                 "personne_id = @PersonneId, placeParking_id = @PlaceParkingId WHERE id = @Id";
                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@Id", id);
                        command.Parameters.AddWithValue("@Date", reservation.date);
                        command.Parameters.AddWithValue("@HeureDebut", reservation.heureDebut);
                        command.Parameters.AddWithValue("@HeureFin", reservation.heureFin);
                        command.Parameters.AddWithValue("@Lieu", reservation.lieu);
                        command.Parameters.AddWithValue("@PersonneId", reservation.personne_id);
                        command.Parameters.AddWithValue("@PlaceParkingId", reservation.placeParking_id);

                        int rowsAffected = command.ExecuteNonQuery();
                        if (rowsAffected == 0)
                        {
                            return NotFound("Réservation non trouvée ou non mise à jour.");
                        }
                    }
                }
                return Ok("Réservation mise à jour avec succès.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { erreur = ex.Message });
            }
        }

        // Supprimer une réservation
        [HttpDelete("{id}")]
        public IActionResult DeleteReservation(int id)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sql = "DELETE FROM Reservations WHERE id = @Id";
                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@Id", id);

                        int rowsAffected = command.ExecuteNonQuery();
                        if (rowsAffected == 0)
                        {
                            return NotFound("Réservation non trouvée ou déjà supprimée.");
                        }
                    }
                }
                return Ok("Réservation supprimée avec succès.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { erreur = ex.Message });
            }
        }
    }
}
