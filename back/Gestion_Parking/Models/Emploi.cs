using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Gestion_Parking.Models
{
    public class Emploi
    {
        // Jour comme clé primaire
        [Key]
        [Required]
        [Column(TypeName = "nvarchar(50)")] // Utilisé pour stocker des valeurs textuelles des jours
        public Jour Jour { get; set; } // Enumération des jours de la semaine

        [Required]
        public TimeSpan DateDebut { get; set; } // Heure de début de l'emploi du temps

        [Required]
        public TimeSpan DateFin { get; set; } // Heure de fin de l'emploi du temps

        [Required]
        public int Groupe_Id { get; set; } // Clé étrangère

        [ForeignKey("Groupe_Id")]
        public Groupe? Groupe { get; set; } // Relation avec le groupe

        public string Valider()
        {
            if (DateDebut >= DateFin)
            {
                return "La date de début doit être avant la date de fin.";
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