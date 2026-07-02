using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Comparateur.Infrastructure.NewFolder
{
    public class GroqSettings
    {
        public string ApiKey { get; set; } = string.Empty;
        public string Model { get; set; } = "llama-3.3-70b-versatile";
    }
}
