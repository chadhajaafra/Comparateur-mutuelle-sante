using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class User
    {
        public Guid Id { get; private set; } = Guid.NewGuid();
        public string Email { get; private set; } = string.Empty;
        public string PasswordHash { get; private set; } = string.Empty;
        public string FirstName { get; private set; } = string.Empty;
        public string LastName { get; private set; } = string.Empty;
        public UserRole Role { get; private set; } = UserRole.Utilisateur;
        public bool IsActive { get; private set; } = true;
        public bool IsEmailVerified { get; private set; } = false;
        public string? EmailVerificationToken { get; private set; }
        public string? PasswordResetToken { get; private set; }
        public DateTime? PasswordResetTokenExpiry { get; private set; }
        public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; private set; } = DateTime.UtcNow;

        private readonly List<RefreshToken> _refreshTokens = new();
        public IReadOnlyCollection<RefreshToken> RefreshTokens => _refreshTokens.AsReadOnly();

        // Constructeur privé pour EF Core
        private User() { }

        // Factory method
        public static User Create(string email, string passwordHash, string firstName, string lastName, UserRole role = UserRole.Utilisateur)
        {
            return new User
            {
                Email = email.ToLower().Trim(),
                PasswordHash = passwordHash,
                FirstName = firstName,
                LastName = lastName,
                Role = role,
                EmailVerificationToken = Guid.NewGuid().ToString()
            };
        }

        public void VerifyEmail()
        {
            IsEmailVerified = true;
            EmailVerificationToken = null;
            UpdatedAt = DateTime.UtcNow;
        }

        public void SetPasswordResetToken(string token, DateTime expiry)
        {
            PasswordResetToken = token;
            PasswordResetTokenExpiry = expiry;
            UpdatedAt = DateTime.UtcNow;
        }

        public void ResetPassword(string newPasswordHash)
        {
            PasswordHash = newPasswordHash;
            PasswordResetToken = null;
            PasswordResetTokenExpiry = null;
            UpdatedAt = DateTime.UtcNow;
        }

        public void Deactivate()
        {
            IsActive = false;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
