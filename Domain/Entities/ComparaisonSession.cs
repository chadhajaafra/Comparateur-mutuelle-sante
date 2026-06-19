using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Comparateur.Domain.Entities
{
    public class ComparaisonSession
    {
        public Guid Id { get; private set; } = Guid.NewGuid();
        public Guid? UserId { get; private set; }          // null = visiteur
        public string? SessionToken { get; private set; }  // visiteur : token cookie
        public string? Couverture { get; private set; }  // "moi"|"conjoint"|"enfants"|"famille"
        public bool? AssureActuellement { get; private set; }
        public string? Civilite { get; private set; }  // "Mme"|"M"
        public string? DateNaissance { get; private set; }  // ISO date string
        public string? CodePostal { get; private set; }
        public string? Profession { get; private set; }
        public string? RegimeSocial { get; private set; }
        public string? DateEffet { get; private set; }
        public string? PersonnesSupp { get; private set; }  // JSON [{dateNaissance}]

        public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; private set; } = DateTime.UtcNow;

        public List<ComparaisonItem> Items { get; private set; } = new();

        // Critères de recherche sauvegardés
        public int? BudgetMax { get; private set; }
        public int? NiveauSouhaite { get; private set; }
        public string? TypesGarantieSouhaites { get; private set; } // JSON array

        private ComparaisonSession() { }

        public static ComparaisonSession CreateForUser(Guid userId) =>
            new() { UserId = userId };

        public static ComparaisonSession CreateForVisitor(string sessionToken) =>
            new() { SessionToken = sessionToken };

        public void SetCriteres(
      int? budgetMax,
      int? niveau,
      List<int>? types,
      string? couverture = null,
      bool? assureActuellement = null,
      string? civilite = null,
      string? dateNaissance = null,
      string? codePostal = null,
      string? profession = null,
      string? regimeSocial = null,
      string? dateEffet = null,
      string? personnesSuppJson = null)
        {
            BudgetMax = budgetMax;
            NiveauSouhaite = niveau;
            TypesGarantieSouhaites = types is { Count: > 0 }
                ? System.Text.Json.JsonSerializer.Serialize(types)
                : null;
            Couverture = couverture;
            AssureActuellement = assureActuellement;
            Civilite = civilite;
            DateNaissance = dateNaissance;
            CodePostal = codePostal;
            Profession = profession;
            RegimeSocial = regimeSocial;
            DateEffet = dateEffet;
            PersonnesSupp = personnesSuppJson;
            UpdatedAt = DateTime.UtcNow;
        }

        public void Touch() => UpdatedAt = DateTime.UtcNow;
    }
}
