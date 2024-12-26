using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Gestion_Parking.Models
{
    public class Emploi
    {
        // Clé primaire auto-incrémentée
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // Auto-incrémentation
        public int Id { get; set; } // Clé primaire unique

        // Clé étrangère vers Groupe
        public int Groupe_Id { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public Jour Jour { get; set; } // Jour de la semaine

        [Required]
        public TimeSpan DateDebut { get; set; } // Heure de début de l'emploi du temps

        [Required]
        public TimeSpan DateFin { get; set; } // Heure de fin de l'emploi du temps

        [ForeignKey("Groupe_Id")]
        public Groupe? Groupe { get; set; } // Relation avec le groupe

        public string Valider()
        {
            if (DateDebut >= DateFin)
            {
                return "La date de début doit être avant la date de fin.";
            }

            // Validation : uniquement du lundi au samedi
            if (Jour == Jour.Dimanche)
            {
                return "L'emploi du temps ne peut pas être créé pour le dimanche.";
            }

            return "Emploi du temps valide.";
        }
    }

    // Enumération des jours de la semaine
    public enum Jour
    {
        Lundi,
        Mardi,
        Mercredi,
        Jeudi,
        Vendredi,
        Samedi,
        Dimanche
    }
}
