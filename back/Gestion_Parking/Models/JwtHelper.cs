using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

public class JwtHelper
{
    private readonly IConfiguration _configuration;

    public JwtHelper(IConfiguration configuration)
    {
        _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
    }

    public string GenerateToken(string email, string role, string discriminator)
    {
        // Récupérer la clé secrète et les paramètres JWT à partir de la configuration
        var secretKey = _configuration["Jwt:Key"];
        var issuer = _configuration["Jwt:Issuer"];
        var audience = _configuration["Jwt:Audience"];
        var expireDays = _configuration["Jwt:ExpireDays"];

        if (string.IsNullOrEmpty(secretKey))
        {
            throw new InvalidOperationException("La clé secrète JWT (Jwt:Key) n'est pas configurée.");
        }

        // Générer la clé de chiffrement
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        // Définir les revendications (claims)
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, email),
            new Claim("discriminator", discriminator)
        };

        if (!string.IsNullOrEmpty(discriminator))
        {
            claims.Add(new Claim("discriminator", discriminator)); // Ajout du champ discriminator uniquement
        }

        // Créer le token
        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddDays(int.Parse(expireDays ?? "7")), // Défaut : 7 jours si non configuré
            signingCredentials: credentials
        );

        // Retourner le token sous forme de chaîne
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
