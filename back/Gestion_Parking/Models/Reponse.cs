namespace Gestion_Parking.Models
{
    public class Reponse
    {
        public int Id { get; set; }
        public int ContactId { get; set; } // Clé étrangère vers le modèle Contact
        public string MessageReponse { get; set; }
        public DateTime DateReponse { get; set; }

        // Navigation property pour accéder au message d'origine
        public Contact? Contact { get; set; }
    }
}
