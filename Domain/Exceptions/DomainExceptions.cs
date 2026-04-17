using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Exceptions
{
    public class DomainException : Exception
    {
        public DomainException(string message) : base(message) { }
    }

    public class NotFoundException : DomainException
    {
        public NotFoundException(string entity, object key)
            : base($"{entity} avec l'identifiant '{key}' est introuvable.") { }
    }

    public class UnauthorizedException : DomainException
    {
        public UnauthorizedException(string message = "Accès non autorisé.")
            : base(message) { }
    }

    public class ConflictException : DomainException
    {
        public ConflictException(string message) : base(message) { }
    }

    public class ValidationException : DomainException
    {
        public IReadOnlyDictionary<string, string[]> Errors { get; }

        public ValidationException(IDictionary<string, string[]> errors)
            : base("Une ou plusieurs erreurs de validation ont eu lieu.")
        {
            Errors = new Dictionary<string, string[]>(errors);
        }
    }
}