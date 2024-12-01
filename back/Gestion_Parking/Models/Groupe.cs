using System.Text.Json.Serialization;

namespace Gestion_Parking.Models
{
    public class Groupe
    {
        public int id { get; set; }
        public string nom { get; set; }

        // Liste des étudiants associés à ce groupe
        public ICollection<Etudiant> Etudiants { get; set; } = new List<Etudiant>();

        // Ajoutez la propriété pour les emplois
        [JsonIgnore]
        public ICollection<Emploi> Emplois { get; set; } = new List<Emploi>();  // Ajout de la collection Emplois
    }
}
