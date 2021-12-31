namespace IdentityService
{
    public class AppSettings
    {
        public string ConnectionString { get; set; } = string.Empty;
        public string? IsClusterEnv { get; set; }
        public string? ApiGateway { get; set; }
        public string? SpaClient { get; set; }
        public string? MvcClient { get; set; }
        public bool UseVault { get; set; }
        public Vault? Vault { get; set; }
        public int TokenLifetimeMinutes { get; set; }
        public int PermanentTokenLifetimeDays { get; set; }
        public string[] CorsOrigins { get; set; } = new[] { string.Empty };
        public RedisCache? RedisCache { get; set; }
        public MailSettings? MailSettings { get; set; }
    }

    public record struct Vault(string Name, string ClientId, string ClientSecret);
    public record struct RedisCache(string InstanceName, string HostAndPort);
    public record struct MailSettings(string FromEmail, string DisplayName, string Host, int Port, string Password);

    //public class Vault
    //{
    //    public string? Name { get; set; }
    //    public string? ClientId { get; set; }
    //    public string? ClientSecret { get; set; }
    //}

    //public class RedisCache
    //{
    //    public string? InstanceName { get; set; }
    //    public string? HostAndPort { get; set; }
    //}

    //public record MailSettings
    //{
    //    public string? FromEmail { get; set; }
    //    public string? DisplayName { get; set; }
    //    public string? Host { get; set; }
    //    public int Port { get; set; }
    //    public string? Password { get; set; }
    //}
}