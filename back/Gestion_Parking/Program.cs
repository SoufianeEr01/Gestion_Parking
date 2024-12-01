using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// *** Configuration de la chaîne de connexion ***
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Ajouter AppDbContext avec la configuration de la base de données
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

// Ajouter les contrôleurs avec vues
builder.Services.AddControllersWithViews();

// *** Configuration de l'autorisation (politiques pour Etudiant et Personnel) ***
builder.Services.AddAuthorization(options =>
{
    // Politique pour les Étudiants
    options.AddPolicy("Etudiant", policy =>
        policy.RequireClaim("discriminator", "Etudiant"));

    // Politique pour le Personnel
    options.AddPolicy("Personnel", policy =>
        policy.RequireClaim("discriminator", "Personnel"));

    // Politique pour les Administrateurs
    options.AddPolicy("Admin", policy =>
        policy.RequireClaim("discriminator", "Admin"));

    // Politique pour Étudiant ou Admin
    options.AddPolicy("EtudiantOuAdmin", policy =>
        policy.RequireAssertion(context =>
            context.User.HasClaim(c => c.Type == "discriminator" && c.Value == "Etudiant") ||
            context.User.HasClaim(c => c.Type == "discriminator" && c.Value == "Admin")));

    options.AddPolicy("PersonnelOuAdmin", policy =>
        policy.RequireAssertion(context =>
            context.User.HasClaim(c => c.Type == "discriminator" && c.Value == "Personnel") ||
            context.User.HasClaim(c => c.Type == "discriminator" && c.Value == "Admin")));


});

builder.Services.AddControllers();


// *** Configuration CORS ***
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());
});

builder.Services.AddSingleton<JwtHelper>();

// *** Ajouter Swagger pour la documentation ***
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "Documentation de l'API",
        Description = "API pour la gestion des utilisateurs"
    });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Entrez le token JWT dans le champ suivant : Bearer <token>"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// *** Configuration de l'authentification avec JWT ***
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;

    var jwtKey = builder.Configuration["Jwt:Key"];
    if (string.IsNullOrEmpty(jwtKey))
    {
        Console.WriteLine("JWT Key not found in configuration!");
        throw new InvalidOperationException("La clé JWT (Jwt:Key) n'est pas configurée.");
    }

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };

    // Gestion des événements JWT
    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine("Authentication failed: " + context.Exception.Message);
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            Console.WriteLine($"Token validated for: {context.Principal.Identity?.Name}");
            return Task.CompletedTask;
        }
    };
});

// *** Construction de l'application ***
var app = builder.Build();

// *** Configuration du pipeline de requêtes HTTP ***
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
}

// Activer Swagger et SwaggerUI
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Documentation de l'API v1");
    c.RoutePrefix = string.Empty; // Accessible via la racine (https://localhost:{port}/)
});

// Activer CORS
app.UseCors("AllowAllOrigins");



// L'application a besoin de ces lignes pour activer les routes et statiques
app.UseStaticFiles();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization(); // **Important** : Assurez-vous que cette ligne est bien placée **après UseAuthentication()**.

// Configuration des routes
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

// Lancer l'application
app.Run();
