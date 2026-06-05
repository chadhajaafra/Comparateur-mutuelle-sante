using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Comparateur.Domain.Entities
{
    class ComparaisonSession
    {
        public Guid Id { get; private set; } = Guid.NewGuid();
        public Guid? UserId { get; private set; }          // null = visiteur
        public string? SessionToken { get; private set; }  // visiteur : token cookie
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

        public void SetCriteres(int? budgetMax, int? niveau, List<int>? types)
        {
            BudgetMax = budgetMax;
            NiveauSouhaite = niveau;
            TypesGarantieSouhaites = types is { Count: > 0 }
                ? System.Text.Json.JsonSerializer.Serialize(types)
                : null;
            UpdatedAt = DateTime.UtcNow;
        }

        public void Touch() => UpdatedAt = DateTime.UtcNow;
    }
}
