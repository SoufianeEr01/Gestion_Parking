namespace Gestion_Parking.Models
{
    public class PlaceParking
    {
        public int id { get; set; }
        public int numero { get; set; }
        public int etage { get; set; }
        public string etat { get; set; }
        public DateTime? dateFinReservation { get; set; }
        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    }
}
