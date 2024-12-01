using Gestion_Parking.Models;

public class Reservation
{
    public int id { get; set; }
    public DateOnly date { get; set; }
    public TimeOnly heureDebut { get; set; }
    public TimeOnly heureFin { get; set; }
    public string lieu { get; set; }
    public int personne_id { get; set; }  // Référence unique à Personne
    public int placeParking_id { get; set; }  // Référence obligatoire

    // Navigation properties
    public Personne? Personne { get; set; }
    public PlaceParking? PlaceParking { get; set; }
}
