using Bogus;
using Gestion_Parking.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

public static class DataSeeder
{
    public static void SeedContacts(AppDbContext context)
    {
        // Vérifiez si la table "Contacts" est vide
        if (!context.Contacts.Any())
        {
            // Utilisez Bogus pour générer des données fictives
            var faker = new Faker<Contact>()
                .RuleFor(c => c.Nom, f => f.Name.LastName())
                .RuleFor(c => c.Email, f => f.Internet.Email())
                .RuleFor(c => c.Message, f => f.Lorem.Sentence(10))
                .RuleFor(c => c.DateEnvoi, f => f.Date.Recent(30));

            // Génère 50 contacts fictifs
            var fakeContacts = faker.Generate(50);

            // Ajoutez ces contacts à la base de données
            context.Contacts.AddRange(fakeContacts);
            context.SaveChanges();
        }
    }
    public static void SeedGroupes(AppDbContext context)
    {
        // Vérifiez si des groupes existent déjà pour éviter de dupliquer les données
        if (!context.Groupes.Any())
        {
            // Générer des groupes avec des noms séquentiels "G1", "G2", ..., "G10"
            var groupes = Enumerable.Range(1, 10)
                                    .Select(i => new Groupe { nom = $"G{i}" })
                                    .ToList();

            // Ajouter les groupes à la base de données
            context.Groupes.AddRange(groupes);
            context.SaveChanges();
        }
    }
    public static void SeedPlacesParking(AppDbContext context)
    {
        // Vérifiez si des places existent déjà pour éviter de dupliquer les données
        if (!context.PlaceParkings.Any())
        {
            var placesParking = Enumerable.Range(1, 20) // Générer 20 places numérotées de 1 à 20
                .Select(i => new PlaceParking
                {
                    numero = i,
                    etat = "libre" // Toutes les places sont libres
                })
                .ToList();

            // Ajouter les places parking à la base de données
            context.PlaceParkings.AddRange(placesParking);
            context.SaveChanges();
        }
    }

    public static void SeedEtudiants(AppDbContext context)
    {
        if (!context.Etudiants.Any())
        {
            var etudiants = new List<Etudiant>
                {
                    new Etudiant
                    {
                        nom = "Dupont",
                        prenom = "Jean",
                        email = "jean.dupont@emsi-edu.ma",
                        motdepasse = Personne.HashPassword("password123"),
                        GroupeId = 1
                    },
                    new Etudiant
                    {
                        nom = "Martin",
                        prenom = "Claire",
                        email = "claire.martin@emsi-edu.ma",
                        motdepasse = Personne.HashPassword("password456"),
                        GroupeId = 2
                    },
                    new Etudiant
                    {
                        nom = "Durand",
                        prenom = "Paul",
                        email = "paul.durand@emsi-edu.ma",
                        motdepasse = Personne.HashPassword("password789"),
                        GroupeId = 3
                    }
                };

            context.Etudiants.AddRange(etudiants);
            context.SaveChanges();
        }
    }

    public static void SeedPersonnels(AppDbContext context)
    {
        if (!context.Personnels.Any())
        {
            var personnels = new List<Personnel>
                {
                    new Personnel
                    {
                        nom = "Bernard",
                        prenom = "Alice",
                        email = "alice.bernard@emsi-edu.ma",
                        motdepasse = Personne.HashPassword("admin123"),
                        role = "administrateur"
                    },
                    new Personnel
                    {
                        nom = "Rousseau",
                        prenom = "Marc",
                        email = "marc.rousseau@emsi-edu.ma",
                        motdepasse = Personne.HashPassword("enseignant456"),
                        role = "enseignant"
                    },
                    new Personnel
                    {
                        nom = "Lemoine",
                        prenom = "Sophie",
                        email = "sophie.lemoine@emsi-edu.ma",
                        motdepasse = Personne.HashPassword("enseignant789"),
                        role = "enseignant"
                    }
                };

            context.Personnels.AddRange(personnels);
            context.SaveChanges();
        }
    }
    public static void SeedAdmins(AppDbContext context)
    {
        if (!context.Admins.Any())
        {
            var admins = new List<Admin>
                {
                    new Admin
                    {
                        nom = "Super",
                        prenom = "Admin",
                        email = "admin@emsi-edu.ma",
                        motdepasse = Personne.HashPassword("superadmin123")
                    }
                };

            context.Admins.AddRange(admins);
            context.SaveChanges();
        }
    }

    public static void SeedEmplois(AppDbContext context)
    {
        if (!context.Emplois.Any())
        {
            var emplois = new List<Emploi>
                {
                    new Emploi
                    {
                        Groupe_Id = 1, // Assurez-vous que ce groupe existe
                        Jour = Jour.Samedi,
                        DateDebut = new TimeSpan(8, 0, 0), // 08:00
                        DateFin = new TimeSpan(10, 0, 0),  // 10:00
                    },
                    new Emploi
                    {
                        Groupe_Id = 2, // Assurez-vous que ce groupe existe
                        Jour = Jour.Samedi,
                        DateDebut = new TimeSpan(10, 0, 0), // 10:00
                        DateFin = new TimeSpan(12, 0, 0),   // 12:00
                    },
                    new Emploi
                    {
                        Groupe_Id = 3, // Assurez-vous que ce groupe existe
                        Jour = Jour.Samedi,
                        DateDebut = new TimeSpan(14, 0, 0), // 14:00
                        DateFin = new TimeSpan(16, 0, 0),   // 16:00
                    }
                };

            context.Emplois.AddRange(emplois);
            context.SaveChanges();
        }
    }

}
