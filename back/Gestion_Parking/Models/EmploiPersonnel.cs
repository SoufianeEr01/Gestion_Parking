using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Gestion_Parking.Models
{
    public class EmploiPersonnel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // Auto-incrémentation
        public int Id { get; set; }

        [Required]
        public int PersonnelId { get; set; } // Référence vers le personnel

        [ForeignKey("PersonnelId")]
        public Personnel ?Personnel { get; set; } // Relation avec la classe Personnel

        [Column(TypeName = "nvarchar(50)")]
        public Jour Jour { get; set; } // Jour de la semaine

        [Required]
        public TimeSpan HeureDebut { get; set; } // Heure de début de l'emploi du temps

        [Required]
        public TimeSpan HeureFin { get; set; } // Heure de fin de l'emploi du temps

        public string Role { get; set; } // Administratif ou Enseignant

        public void DefinirHorairesParDefaut()
        {
            if (Role == "Administrateur")
            {
                if (Jour == Jour.Samedi)
                {
                    HeureDebut = new TimeSpan(8, 30, 0);
                    HeureFin = new TimeSpan(12, 30, 0);
                }
                else if (Jour >= Jour.Lundi && Jour <= Jour.Vendredi)
                {
                    HeureDebut = new TimeSpan(8, 30, 0);
                    HeureFin = new TimeSpan(16, 30, 0);
                }
            }
            else if (Role == "Enseignant")
            {
                // Les horaires des enseignants doivent être définis manuellement.
                HeureDebut = TimeSpan.Zero; // Indique qu'ils ne sont pas encore définis
                HeureFin = TimeSpan.Zero;
            }
        }

        public string Valider()
        {
            if (HeureDebut >= HeureFin)
            {
                return "L'heure de début doit être avant l'heure de fin.";
            }

            if (Jour == Jour.Dimanche)
            {
                return "L'emploi du temps ne peut pas être créé pour le dimanche.";
            }

            return "Emploi du temps valide.";
        }
    }

}
