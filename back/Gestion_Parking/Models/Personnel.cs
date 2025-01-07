namespace Gestion_Parking.Models
{
    public class Personnel : Personne
    {
        public string role { get; set; } 
        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
        public ICollection<EmploiPersonnel> EmploiPersonnels { get; set; } = new List<EmploiPersonnel>();


    }
}
