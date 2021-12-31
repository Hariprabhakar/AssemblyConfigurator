namespace IdentityService.HttpHelpers
{
    public class SlugifyParameterTransformer : IOutboundParameterTransformer
    {
        public string? TransformOutbound(object? value)
        {
            // Slugify value
            if (value == null) return null;
            string input = value.ToString() ?? string.Empty;
            return Regex.Replace(input, "([a-z])([A-Z])", "$1-$2").ToLower();
        }
    }
}