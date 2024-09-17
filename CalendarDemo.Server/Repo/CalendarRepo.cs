using CalendarDemo.Server.Models;
using System.Data;
using Dapper;


namespace CalendarDemo.Server.Repo
{

    public interface ICalendarRepo
    {
        List<CalendarEvent> SearchCalendar(CalendarSearch searchParams);

        CalendarEvent GetCalendarEvent(long id);

        long UpsertEvent(CalendarEvent evt, long eventId = 0);

        long DeleteCalendarEvent(long eventId);
    }

    public class CalendarRepo(IConfiguration config) : RepoBase(config), ICalendarRepo
    {

        public List<CalendarEvent> SearchCalendar(CalendarSearch searchParams)
        {
            var parms = new DynamicParameters();

            if (searchParams.EventOwnerID != 0)
            {
                parms.Add("EventOwnerID", searchParams.EventOwnerID);
            }

            if (!String.IsNullOrEmpty(searchParams.StartDateTime))
            {
                parms.Add("EventDateTimeStart", searchParams.StartDateTime);
            }

            if (!String.IsNullOrEmpty(searchParams.EndDateTime))
            {
                parms.Add("EventDateTimeEnd", searchParams.EndDateTime);
            }

            parms.Add("EventTitle", searchParams.Title);

            return GetConnection().Query<CalendarEvent>("spSearchCalendarEvents", parms, commandType: CommandType.StoredProcedure).ToList();
        }

        public CalendarEvent GetCalendarEvent(long id)
        {
            var parms = new DynamicParameters();
            
            parms.Add("EventID", id);

            return GetConnection().QueryFirstOrDefault<CalendarEvent>("spGetCalendarEventByID", parms, commandType: CommandType.StoredProcedure);
        }

        public long UpsertEvent(CalendarEvent evt, long eventId = 0)
        {
            var parms = new DynamicParameters();

            if (eventId != 0)
            {
                parms.Add("EventID", eventId);
            }

            parms.Add("EventOwnerID", evt.EventOwnerID);
            parms.Add("EventTitle", evt.Title);
            parms.Add("EventDescription", evt.Description);
            parms.Add("EventStartDateTime", evt.EventStartDateTime);
            parms.Add("EventEndDateTime", evt.EventEndDateTime);

            var rowsAffected = GetConnection().Execute("spUpsertCalendarEvent", parms, commandType: CommandType.StoredProcedure);

            return rowsAffected;
        }

        public long DeleteCalendarEvent(long eventId)
        {
            var parms = new DynamicParameters();
            parms.Add("EventID", eventId);

            var rowsAffected = GetConnection().Execute("spDeleteCalendarEvent", parms, commandType: CommandType.StoredProcedure);

            return rowsAffected;
        }

    }
}
