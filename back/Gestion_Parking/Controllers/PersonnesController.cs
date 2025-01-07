using Gestion_Parking.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace Gestion_Parking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = "Admin")] 
    public class PersonnesController : ControllerBase
    {
        private readonly string connectionString;

        public PersonnesController(IConfiguration configuration)
        {
            connectionString = configuration["ConnectionStrings:DefaultConnection"] ?? "";
        }

        // Méthode pour récupérer toutes les personnes
        [HttpGet]
        public IActionResult GetPersonnes()
        {
            try
            {
                var personnes = new List<Personne>();

                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sql = "SELECT id, nom, prenom, email FROM Personnes"; // Pas de mots de passe ici

                    using (var command = new SqlCommand(sql, connection))
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            personnes.Add(new Personne
                            {
                                id = reader.GetInt32(0),
                                nom = reader.GetString(1),
                                prenom = reader.GetString(2),
                                email = reader.GetString(3),
                             
                            });
                        }
                    }
                }

                return Ok(personnes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Une erreur s'est produite lors de la récupération des données.");
            }
        }

        // Nouvelle méthode pour récupérer le nombre total de personnes
        [HttpGet("count")]
        public IActionResult GetPersonnesCount()
        {
            try
            {
                int count = 0;

                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sql = "SELECT COUNT(*) FROM Personnes"; // Compter le nombre total de lignes

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
