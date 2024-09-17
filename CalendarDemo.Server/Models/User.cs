namespace CalendarDemo.Server.Models
{
    public class User
    {
        public long? UserId { get; set; }

        public string UserName { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Password { get; set; }

    }

    public class UserLogin
    {
        public string UserName { get; set; }

        public string Password { get; set; }
    }
}
