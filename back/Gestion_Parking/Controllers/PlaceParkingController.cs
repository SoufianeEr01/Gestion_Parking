using Gestion_Parking.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace Gestion_Parking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlaceParkingController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PlaceParkingController(AppDbContext context)
        {
            _context = context;
        }

        // Create a parking place
        [Authorize(Policy = "Admin")]
        [HttpPost]
        public IActionResult CreatePlaceParking([FromBody] PlaceParking placeParking)
        {
            try
            {
                _context.PlaceParkings.Add(placeParking);
                _context.SaveChanges();
                return Ok(new { message = "Place de parking créée avec succès." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { erreur = ex.Message });
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public IActionResult GetAllPlaceParkings()
        {
            try
            {
                var placeParkingList = _context.PlaceParkings
                    .Include(p => p.Reservations)
                    .ThenInclude(r => r.Personne)
                    .Select(p => new
                    {
                        id = p.id,
                        numero = p.numero,
                        etage = p.etage,
                        etat = p.etat,
                        dateFinReservation = p.dateFinReservation.HasValue
                            ? p.dateFinReservation.Value.ToString("yyyy-MM-dd")
                            : null,
                        nom = p.Reservations
                            .Where(r => r.Personne != null)  // S'assurer qu'il y a bien une personne associée
                            .Select(r => r.Personne.nom)
                            .FirstOrDefault(), // Sélectionner le premier nom associé
                        prenom = p.Reservations
                            .Where(r => r.Personne != null)  // S'assurer qu'il y a bien une personne associée
                            .Select(r => r.Personne.prenom)
                            .FirstOrDefault() // Sélectionner le premier prénom associé
                    })
                    .ToList();

                return Ok(placeParkingList);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { erreur = "Une erreur est survenue lors de la récupération des places de parking.", details = ex.Message });
            }
        }


        [Authorize(Policy = "EtudiantOuAdmin")]
        [HttpGet("{id}")]
        public IActionResult GetPlaceParkingById(int id)
        {
            try
            {
                var placeParking = _context.PlaceParkings
                    .Include(p => p.Reservations)
                    .ThenInclude(r => r.Personne)
                    .Where(p => p.id == id)
                    .Select(p => new
                    {
                        numero = p.numero,
                        etage = p.etage,
                        etat = p.etat,
                        dateFinReservation = p.dateFinReservation.HasValue
                            ? p.dateFinReservation.Value.ToString("yyyy-MM-dd")
                            : null,
                        nom = p.Reservations.Select(r => r.Personne.nom).FirstOrDefault(),
                        prenom = p.Reservations.Select(r => r.Personne.prenom).FirstOrDefault()
                    })
                    .FirstOrDefault();

                if (placeParking == null)
                {
                    return NotFound(new { message = "Place de parking non trouvée." });
                }

                return Ok(placeParking);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { erreur = "Une erreur est survenue lors de la récupération de la place de parking.", details = ex.Message });
            }
        }

        [Authorize(Policy = "Admin")]
        [HttpDelete("{id}")]
        public IActionResult DeletePlaceParking(int id)
        {
            try
            {
                var placeParking = _context.PlaceParkings.Find(id);
                if (placeParking == null)
                {
                    return NotFound(new { message = "Place de parking non trouvée ou déjà supprimée." });
                }

                _context.PlaceParkings.Remove(placeParking);
                _context.SaveChanges();
                return Ok(new { message = "Place de parking supprimée avec succès." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { erreur = "Une erreur est survenue lors de la suppression de la place de parking.", details = ex.Message });
            }
        }

        [Authorize(Policy = "Admin")]
        [HttpPut("{id}")]
        public IActionResult UpdatePlaceParking(int id, [FromBody] PlaceParking placeParking)
        {
            try
            {
                var existingPlaceParking = _context.PlaceParkings.Find(id);
                if (existingPlaceParking == null)
                {
                    return NotFound(new { message = "Place de parking non trouvée ou non mise à jour." });
                }

                existingPlaceParking.numero = placeParking.numero;
                existingPlaceParking.etage = placeParking.etage;
                existingPlaceParking.etat = placeParking.etat;
                existingPlaceParking.dateFinReservation = placeParking.dateFinReservation;

                _context.SaveChanges();
                return Ok(new { message = "Place de parking mise à jour avec succès." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { erreur = "Une erreur est survenue lors de la mise à jour de la place de parking.", details = ex.Message });
            }
        }
    }
}
