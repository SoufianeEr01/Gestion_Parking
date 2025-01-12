using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Gestion_Parking.Models;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;

namespace Gestion_Parking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous] // Ajout de la politique pour sécuriser l'accès (à ajuster en fonction de vos besoins)
    public class PaiementsController : ControllerBase
    {
        private readonly string connectionString;

        public PaiementsController(IConfiguration configuration)
        {
            connectionString = configuration["ConnectionStrings:DefaultConnection"] ?? "";
        }

        // GET: api/Paiements
        [HttpGet]
        public IActionResult GetPaiements()
        {
            try
            {
                var paiements = new List<Paiement>();

                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string query = "SELECT id, mode_paiement, prix_paye, personne_id FROM Paiements";

                    using (var command = new SqlCommand(query, connection))
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            paiements.Add(new Paiement
                            {
                                id = reader.GetInt32(0),
                                mode_paiement = reader.GetString(1),
                                prix_paye = reader.GetFloat(2),
                                personne_id = reader.GetInt32(3)
                            });
                        }
                    }
                }

                return Ok(paiements);
            }
            catch (Exception ex)
            {
                // Loggez l'erreur pour le diagnostic
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

                using (var connection = new SqlConnection(connectionString))
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
                using (var connection = new SqlConnection(connectionString))
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
