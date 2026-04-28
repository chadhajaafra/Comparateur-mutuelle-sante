using Comparateur.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Comparateur.Domain.Entities
{
    public class Offre
    {
        public Guid Id { get; private set; } = Guid.NewGuid();
        public Guid MutuelleId { get; private set; }
        public string Nom { get; private set; } = string.Empty;
        public NiveauCouverture Niveau { get; private set; }
        public decimal PrixMensuel { get; private set; }
        public string? Description { get; private set; }
        public bool IsActive { get; private set; } = true;
        public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; private set; } = DateTime.UtcNow;

        public Mutuelle Mutuelle { get; private set; } = null!;

        private readonly List<OffreGarantie> _offreGaranties = new();
        public IReadOnlyCollection<OffreGarantie> OffreGaranties => _offreGaranties.AsReadOnly();

        private Offre() { }

        public static Offre Create(Guid mutuelleId, string nom, NiveauCouverture niveau, decimal prixMensuel, string? description = null)
        {
            return new Offre
            {
                MutuelleId = mutuelleId,
                Nom = nom.Trim(),
                Niveau = niveau,
                PrixMensuel = prixMensuel,
                Description = description
            };
        }

        public void Update(string nom, NiveauCouverture niveau, decimal prixMensuel, string? description)
        {
            Nom = nom.Trim();
            Niveau = niveau;
            PrixMensuel = prixMensuel;
            Description = description;
            UpdatedAt = DateTime.UtcNow;
        }

        public void Deactivate()
        {
            IsActive = false;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
