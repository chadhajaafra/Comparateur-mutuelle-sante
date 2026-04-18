using System.Net;
using System.Text.Json;
using Domain.Exceptions;

namespace Comparateur.API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            (HttpStatusCode statusCode, string title, IReadOnlyDictionary<string, string[]>? errors) = exception switch
            {
                ValidationException ve => (HttpStatusCode.BadRequest, "Erreur de validation", ve.Errors),
                NotFoundException => (HttpStatusCode.NotFound, exception.Message, null),
                UnauthorizedException => (HttpStatusCode.Unauthorized, exception.Message, null),
                ConflictException => (HttpStatusCode.Conflict, exception.Message, null),
                DomainException => (HttpStatusCode.BadRequest, exception.Message, null),
                _ => (HttpStatusCode.InternalServerError, "Une erreur inattendue", null)
            };

            if (statusCode == HttpStatusCode.InternalServerError)
                _logger.LogError(exception, "Erreur non gérée : {Message}", exception.Message);

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;

            var response = new
            {
                status = (int)statusCode,
                title,
                errors
            };

            var json = JsonSerializer.Serialize(response, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
            await context.Response.WriteAsync(json);
        }
    }

}
