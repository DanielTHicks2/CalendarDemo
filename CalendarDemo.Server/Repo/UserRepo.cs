using CalendarDemo.Server.Models;
using System.Data;
using Dapper;

namespace CalendarDemo.Server.Repo
{

    public interface IUserRepo
    {
        List<User> GetAllUsers();
        List<User> GetUsersByLogin(UserLogin user);
    }

    public class UserRepo(IConfiguration config) : RepoBase(config), IUserRepo
    {

        public List<User> GetAllUsers()
        {
            return GetConnection().Query<User>("spGetUsers", commandType: CommandType.StoredProcedure).ToList();
        }

        public List<User> GetUsersByLogin(UserLogin user)
        {
            var parms = new DynamicParameters();
            parms.Add("UserName", user.UserName);
            parms.Add("Password", user.Password);

            return GetConnection().Query<User>("spGetUserByLogin", parms, commandType: CommandType.StoredProcedure).ToList();
        }

    }
}
