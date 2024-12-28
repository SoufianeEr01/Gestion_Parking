namespace Gestion_Parking.Models
{
    public class Personnel : Personne
    {
        public string role { get; set; } 
        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    }
}
