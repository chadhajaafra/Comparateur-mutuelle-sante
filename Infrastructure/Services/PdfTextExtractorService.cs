using Comparateur.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UglyToad.PdfPig;
namespace Comparateur.Infrastructure.Services
{
    public class PdfTextExtractorService : IPdfTextExtractorService
    {
        public string ExtraireTexte(Stream pdfStream)
        {
            using var document = PdfDocument.Open(pdfStream);
            var sb = new StringBuilder();
            foreach (var page in document.GetPages())
                sb.AppendLine(page.Text);
            return sb.ToString();
        }
    }
}
