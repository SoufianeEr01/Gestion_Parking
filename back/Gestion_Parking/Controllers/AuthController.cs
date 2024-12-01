using Gestion_Parking.Models;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly JwtHelper _jwtHelper;
    private readonly AppDbContext _context;

    public AuthController(JwtHelper jwtHelper, AppDbContext context)
    {
        _jwtHelper = jwtHelper;
        _context = context;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest model)
    {
        try
        {
            // Vérification de l'utilisateur via email
            var user = _context.Personnes.FirstOrDefault(u => u.email == model.Email);

            if (user == null)
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            // Validation du mot de passe
            bool isPasswordValid = Personne.VerifyPassword(model.MotDePasse, user.motdepasse);
            if (!isPasswordValid)
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            // Récupérer le rôle et le type d'utilisateur
            string role = null; // Rôle par défaut
            string discriminator = "Etudiant"; // Discriminant par défaut

            if (user is Personnel personnel)
            {
                role = personnel.role; // Exemple : "Admin" ou "Enseignant"
                discriminator = "Personnel";
            }
            if (user is Admin)
            {
                role = null; // Exemple : "Admin" ou "Enseignant"
                discriminator = "Admin";
            }


            // Générer un token JWT
            var token = _jwtHelper.GenerateToken(user.email, role, discriminator);

            // Retourner le token
            return Ok(new
            {
                token,
                role,
                Id = user.id,
                email = user.email,
                discriminator
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = $"An error occurred: {ex.Message}" });
        }
    }
}
