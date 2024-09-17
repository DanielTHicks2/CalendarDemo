using Microsoft.Data.SqlClient;

namespace CalendarDemo.Server.Repo
{
    public abstract class RepoBase(IConfiguration config)
    {
        private readonly string _connectionString = config.GetConnectionString("CalendarDB");

        protected SqlConnection GetConnection()
        {
            return new SqlConnection(_connectionString);
        }

    }
}
