using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;


namespace Application.Common
{
    public interface ITokenService
    {
        string GenerateAccessToken(User user);
        string GenerateRefreshToken();
        ClaimsPrincipal? GetPrincipalFromToken(string token);
    }

    public interface IEmailService
    {
        Task SendEmailVerificationAsync(string toEmail, string token, CancellationToken ct = default);
        Task SendPasswordResetAsync(string toEmail, string token, CancellationToken ct = default);
    }
}