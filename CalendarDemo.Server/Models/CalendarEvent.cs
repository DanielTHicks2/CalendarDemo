using System.ComponentModel.DataAnnotations;

namespace CalendarDemo.Server.Models
{
    
    public class CalendarEvent
    {
 
        public long EventID { get; set; }

        [Required]
        public long EventOwnerID { get; set; }

        [Required]
        public string EventStartDateTime { get; set; }

        [Required]
        public string EventEndDateTime { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        public string EventOwnerFirstName { get; set; }

        public string EventOwnerLastName { get; set; }

    }

    public class CalendarSearch
    {
        public long EventOwnerID { get; set; }
        public string Title { get; set; }
        
        public string StartDateTime { get; set; }
        public string EndDateTime { get; set; }
    }

}
