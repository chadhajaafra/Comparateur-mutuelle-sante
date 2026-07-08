using Comparateur.Application.Features.Comparateur.Commands;
using Comparateur.Domain.Entities;
using Comparateur.Domain.Interfaces;
using Comparateur.Infrastructure.NewFolder;
using MediatR;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace Comparateur.Infrastructure.Services
{
    public class GroqAssistantRechercheService : IAssistantRechercheService
    {
        private readonly HttpClient _httpClient;
        private readonly GroqSettings _settings;

        public GroqAssistantRechercheService(HttpClient httpClient, IOptions<GroqSettings> settings)
        {
            _httpClient = httpClient;
            _settings = settings.Value;
        }

        public async Task<CritereRechercheExtrait> AnalyserMessageAsync(
            string message,
            List<(string Role, string Contenu)> historique,
            CancellationToken ct)
        {
            var systemPrompt = """
            Tu es un assistant qui aide à trouver une mutuelle santé. Tu dois extraire des critères 
            de recherche à partir de la conversation et répondre STRICTEMENT en JSON, sans texte 
            avant/après, sans balises markdown :

            {
              "budgetMax": number ou null,
              "niveauSouhaite": 1|2|3 ou null (1=Eco, 2=Standard, 3=Premium),
              "typesGarantie": [int] (1=SanteGenerale, 2=Dentaire, 3=Optique, 4=Hospitalisation, 5=Maternite, 6=MedecineDouces),
              "reponseAssistant": string (réponse naturelle, chaleureuse, en français, courte),
              "criteresComplets": boolean (true si budget ET niveau sont connus)

            Si des infos manquent, pose une question ciblée dans "reponseAssistant" (ex: "Quel est ton budget mensuel ?").
            Garde en mémoire les critères déjà donnés dans l'historique, ne les redemande pas.
            """;

            var messages = new List<object> { new { role = "system", content = systemPrompt } };
            foreach (var (role, contenu) in historique)
                messages.Add(new { role = role == "user" ? "user" : "assistant", content = contenu });
            messages.Add(new { role = "user", content = message });

            var requestBody = new
            {
                model = _settings.Model,
                messages,
                response_format = new { type = "json_object" },
                temperature = 0.3
            };

            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", _settings.ApiKey);

            var response = await _httpClient.PostAsJsonAsync(
                "https://api.groq.com/openai/v1/chat/completions", requestBody, ct);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync(ct);
                throw new InvalidOperationException($"Erreur API Groq ({response.StatusCode}) : {error}");
            }

            var result = await response.Content.ReadFromJsonAsync<GroqApiResponse>(cancellationToken: ct);
            var jsonText = result?.Choices?.FirstOrDefault()?.Message?.Content
                ?? throw new InvalidOperationException("Réponse Groq vide.");

            var parsed = JsonSerializer.Deserialize<AssistantExtractionRaw>(jsonText, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            }) ?? throw new InvalidOperationException("Impossible de parser la réponse.");

            return new CritereRechercheExtrait(
                parsed.BudgetMax,
                parsed.NiveauSouhaite,
                parsed.TypesGarantie ?? new List<int>(),
                parsed.ReponseAssistant ?? "Peux-tu préciser ta demande ?",
                parsed.CriteresComplets
            );
        }
    }
    file record AssistantExtractionRaw(
    decimal? BudgetMax,
    int? NiveauSouhaite,
    List<int>? TypesGarantie,
    string? ReponseAssistant,
        bool CriteresComplets
    );    
}
