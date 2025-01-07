namespace Gestion_Parking.Models
{
    public class PlaceParking
    {
        public int id { get; set; }
        public int numero { get; set; }
        public string etat { get; set; } //"libre" ou "reservé"
        public DateOnly dateFinReservation { get; set; }
        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    }
}
