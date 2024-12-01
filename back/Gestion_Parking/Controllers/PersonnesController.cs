//using Gestion_Parking.Models;
//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.Data.SqlClient;

//namespace Gestion_Parking.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class PersonnesController : ControllerBase
//    {
//        private readonly string connectionString;
//        public PersonnesController(IConfiguration configuration)
//        {
//            connectionString = configuration["ConnectionStrings:DefaultConnection"] ?? "";

//        }
//        [HttpPost]
//        public IActionResult CreatePersonne(Personne P1)
//        {
//            try
//            {
//                using (var connection = new SqlConnection(connectionString))
//                {
//                    connection.Open();
//                    string sql = "INSERT INTO Personnes (nom, prenom, email, motdepasse, Discriminator, groupe_id, role) " +
//                    "VALUES (@Nom, @Prenom, @Email, @Motdepasse, @Discriminator, @groupe_id, @Role)";


//                    using (var command = new SqlCommand(sql, connection))
//                    {
//                        command.Parameters.AddWithValue("@Nom", P1.nom);
//                        command.Parameters.AddWithValue("@Prenom", P1.prenom);
//                        command.Parameters.AddWithValue("@Email", P1.email);
//                        command.Parameters.AddWithValue("@Motdepasse", P1.motdepasse);
//                        command.Parameters.AddWithValue("@Discriminator", GetDiscriminator(P1));
//                        command.Parameters.AddWithValue("@groupe_id", P1.groupe_id);
//                        command.Parameters.AddWithValue("@Role", P1.role);

//                        // Execute the command
//                        command.ExecuteNonQuery();
//                    }

//                }
//            }
//            catch (Exception ex)
//            {
//                ModelState.AddModelError("Personne", "Sorry ,but me we have an exception");
//                return BadRequest(ModelState);
//            }
//            return Ok();
//        }

//        private static object role(Personne P1)
//        {
//            return P1.role;
//        }

//        private string GetDiscriminator(Personne personne)
//        {
//            if (personne is Admin) return "Admin";
//            if (personne is Etudiant) return "Etudiant";
//            if (personne is Personnel) return "Personnel";

//            return "Personne";
//        }
//    }
//}
