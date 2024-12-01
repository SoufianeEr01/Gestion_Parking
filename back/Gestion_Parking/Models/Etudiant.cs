using System.ComponentModel.DataAnnotations.Schema;

namespace Gestion_Parking.Models
{
    public class Etudiant : Personne
    {
        [ForeignKey("Groupe")]
        public int GroupeId { get; set; }  // La clé étrangère

        [NotMapped]  // Ignorer cette propriété lors de la sérialisation et des validations
        public Groupe? EtudiantGroupe { get; set; }  // Navigation property

        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    }
}
