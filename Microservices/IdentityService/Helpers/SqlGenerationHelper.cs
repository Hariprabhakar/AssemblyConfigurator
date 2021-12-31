using Microsoft.EntityFrameworkCore.Storage;

using Npgsql.EntityFrameworkCore.PostgreSQL.Storage.Internal;

using System.Text;

namespace IdentityService.Helpers
{
    /// <summary>A replacement for <see cref="NpgsqlSqlGenerationHelper"/>
    /// to convert PascalCaseCsharpyIdentifiers to alllowercasenames.
    /// So table and column names with no embedded punctuation
    /// get generated with no quotes or delimiters.</summary>
    public class NpgsqlSqlGenerationLowercasingHelper : NpgsqlSqlGenerationHelper
    {
        //Don't lowercase ef's migration table
        private const string dontAlter = "__EFMigrationsHistory";

        private static string Customize(string input) => input == dontAlter ? input : input.ToLower();

        public NpgsqlSqlGenerationLowercasingHelper(RelationalSqlGenerationHelperDependencies dependencies)
            : base(dependencies) { }

        public override string DelimitIdentifier(string identifier)
            => base.DelimitIdentifier(Customize(identifier));

        public override void DelimitIdentifier(StringBuilder builder, string identifier)
            => base.DelimitIdentifier(builder, Customize(identifier));
    }
}