using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class RefreshToken
    {
        public Guid Id { get; private set; } = Guid.NewGuid();
        public Guid UserId { get; private set; }
        public string Token { get; private set; } = string.Empty;
        public DateTime ExpiresAt { get; private set; }
        public bool IsRevoked { get; private set; } = false;
        public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
        public string? DeviceInfo { get; private set; }

        public User User { get; private set; } = null!;

        private RefreshToken() { }

        public static RefreshToken Create(Guid userId, string token, int daysValid = 7, string? deviceInfo = null)
        {
            return new RefreshToken
            {
                UserId = userId,
                Token = token,
                ExpiresAt = DateTime.UtcNow.AddDays(daysValid),
                DeviceInfo = deviceInfo
            };
        }

        public bool IsExpired() => DateTime.UtcNow >= ExpiresAt;
        public bool IsActive() => !IsRevoked && !IsExpired();

        public void Revoke()
        {
            IsRevoked = true;
        }
    }
}
