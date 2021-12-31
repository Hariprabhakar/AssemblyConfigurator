using System.Data;

namespace IdentityService.Helpers
{
    public interface IDatabaseHelper
    {
        IDbConnection Connect();

        DatabasePaging PagingViewToDatabase(ViewPaging paging);
    }

    public class DatabaseHelper : IDatabaseHelper
    {
        private readonly AppSettings _appSettings;

        public DatabaseHelper(IOptions<AppSettings> options)
        {
            _appSettings = options.Value;
        }

        public IDbConnection Connect()
        {
            var dbConn = new Npgsql.NpgsqlConnection(_appSettings.ConnectionString);
            dbConn.Open();

            return dbConn;
        }

        public DatabasePaging PagingViewToDatabase(ViewPaging paging)
        {
            int? limit = null;
            int? offset = null;

            if (paging.PageIndex > 0 && paging.PageSize == 0)       // Default Page Size to 10
            {
                paging.PageSize = 10;
            }
            else if (paging.PageIndex == 0 && paging.PageSize > 0)  // Default Page Index to 1
            {
                paging.PageIndex = 1;
            }

            if (!paging.IsEmpty)
            {
                limit = paging.PageSize;
                offset = (paging.PageIndex - 1) * paging.PageSize;
            }

            return new DatabasePaging { Limit = limit, Offset = offset };
        }
    }
}