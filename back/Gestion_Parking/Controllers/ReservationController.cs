using Gestion_Parking.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging; // Ajout de l'importation pour ILogger
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
        private readonly ILogger<ReservationController> _logger; // Déclaration du logger

        public ReservationController(IConfiguration configuration, ILogger<ReservationController> logger)
        {
            connectionString = configuration["ConnectionStrings:DefaultConnection"] ?? "";
            _logger = logger; // Injection du logger
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
                _logger.LogInformation($"Réservation créée avec succès pour la personne {reservation.personne_id} à {reservation.lieu}.");
                return Ok("Réservation créée avec succès.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la création de la réservation.");
                return BadRequest(new { erreur = ex.Message });
            }
        }

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
                _logger.LogInformation("Récupération de toutes les réservations réussie.");
                return Ok(reservations);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la récupération des réservations.");
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
                                _logger.LogInformation($"Réservation trouvée avec ID {id}.");
                                return Ok(reservation);
                            }
                            else
                            {
                                _logger.LogWarning($"Réservation avec ID {id} non trouvée.");
                                return NotFound("Réservation non trouvée.");
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la récupération de la réservation.");
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
                            _logger.LogWarning($"Aucune réservation trouvée pour mettre à jour avec l'ID {id}.");
                            return NotFound("Réservation non trouvée ou non mise à jour.");
                        }
                    }
                }
                _logger.LogInformation($"Réservation avec ID {id} mise à jour avec succès.");
                return Ok("Réservation mise à jour avec succès.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la mise à jour de la réservation.");
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
                            _logger.LogWarning($"Réservation avec ID {id} non trouvée pour suppression.");
                            return NotFound("Réservation non trouvée ou déjà supprimée.");
                        }
                    }
                }
                _logger.LogInformation($"Réservation avec ID {id} supprimée avec succès.");
                return Ok("Réservation supprimée avec succès.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la suppression de la réservation.");
                return StatusCode(500, new { erreur = ex.Message });
            }
        }


        [AllowAnonymous]
        [HttpPost("ReservationHebdomadaire/Previsualiser/{groupeId}/{placeParkingId}")]
        public IActionResult PrevisualiserReservationHebdomadaire(int groupeId, int placeParkingId, [FromBody] Reservation reservationRequest)
        {
            var emplois = new List<Emploi>();

            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    // Récupérer les emplois pour le groupe spécifié
                    string sql = "SELECT Id, Jour, DateDebut, DateFin, Groupe_Id FROM Emplois WHERE Groupe_Id = @Groupe_Id";
                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@Groupe_Id", groupeId);

                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                emplois.Add(new Emploi
                                {
                                    Id = reader.GetInt32(0),
                                    Jour = Enum.Parse<Jour>(reader.GetString(1)),
                                    DateDebut = reader.GetTimeSpan(2),
                                    DateFin = reader.GetTimeSpan(3),
                                    Groupe_Id = reader.GetInt32(4)
                                });
                            }
                        }
                    }
                }

                if (emplois.Count == 0)
                {
                    return NotFound($"Aucun emploi trouvé pour le groupe avec l'ID {groupeId}.");
                }

                // Calcul de la date de début : le prochain lundi
                DateOnly dateDebutSemaine = DateOnly.FromDateTime(DateTime.Now.Date);
                while (dateDebutSemaine.DayOfWeek != DayOfWeek.Monday)
                {
                    dateDebutSemaine = dateDebutSemaine.AddDays(1);
                }

                var reservations = new List<Reservation>();

                // Créer une réservation pour chaque emploi
                foreach (var emploi in emplois)
                {
                    // Décalage entre le lundi et le jour de l'emploi
                    int jourOffset = (int)emploi.Jour;
                    DateOnly dateReservation = dateDebutSemaine.AddDays(jourOffset);

                    var reservation = new Reservation
                    {
                        date = dateReservation,
                        heureDebut = TimeOnly.FromTimeSpan(emploi.DateDebut),
                        heureFin = TimeOnly.FromTimeSpan(emploi.DateFin),
                        lieu = reservationRequest.lieu,
                        personne_id = reservationRequest.personne_id,
                        placeParking_id = placeParkingId
                    };

                    reservations.Add(reservation);
                }

                // Retourne les réservations triées
                reservations = reservations.OrderBy(r => r.date).ToList();
                return Ok(new { message = "Prévisualisation des réservations hebdomadaires réussie.", reservations });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la prévisualisation des réservations hebdomadaires.");
                return StatusCode(500, "Une erreur est survenue. " + ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpPost("ReservationHebdomadaire/Confirmer")]
        public IActionResult ConfirmerReservationHebdomadaire([FromBody] List<Reservation> reservations)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    foreach (var reservation in reservations)
                    {
                        // Insérer la réservation dans la table Reservations avec l'état
                        string insertSql = "INSERT INTO Reservations (date, heureDebut, heureFin, lieu, personne_id, placeParking_id, etat) " +
                                           "VALUES (@Date, @HeureDebut, @HeureFin, @Lieu, @PersonneId, @PlaceParkingId, @Etat)";
                        using (var command = new SqlCommand(insertSql, connection))
                        {
                            command.Parameters.AddWithValue("@Date", reservation.date.ToDateTime(TimeOnly.MinValue));
                            command.Parameters.AddWithValue("@HeureDebut", reservation.heureDebut);
                            command.Parameters.AddWithValue("@HeureFin", reservation.heureFin);
                            command.Parameters.AddWithValue("@Lieu", reservation.lieu);
                            command.Parameters.AddWithValue("@PersonneId", reservation.personne_id);
                            command.Parameters.AddWithValue("@PlaceParkingId", reservation.placeParking_id);
                            command.Parameters.AddWithValue("@Etat", "actif"); // Ajouter l'état par défaut

                            command.ExecuteNonQuery();
                        }

                        // Calculer la date de fin de réservation
                        DateTime dateFinReservation = reservation.date.ToDateTime(reservation.heureFin);

                        // Mettre à jour l'état de la place de parking à "occupe" et ajouter la date de fin de réservation
                        string updateSql = "UPDATE PlaceParkings SET etat = 'occupe', dateFinReservation = @DateFinReservation WHERE id = @PlaceParkingId";
                        using (var command = new SqlCommand(updateSql, connection))
                        {
                            command.Parameters.AddWithValue("@PlaceParkingId", reservation.placeParking_id);
                            command.Parameters.AddWithValue("@DateFinReservation", dateFinReservation);

                            command.ExecuteNonQuery();
                        }
                    }
                }

                return Ok(new { message = "Réservations hebdomadaires confirmées et insérées avec succès, et état des places mis à jour." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la confirmation des réservations hebdomadaires.");
                return StatusCode(500, "Une erreur est survenue. " + ex.Message);
            }
        }





        [AllowAnonymous]
        [HttpPost("ReservationMensuelle/Previsualiser/{groupeId}/{placeParkingId}")]
        public IActionResult PrevisualiserReservationMensuelle(int groupeId, int placeParkingId, [FromBody] Reservation reservationRequest)
        {
            var emplois = new List<Emploi>();

            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    // Récupérer les emplois pour le groupe spécifié
                    string sql = "SELECT Id, Jour, DateDebut, DateFin, Groupe_Id FROM Emplois WHERE Groupe_Id = @Groupe_Id";
                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@Groupe_Id", groupeId);

                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                var jour = Enum.Parse<Jour>(reader.GetString(1));
                                if (jour == Jour.Dimanche)
                                {
                                    _logger.LogWarning($"Un emploi avec le jour {jour} a été ignoré.");
                                    continue;
                                }

                                emplois.Add(new Emploi
                                {
                                    Id = reader.GetInt32(0),
                                    Jour = jour,
                                    DateDebut = reader.GetTimeSpan(2),
                                    DateFin = reader.GetTimeSpan(3),
                                    Groupe_Id = reader.GetInt32(4)
                                });
                            }
                        }
                    }
                }

                if (emplois.Count == 0)
                {
                    return NotFound($"Aucun emploi trouvé pour le groupe avec l'ID {groupeId}.");
                }

                // Calcul de la date de début (lendemain de la requête)
                DateOnly dateDebut = DateOnly.FromDateTime(DateTime.Now.Date).AddDays(1);
                DateOnly dateFin = dateDebut.AddMonths(1); // Fin de la période mensuelle

                var reservations = new List<Reservation>();

                // Créer des réservations pour chaque emploi, sur une période mensuelle
                foreach (var emploi in emplois)
                {
                    DateOnly currentDate = dateDebut;

                    while (currentDate < dateFin)
                    {
                        int jourOffset = ((int)emploi.Jour + 1) % 7;
                        if ((int)currentDate.DayOfWeek == jourOffset)
                        {
                            var reservation = new Reservation
                            {
                                date = currentDate,
                                heureDebut = TimeOnly.FromTimeSpan(emploi.DateDebut),
                                heureFin = TimeOnly.FromTimeSpan(emploi.DateFin),
                                lieu = reservationRequest.lieu,
                                personne_id = reservationRequest.personne_id,
                                placeParking_id = placeParkingId
                            };

                            reservations.Add(reservation);
                        }

                        currentDate = currentDate.AddDays(1); // Avancer au jour suivant
                    }
                }
                reservations = reservations.OrderBy(r => r.date).ToList();

                return Ok(new { message = "Prévisualisation des réservations mensuelles réussie.", reservations });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la prévisualisation des réservations mensuelles.");
                return StatusCode(500, "Une erreur est survenue.");
            }
        }

        [AllowAnonymous]
        [HttpPost("ReservationMensuelle/Confirmer")]
        public IActionResult ConfirmerReservationMensuelle([FromBody] List<Reservation> reservations)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    foreach (var reservation in reservations)
                    {
                        string insertSql = "INSERT INTO Reservations (date, heureDebut, heureFin, lieu, personne_id, placeParking_id, etat) " +
                                           "VALUES (@Date, @HeureDebut, @HeureFin, @Lieu, @PersonneId, @PlaceParkingId, @Etat)";
                        using (var command = new SqlCommand(insertSql, connection))
                        {
                            command.Parameters.AddWithValue("@Date", reservation.date.ToDateTime(TimeOnly.MinValue));
                            command.Parameters.AddWithValue("@HeureDebut", reservation.heureDebut);
                            command.Parameters.AddWithValue("@HeureFin", reservation.heureFin);
                            command.Parameters.AddWithValue("@Lieu", reservation.lieu);
                            command.Parameters.AddWithValue("@PersonneId", reservation.personne_id);
                            command.Parameters.AddWithValue("@PlaceParkingId", reservation.placeParking_id);
                            command.Parameters.AddWithValue("@Etat", "actif"); // Ajouter l'état par défaut

                            command.ExecuteNonQuery();
                        }
                        // Calculer la date de fin de réservation
                        DateTime dateFinReservation = reservation.date.ToDateTime(reservation.heureFin);

                        // Mettre à jour l'état de la place de parking à "occupee" et ajouter la date de fin de réservation
                        string updateSql = "UPDATE PlaceParkings SET etat = 'occupe', dateFinReservation = @DateFinReservation WHERE id = @PlaceParkingId";
                        using (var command = new SqlCommand(updateSql, connection))
                        {
                            command.Parameters.AddWithValue("@PlaceParkingId", reservation.placeParking_id);
                            command.Parameters.AddWithValue("@DateFinReservation", dateFinReservation);

                            command.ExecuteNonQuery();
                        }
                    }
                }

                return Ok(new { message = "Réservations confirmées et insérées avec succès." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la confirmation des réservations mensuelles.");
                return StatusCode(500, "Une erreur est survenue.");
            }
        }


        [AllowAnonymous]
        [HttpPost("ReservationSemestrielle/Previsualiser/{groupeId}/{placeParkingId}")]
        public IActionResult PrevisualiserReservationSemestrielle(int groupeId, int placeParkingId, [FromBody] Reservation reservationRequest)
        {
            var emplois = new List<Emploi>();

            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    // Récupérer les emplois pour le groupe spécifié
                    string sql = "SELECT Id, Jour, DateDebut, DateFin, Groupe_Id FROM Emplois WHERE Groupe_Id = @Groupe_Id";
                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@Groupe_Id", groupeId);

                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                var jour = Enum.Parse<Jour>(reader.GetString(1));
                                if (jour == Jour.Dimanche)
                                {
                                    _logger.LogWarning($"Un emploi avec le jour {jour} a été ignoré.");
                                    continue;
                                }

                                emplois.Add(new Emploi
                                {
                                    Id = reader.GetInt32(0),
                                    Jour = jour,
                                    DateDebut = reader.GetTimeSpan(2),
                                    DateFin = reader.GetTimeSpan(3),
                                    Groupe_Id = reader.GetInt32(4)
                                });
                            }
                        }
                    }
                }

                if (emplois.Count == 0)
                {
                    return NotFound($"Aucun emploi trouvé pour le groupe avec l'ID {groupeId}.");
                }

                // Calcul de la date de début et de la fin
                DateOnly dateDebut = DateOnly.FromDateTime(DateTime.Now.Date).AddDays(1); // Demain
                DateOnly dateFin = DateOnly.FromDateTime(new DateTime(2025, 1, 26)); // 26 janvier 2025

                var reservations = new List<Reservation>();

                // Créer des réservations pour chaque emploi, sur la période semestrielle
                foreach (var emploi in emplois)
                {
                    DateOnly currentDate = dateDebut;

                    while (currentDate <= dateFin)
                    {
                        // Calcul du décalage entre les jours (ajustement pour correspondre à DayOfWeek)
                        int jourOffset = ((int)emploi.Jour + 1) % 7; // Ajuster l'indice pour correspondre à DayOfWeek
                        if ((int)currentDate.DayOfWeek == jourOffset)
                        {
                            var reservation = new Reservation
                            {
                                date = currentDate,
                                heureDebut = TimeOnly.FromTimeSpan(emploi.DateDebut),
                                heureFin = TimeOnly.FromTimeSpan(emploi.DateFin),
                                lieu = reservationRequest.lieu,
                                personne_id = reservationRequest.personne_id,
                                placeParking_id = placeParkingId
                            };

                            reservations.Add(reservation);
                        }

                        currentDate = currentDate.AddDays(1); // Avancer au jour suivant
                    }
                }
                reservations = reservations.OrderBy(r => r.date).ToList();
                // Retourner les réservations calculées
                return Ok(new { message = "Prévisualisation des réservations semestrielles réussie.", reservations });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la prévisualisation des réservations semestrielles.");
                return StatusCode(500, "Une erreur est survenue. " + ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpPost("ReservationSemestrielle/Confirmer")]
        public IActionResult ConfirmerReservationSemestrielle([FromBody] List<Reservation> reservations)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    foreach (var reservation in reservations)
                    {
                        string insertSql = "INSERT INTO Reservations (date, heureDebut, heureFin, lieu, personne_id, placeParking_id, etat) " +
                                           "VALUES (@Date, @HeureDebut, @HeureFin, @Lieu, @PersonneId, @PlaceParkingId, @Etat)";
                        using (var command = new SqlCommand(insertSql, connection))
                        {
                            command.Parameters.AddWithValue("@Date", reservation.date.ToDateTime(TimeOnly.MinValue));
                            command.Parameters.AddWithValue("@HeureDebut", reservation.heureDebut);
                            command.Parameters.AddWithValue("@HeureFin", reservation.heureFin);
                            command.Parameters.AddWithValue("@Lieu", reservation.lieu);
                            command.Parameters.AddWithValue("@PersonneId", reservation.personne_id);
                            command.Parameters.AddWithValue("@PlaceParkingId", reservation.placeParking_id);
                            command.Parameters.AddWithValue("@Etat", "actif"); // Ajouter l'état par défaut

                            command.ExecuteNonQuery();
                        }
                        // Calculer la date de fin de réservation
                        DateTime dateFinReservation = reservation.date.ToDateTime(reservation.heureFin);

                        // Mettre à jour l'état de la place de parking à "occupee" et ajouter la date de fin de réservation
                        string updateSql = "UPDATE PlaceParkings SET etat = 'occupe', dateFinReservation = @DateFinReservation WHERE id = @PlaceParkingId";
                        using (var command = new SqlCommand(updateSql, connection))
                        {
                            command.Parameters.AddWithValue("@PlaceParkingId", reservation.placeParking_id);
                            command.Parameters.AddWithValue("@DateFinReservation", dateFinReservation);

                            command.ExecuteNonQuery();
                        }
                    }
                }

                return Ok(new { message = "Réservations semestrielles confirmées et insérées avec succès." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la confirmation des réservations semestrielles.");
                return StatusCode(500, "Une erreur est survenue. " + ex.Message);
            }
        }


        [AllowAnonymous]
        [HttpPost("ReservationHebdomadaireP/Previsualiser/{personnelId}/{placeParkingId}")]
        public IActionResult PrevisualiserReservationHebdomadaireP(int personnelId, int placeParkingId, [FromBody] Reservation reservationRequest)
        {
            var emploisP = new List<EmploiPersonnel>();

            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    // Récupérer les emplois pour le groupe spécifié
                    string sql = "SELECT Id, Jour, HeureDebut, HeureFin, PersonnelId FROM EmploiPersonnels WHERE personnelId = @personnelId";
                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@personnelId", personnelId);

                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                emploisP.Add(new EmploiPersonnel
                                {
                                    Id = reader.GetInt32(0),
                                    Jour = Enum.Parse<Jour>(reader.GetString(1)),
                                    HeureDebut = reader.GetTimeSpan(2),
                                    HeureFin = reader.GetTimeSpan(3),
                                    PersonnelId = reader.GetInt32(4)
                                });
                            }
                        }
                    }
                }

                if (emploisP.Count == 0)
                {
                    return NotFound($"Aucun emploi trouvé pour le personnel avec l'ID {personnelId}.");
                }

                // Calcul de la date de début : le prochain lundi
                DateOnly dateDebutSemaine = DateOnly.FromDateTime(DateTime.Now.Date);
                while (dateDebutSemaine.DayOfWeek != DayOfWeek.Monday)
                {
                    dateDebutSemaine = dateDebutSemaine.AddDays(1);
                }

                var reservations = new List<Reservation>();

                // Créer une réservation pour chaque emploi
                foreach (var emploi in emploisP)
                {
                    // Décalage entre le lundi et le jour de l'emploi
                    int jourOffset = (int)emploi.Jour;
                    DateOnly dateReservation = dateDebutSemaine.AddDays(jourOffset);

                    var reservation = new Reservation
                    {
                        date = dateReservation,
                        heureDebut = TimeOnly.FromTimeSpan(emploi.HeureDebut),
                        heureFin = TimeOnly.FromTimeSpan(emploi.HeureFin),
                        lieu = reservationRequest.lieu,
                        personne_id = reservationRequest.personne_id,
                        placeParking_id = placeParkingId
                    };

                    reservations.Add(reservation);
                }

                // Retourne les réservations triées
                reservations = reservations.OrderBy(r => r.date).ToList();
                return Ok(new { message = "Prévisualisation des réservations hebdomadaires réussie.", reservations });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la prévisualisation des réservations hebdomadaires.");
                return StatusCode(500, "Une erreur est survenue. " + ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpPost("ReservationMensuelleP/Previsualiser/{personnelId}/{placeParkingId}")]
        public IActionResult PrevisualiserReservationMensuelleP(int personnelId, int placeParkingId, [FromBody] Reservation reservationRequest)
        {
            var emploisP = new List<EmploiPersonnel>();

            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    // Récupérer les emplois pour le personnel spécifié
                    string sql = "SELECT Id, Jour, HeureDebut, HeureFin, PersonnelId FROM EmploiPersonnels WHERE PersonnelId = @PersonnelId";
                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@PersonnelId", personnelId);

                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                var jour = Enum.Parse<Jour>(reader.GetString(1));
                                if (jour == Jour.Dimanche)
                                {
                                    _logger.LogWarning($"Un emploi avec le jour {jour} a été ignoré.");
                                    continue;
                                }

                                emploisP.Add(new EmploiPersonnel
                                {
                                    Id = reader.GetInt32(0),
                                    Jour = jour,
                                    HeureDebut = reader.GetTimeSpan(2),
                                    HeureFin = reader.GetTimeSpan(3),
                                    PersonnelId = reader.GetInt32(4)
                                });
                            }
                        }
                    }
                }

                if (emploisP.Count == 0)
                {
                    return NotFound($"Aucun emploi trouvé pour le personnel avec l'ID {personnelId}.");
                }

                // Calcul de la date de début (lendemain de la requête)
                DateOnly dateDebut = DateOnly.FromDateTime(DateTime.Now.Date).AddDays(1);
                DateOnly dateFin = dateDebut.AddMonths(1); // Fin de la période mensuelle

                var reservations = new List<Reservation>();

                // Créer des réservations pour chaque emploi, sur une période mensuelle
                foreach (var emploi in emploisP)
                {
                    DateOnly currentDate = dateDebut;

                    while (currentDate < dateFin)
                    {
                        int jourOffset = ((int)emploi.Jour + 1) % 7;
                        if ((int)currentDate.DayOfWeek == jourOffset)
                        {
                            var reservation = new Reservation
                            {
                                date = currentDate,
                                heureDebut = TimeOnly.FromTimeSpan(emploi.HeureDebut),
                                heureFin = TimeOnly.FromTimeSpan(emploi.HeureFin),
                                lieu = reservationRequest.lieu,
                                personne_id = reservationRequest.personne_id,
                                placeParking_id = placeParkingId
                            };

                            reservations.Add(reservation);
                        }

                        currentDate = currentDate.AddDays(1); // Avancer au jour suivant
                    }
                }
                reservations = reservations.OrderBy(r => r.date).ToList();

                return Ok(new { message = "Prévisualisation des réservations mensuelles réussie.", reservations });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la prévisualisation des réservations mensuelles.");
                return StatusCode(500, "Une erreur est survenue.");
            }
        }

        [AllowAnonymous]
        [HttpPost("ReservationSemestrielleP/Previsualiser/{personnelId}/{placeParkingId}")]
        public IActionResult PrevisualiserReservationSemestrielleP(int personnelId, int placeParkingId, [FromBody] Reservation reservationRequest)
        {
            var emploisP = new List<EmploiPersonnel>();

            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    // Récupérer les emplois pour le personnel spécifié
                    string sql = "SELECT Id, Jour, HeureDebut, HeureFin, PersonnelId FROM EmploiPersonnels WHERE PersonnelId = @PersonnelId";
                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@PersonnelId", personnelId);

                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                var jour = Enum.Parse<Jour>(reader.GetString(1));
                                if (jour == Jour.Dimanche)
                                {
                                    _logger.LogWarning($"Un emploi avec le jour {jour} a été ignoré.");
                                    continue;
                                }

                                emploisP.Add(new EmploiPersonnel
                                {
                                    Id = reader.GetInt32(0),
                                    Jour = jour,
                                    HeureDebut = reader.GetTimeSpan(2),
                                    HeureFin = reader.GetTimeSpan(3),
                                    PersonnelId = reader.GetInt32(4)
                                });
                            }
                        }
                    }
                }

                if (emploisP.Count == 0)
                {
                    return NotFound($"Aucun emploi trouvé pour le personnel avec l'ID {personnelId}.");
                }

                // Calcul de la date de début et de la fin
                DateOnly dateDebut = DateOnly.FromDateTime(DateTime.Now.Date).AddDays(1); // Demain
                DateOnly dateFin = DateOnly.FromDateTime(new DateTime(2025, 1, 20)); // 20 janvier 2025

                var reservations = new List<Reservation>();

                // Créer des réservations pour chaque emploi, sur la période semestrielle
                foreach (var emploi in emploisP)
                {
                    DateOnly currentDate = dateDebut;

                    while (currentDate <= dateFin)
                    {
                        // Calcul du décalage entre les jours (ajustement pour correspondre à DayOfWeek)
                        int jourOffset = ((int)emploi.Jour + 1) % 7; // Ajuster l'indice pour correspondre à DayOfWeek
                        if ((int)currentDate.DayOfWeek == jourOffset)
                        {
                            var reservation = new Reservation
                            {
                                date = currentDate,
                                heureDebut = TimeOnly.FromTimeSpan(emploi.HeureDebut),
                                heureFin = TimeOnly.FromTimeSpan(emploi.HeureFin),
                                lieu = reservationRequest.lieu,
                                personne_id = reservationRequest.personne_id,
                                placeParking_id = placeParkingId
                            };

                            reservations.Add(reservation);
                        }

                        currentDate = currentDate.AddDays(1); // Avancer au jour suivant
                    }
                }

                reservations = reservations.OrderBy(r => r.date).ToList();
                // Retourner les réservations calculées
                return Ok(new { message = "Prévisualisation des réservations semestrielles réussie.", reservations });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la prévisualisation des réservations semestrielles.");
                return StatusCode(500, "Une erreur est survenue. " + ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpGet("ExistingReservationForPersonne/{personneId}")]
            public IActionResult ExistingReservationForPersonne(int personneId)
            {
                try
                {
                    bool reservationExists = false;

                    using (var connection = new SqlConnection(connectionString))
                    {
                        connection.Open();

                        // Requête pour vérifier l'existence d'une réservation
                        string query = "SELECT COUNT(*) FROM Reservations WHERE personne_id = @PersonneId and etat = 'actif'";

                        using (var command = new SqlCommand(query, connection))
                        {
                            command.Parameters.AddWithValue("@PersonneId", personneId);

                            // Exécution de la requête
                            int count = (int)command.ExecuteScalar();

                            reservationExists = count > 0; // Si le nombre de résultats est supérieur à 0, une réservation existe
                        }
                    }

                    return Ok(reservationExists);
                }
                catch (Exception ex)
                {
                    // Gestion des erreurs
                    return StatusCode(500, new { message = "Une erreur est survenue.", error = ex.Message });
                }
            }
        [HttpPost("ArchiverReservations")]
        public IActionResult ArchiverReservations()
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    // Requête pour mettre à jour l'état à 'archive' si la date actuelle est supérieure à la date de la réservation
                    string updateSql = "UPDATE Reservations SET etat = 'archive' WHERE date < @CurrentDate AND etat != 'archive'";

                    using (var command = new SqlCommand(updateSql, connection))
                    {
                        // Ajouter la date actuelle comme paramètre
                        command.Parameters.AddWithValue("@CurrentDate", DateTime.Now.Date); // Utilisez Date pour ne comparer que la date

                        int rowsAffected = command.ExecuteNonQuery(); // Exécuter la mise à jour

                        if (rowsAffected > 0)
                        {
                            return Ok(new { message = $"{rowsAffected} réservation(s) ont été archivées." });
                        }
                        else
                        {
                            return Ok(new { message = "Aucune réservation n'a été archivée." });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Gestion des erreurs
                return StatusCode(500, new { message = "Une erreur est survenue.", error = ex.Message });
            }
        }



    }
}
