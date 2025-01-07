using Gestion_Parking.Models;
using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // DbSet pour les différents modèles
    public DbSet<Personne> Personnes { get; set; }
    public DbSet<Admin> Admins { get; set; }
    public DbSet<Etudiant> Etudiants { get; set; }
    public DbSet<Personnel> Personnels { get; set; }
    public DbSet<Groupe> Groupes { get; set; }
    public DbSet<Emploi> Emplois { get; set; }
    public DbSet<Reservation> Reservations { get; set; }
    public DbSet<PlaceParking> PlaceParkings { get; set; }
    public DbSet<Contact> Contacts { get; set; }
    public DbSet<Reponse> Reponses { get; set; }
    public DbSet<EmploiPersonnel> EmploiPersonnels { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configuration de la relation entre Reservation et Personne
        modelBuilder.Entity<Reservation>()
            .HasOne(r => r.Personne)
            .WithMany()
            .HasForeignKey(r => r.personne_id)
            .OnDelete(DeleteBehavior.Restrict);

        // Configuration de la relation entre Reservation et PlaceParking
        modelBuilder.Entity<Reservation>()
            .HasOne(r => r.PlaceParking)
            .WithMany(pp => pp.Reservations)
            .HasForeignKey(r => r.placeParking_id)
            .OnDelete(DeleteBehavior.Restrict);

        // Configuration de la relation entre Etudiant et Groupe
        modelBuilder.Entity<Etudiant>()
            .HasOne(e => e.EtudiantGroupe)
            .WithMany(g => g.Etudiants)
            .HasForeignKey(e => e.GroupeId)
            .IsRequired(false);

        // Relation entre Groupe et Emploi
        modelBuilder.Entity<Groupe>()
            .HasMany(g => g.Emplois)
            .WithOne(e => e.Groupe)
            .HasForeignKey(e => e.Groupe_Id)
            .OnDelete(DeleteBehavior.Cascade);

        // Relation entre Reponse et Contact
        modelBuilder.Entity<Reponse>()
            .HasOne(r => r.Contact)
            .WithMany(c => c.Reponses)
            .HasForeignKey(r => r.ContactId)
            .OnDelete(DeleteBehavior.Cascade);

        // Relation entre Personnel et EmploiPersonnel
        modelBuilder.Entity<EmploiPersonnel>()
            .HasOne(ep => ep.Personnel)
            .WithMany(p => p.EmploiPersonnels)
            .HasForeignKey(ep => ep.PersonnelId)
            .OnDelete(DeleteBehavior.Cascade);

        // Autres configurations personnalisées ici...

        base.OnModelCreating(modelBuilder);
    }
}
