using CalendarDemo.Server.Models;
using CalendarDemo.Server.Repo;
using Microsoft.Extensions.Logging;

namespace CalendarDemo.Server
{

    public interface IBusinessService
    {
        User GetUserByLogin(UserLogin user);

        bool AddCalendarEvent(CalendarEvent evt);

        bool EditCalendarEvent(long id, CalendarEvent evt);

        bool DeleteCalendarEvent(long eventId);
    }

    public class BusinessService(ILogger<CalendarRepo> logger, 
                                IUserRepo userRepo,
                                ICalendarRepo calendarRepo) : IBusinessService
    {

        public User GetUserByLogin(UserLogin user)
        {
            if (user != null)
            {
                var users = userRepo.GetUsersByLogin(user);

                if (users.Count == 1)
                {
                    return users[0];
                }
                else if (users.Count > 1)
                {
                    logger.LogDebug($"Multiple users match login credentials: {String.Join(",", users.Select(u => u.UserName))}");
                    throw new Exception("More than one user found.");
                }
            }
            else
            {
                logger.LogDebug("No login credentials supplied.");
                throw new Exception("No login credentials supplied.");
            }

            // No user found with supplied credentials
            return null;
        }

        public bool AddCalendarEvent(CalendarEvent evt)
        {
            try
            { 
                var rowsAffected = calendarRepo.UpsertEvent(evt);

                return rowsAffected == 1;
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                throw;
            }

            
        }

        public bool EditCalendarEvent(long id, CalendarEvent evt)
        {
            try
            {
                var rowsAffected = calendarRepo.UpsertEvent(evt, id);

                if(rowsAffected > 1)
                {
                    logger.LogError($"{rowsAffected} events updated with id: {id}.");
                    throw new Exception("Multiple events updated.");
                }

                return rowsAffected == 1;
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                throw;
            }
        }

        public bool DeleteCalendarEvent(long eventId)
        {
            try
            { 
                var rowsAffected = calendarRepo.DeleteCalendarEvent(eventId);

                if(rowsAffected > 1)
                {
                    logger.LogError($"{rowsAffected} events deleted with id: {eventId}.");
                    throw new Exception("Multiple events deleted.");
                }

                return rowsAffected == 1;
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                throw;
            }
        }
    }
}
