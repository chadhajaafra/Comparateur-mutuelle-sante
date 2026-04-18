using Application.Common;
using Microsoft.Extensions.Configuration;
using MailKit.Net.Smtp;
using MimeKit;

namespace Comparateur.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config) => _config = config;

        public async Task SendEmailVerificationAsync(string toEmail, string token, CancellationToken ct = default)
        {
            var link = $"{_config["AppSettings:FrontendUrl"]}/verify-email?token={token}";
            await SendAsync(toEmail, "Vérifiez votre email", $@"
            <h2>Bienvenue sur MutuelleComparateur !</h2>
            <p>Cliquez sur le lien ci-dessous pour vérifier votre adresse email :</p>
            <a href='{link}' style='padding:10px 20px;background:#7F77DD;color:white;border-radius:6px;text-decoration:none;'>
                Vérifier mon email
            </a>
            <p>Ce lien expire dans 24h.</p>
        ", ct);
        }

        public async Task SendPasswordResetAsync(string toEmail, string token, CancellationToken ct = default)
        {
            var link = $"{_config["AppSettings:FrontendUrl"]}/reset-password?token={token}";
            await SendAsync(toEmail, "Réinitialisation de votre mot de passe", $@"
            <h2>Réinitialisation du mot de passe</h2>
            <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
            <a href='{link}' style='padding:10px 20px;background:#7F77DD;color:white;border-radius:6px;text-decoration:none;'>
                Réinitialiser mon mot de passe
            </a>
            <p>Ce lien expire dans 1h. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
        ", ct);
        }

        private async Task SendAsync(string toEmail, string subject, string htmlBody, CancellationToken ct)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(
                _config["EmailSettings:SenderName"],
                _config["EmailSettings:SenderEmail"]
            ));
            message.To.Add(MailboxAddress.Parse(toEmail));
            message.Subject = subject;
            message.Body = new TextPart("html") { Text = htmlBody };

            using var client = new SmtpClient();
            await client.ConnectAsync(
                _config["EmailSettings:SmtpHost"],
                int.Parse(_config["EmailSettings:SmtpPort"] ?? "587"),
                false, ct
            );
            await client.AuthenticateAsync(
                _config["EmailSettings:Username"],
                _config["EmailSettings:Password"], ct
            );
            await client.SendAsync(message, ct);
            await client.DisconnectAsync(true, ct);
        }
    }

}
