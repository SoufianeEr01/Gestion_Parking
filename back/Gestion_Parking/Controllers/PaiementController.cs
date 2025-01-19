using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Gestion_Parking.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;

namespace Gestion_Parking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous] // Ajuster en fonction des besoins
    public class PaiementController : ControllerBase
    {
        private readonly string _connectionString;
        private readonly ILogger<PaiementController> _logger;

        public PaiementController(IConfiguration configuration, ILogger<PaiementController> logger)
        {
            // Vérifiez si la chaîne de connexion est valide
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? string.Empty;
            if (string.IsNullOrEmpty(_connectionString))
            {
                throw new ArgumentNullException(nameof(_connectionString), "La chaîne de connexion ne peut pas être nulle ou vide.");
            }

            _logger = logger;
        }

        // GET: api/Paiements
        [HttpGet]
        public IActionResult GetPaiements()
        {
            try
            {
                var paiements = new List<object>();

                using (var connection = new SqlConnection(_connectionString))
                {
                    connection.Open();
                    const string query = @"SELECT 
                                                pa.id AS PaiementID, 
                                                pa.mode_paiement, 
                                                pa.prix_paye, 
                                                pr.nom, 
                                                pr.prenom, 
                                                pr.id AS PersonneID,
                                                pr.email
                                            FROM paiements pa
                                            JOIN Personnes pr ON pa.personne_id = pr.id";

                    using (var command = new SqlCommand(query, connection))
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var paiement = new
                            {
                                PaiementID = reader.GetInt32(0),
                                ModePaiement = reader.GetString(1),
                                PrixPaye = reader.GetFloat(2),
                                NomPersonne = reader.GetString(3),
                                PrenomPersonne = reader.GetString(4),
                                PersonneID = reader.GetInt32(5),
                                Email = reader.GetString(6)
                            };

                            paiements.Add(paiement);
                        }
                    }
                }

                return Ok(paiements);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la récupération des paiements.");
                return StatusCode(500, "Une erreur s'est produite lors de la récupération des paiements.");
            }
        }

        // GET: api/Paiements/{id}
        [HttpGet("{id}")]
        public IActionResult GetPaiementById(int id)
        {
            try
            {
                Paiement paiement = null;

                using (var connection = new SqlConnection(_connectionString))
                {
                    connection.Open();
                    string query = "SELECT id, mode_paiement, prix_paye, personne_id FROM Paiements WHERE id = @Id";

                    using (var command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@Id", id);
                        using (var reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                paiement = new Paiement
                                {
                                    id = reader.GetInt32(0),
                                    mode_paiement = reader.GetString(1),
                                    prix_paye = reader.GetFloat(2),
                                    personne_id = reader.GetInt32(3)
                                };
                            }
                        }
                    }
                }

                if (paiement == null)
                {
                    return NotFound(new { message = "Paiement non trouvé." });
                }

                return Ok(paiement);
            }
            catch (Exception ex)
            {
                // Loggez l'erreur pour le diagnostic
                return StatusCode(500, "Une erreur s'est produite lors de la récupération du paiement.");
            }
        }

        // POST: api/Paiements
        [HttpPost]
        public IActionResult PostPaiement([FromBody] Paiement paiement)
        {
            if (paiement == null)
            {
                return BadRequest(new { message = "Les données du paiement sont invalides." });
            }

            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    connection.Open();
                    string insertQuery = "INSERT INTO Paiements (mode_paiement, prix_paye, personne_id) " +
                                         "VALUES (@ModePaiement, @PrixPaye, @PersonneId); " +
                                         "SELECT SCOPE_IDENTITY();"; // Récupérer l'ID du paiement inséré

                    using (var command = new SqlCommand(insertQuery, connection))
                    {
                        command.Parameters.AddWithValue("@ModePaiement", paiement.mode_paiement);
                        command.Parameters.AddWithValue("@PrixPaye", paiement.prix_paye);
                        command.Parameters.AddWithValue("@PersonneId", paiement.personne_id);

                        var result = command.ExecuteScalar();

                        if (result != null)
                        {
                            paiement.id = Convert.ToInt32(result);
                        }
                        else
                        {
                            return StatusCode(500, "Erreur lors de l'insertion du paiement.");
                        }
                    }
                }

                return CreatedAtAction(nameof(GetPaiementById), new { id = paiement.id }, paiement);
            }
            catch (Exception ex)
            {
                // Loggez l'erreur pour le diagnostic
                return StatusCode(500, "Une erreur s'est produite lors de l'ajout du paiement.");
            }
        }
    }
}
