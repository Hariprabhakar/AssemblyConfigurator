namespace IdentityService
{
    public static class IWebHostExtensions
    {
        public static bool IsInKubernetes(this IWebHost webHost)
        {
            var cfg = webHost.Services.GetService<IConfiguration>();
            var orchestratorType = cfg.GetValue<string>("OrchestratorType");
            return orchestratorType?.ToUpper() == "K8S";
        }

        public static IWebHost MigrateDbContext<TContext>(this IWebHost webHost, Action<TContext, IServiceProvider> seeder) where TContext : DbContext
        {
            if (seeder == null) return webHost;

            var underK8s = webHost.IsInKubernetes();

            using (var scope = webHost.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var logger = services.GetRequiredService<ILogger<TContext>>();
                var context = services.GetService<TContext>();

                try
                {
                    logger.LogInformation("Migrating database associated with context {DbContextName}", typeof(TContext).Name);

                    if (underK8s)
                    {
#pragma warning disable CS8631 // The type cannot be used as type parameter in the generic type or method. Nullability of type argument doesn't match constraint type.
#pragma warning disable CS8620 // Argument cannot be used for parameter due to differences in the nullability of reference types.
                        InvokeSeeder(seeder, context, services);
#pragma warning restore CS8620 // Argument cannot be used for parameter due to differences in the nullability of reference types.
#pragma warning restore CS8631 // The type cannot be used as type parameter in the generic type or method. Nullability of type argument doesn't match constraint type.
                    }
                    else
                    {
                        var retries = 10;
                        var retry = Policy.Handle<Npgsql.NpgsqlException>()
                            .WaitAndRetry(
                                retryCount: retries,
                                sleepDurationProvider: retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)),
                                onRetry: (exception, timeSpan, retry, ctx) =>
                                {
                                    logger.LogWarning(exception, "[{prefix}] Exception {ExceptionType} with message {Message} detected on attempt {retry} of {retries}", nameof(TContext), exception.GetType().Name, exception.Message, retry, retries);
                                });

                        //if the postgresql container is not created on run docker compose this
                        //migration can't fail for network related exception. The retry options for DbContext only
                        //apply to transient exceptions
                        // Note that this is NOT applied when running some orchestrators (let the orchestrator to recreate the failing service)
#pragma warning disable CS8631 // The type cannot be used as type parameter in the generic type or method. Nullability of type argument doesn't match constraint type.
#pragma warning disable CS8620 // Argument cannot be used for parameter due to differences in the nullability of reference types.
                        retry.Execute(action: () => InvokeSeeder(seeder, context, services));
#pragma warning restore CS8620 // Argument cannot be used for parameter due to differences in the nullability of reference types.
#pragma warning restore CS8631 // The type cannot be used as type parameter in the generic type or method. Nullability of type argument doesn't match constraint type.
                    }

                    logger.LogInformation("Migrated database associated with context {DbContextName}", typeof(TContext).Name);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "An error occurred while migrating the database used on context {DbContextName}", typeof(TContext).Name);
                    if (underK8s)
                    {
                        throw;          // Rethrow under k8s because we rely on k8s to re-run the pod
                    }
                }
            }

            return webHost;
        }

        private static void InvokeSeeder<TContext>(Action<TContext, IServiceProvider> seeder, TContext context, IServiceProvider services)
            where TContext : DbContext
        {
            context.Database.Migrate();
            seeder(context, services);
        }
    }
}