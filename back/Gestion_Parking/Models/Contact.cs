namespace Gestion_Parking.Models
{
    public class Contact
    {
        public int Id { get; set; }
        public string Nom { get; set; }
        public string Email { get; set; }
        public string Message { get; set; }
        public DateTime DateEnvoi { get; set; }
    }
}
