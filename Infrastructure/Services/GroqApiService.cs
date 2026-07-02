using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Comparateur.Domain.Entities;
using Comparateur.Domain.Interfaces;
using Comparateur.Infrastructure.NewFolder;
using Microsoft.Extensions.Options;

namespace Comparateur.Infrastructure.Services
{
    public class GroqApiService : IClaudeService
    {
        private readonly HttpClient _httpClient;
        private readonly GroqSettings _settings;

        public GroqApiService(HttpClient httpClient, IOptions<GroqSettings> settings)
        {
            _httpClient = httpClient;
            _settings = settings.Value;
        }

        public async Task<ContratAnalyseResult> AnalyserContratAsync(string texteContrat, CancellationToken ct)
        {
            var texteTronque = texteContrat.Length > 15000 ? texteContrat[..15000] : texteContrat;

            var prompt = $$"""
            Voici le texte extrait d'un contrat de mutuelle santé. Extrais UNIQUEMENT les informations 
            suivantes et réponds STRICTEMENT en JSON, sans texte avant/après, sans balises markdown :

            {
              "assureurNom": string ou null,
              "prixMensuel": number ou null,
              "niveauEstime": "Eco"|"Standard"|"Premium" ou null,
              "garanties": [
                { "nom": string, "typeGarantieEstime": 1-6, "tauxRemboursement": number ou null, "plafond": number ou null }
              ]
            }

            Mapping typeGarantieEstime : 1=SanteGenerale, 2=Dentaire, 3=Optique, 4=Hospitalisation, 5=Maternite, 6=MedecineDouces

            Texte du contrat :
            {{texteTronque}}
            """;

            var requestBody = new
            {
                model = _settings.Model,
                messages = new[]
                {
                new { role = "user", content = prompt }
            },
                response_format = new { type = "json_object" }, // force le JSON pur, comme Gemini
                temperature = 0.2
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
                ?? throw new InvalidOperationException("Réponse Groq vide ou mal formée.");

            var parsed = JsonSerializer.Deserialize<GroqExtractionRaw>(jsonText, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            }) ?? throw new InvalidOperationException("Impossible de parser la réponse JSON de Groq.");

            return new ContratAnalyseResult(
                parsed.AssureurNom,
                parsed.PrixMensuel,
                parsed.NiveauEstime,
                (parsed.Garanties ?? [])
                    .Select(g => new GarantieAnalysee(g.Nom, g.TypeGarantieEstime, g.TauxRemboursement, g.Plafond))
                    .ToList()
            );
        }
    }

    // Désérialisation JSON brute — reste privée à ce fichier
    file record GroqExtractionRaw(string? AssureurNom, decimal? PrixMensuel, string? NiveauEstime, List<GroqGarantieRaw>? Garanties);
    file record GroqGarantieRaw(string Nom, int TypeGarantieEstime, decimal? TauxRemboursement, decimal? Plafond);

    // Enveloppe de réponse Groq — format OpenAI-compatible (chat.completions)
    public record GroqApiResponse(List<GroqChoice>? Choices);
    public record GroqChoice(GroqMessage? Message);
    public record GroqMessage(string? Content);
} 
