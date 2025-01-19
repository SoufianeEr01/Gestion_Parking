namespace Gestion_Parking.Models
{
    public class Paiement
    {
        public int id { get; set; }
        public string mode_paiement { get; set; }
        public float prix_paye { get; set; }

        // Clé étrangère pour Personne
        public int personne_id { get; set; }

        // Navigation property vers Personne
        public Personne? Personne { get; set; }
    }
}
