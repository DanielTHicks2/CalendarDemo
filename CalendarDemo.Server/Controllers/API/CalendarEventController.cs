using CalendarDemo.Server.Repo;
using CalendarDemo.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CalendarDemo.Server.Controllers.API
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CalendarEventController(
        ILogger<CalendarEventController> logger, 
        IBusinessService businessService, 
        ICalendarRepo calendarRepo) : ControllerBase
    {

        [Route("Search")]
        [HttpPost]
        public IActionResult Search([FromBody] CalendarSearch searchParams)
        {
            try 
            { 
                return Ok(calendarRepo.SearchCalendar(searchParams));
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return Problem("System exception");
            }
        }

        [HttpGet("{id}")]
        public IActionResult Get(long id)
        {
            try 
            { 
                return Ok(calendarRepo.GetCalendarEvent(id));
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return Problem("System exception");
            }
        }

        [HttpPost]
        public IActionResult Post([FromBody] CalendarEvent evt)
        {
            try
            {
                var result = businessService.AddCalendarEvent(evt);

                if (result == false)
                {
                    return NotFound();
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return Problem("System exception");
            }
        }

        [HttpPut("{id}")]
        public IActionResult Put(long id, [FromBody] CalendarEvent evt)
        {
            try 
            { 
                var result = businessService.EditCalendarEvent(id, evt);

                if (result == false)
                {
                    return NotFound();
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return Problem("System exception");
            }
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(long id)
        {
            try 
            { 
                var result = businessService.DeleteCalendarEvent(id);

                if(result == false)
                {
                    return NotFound();
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return Problem("System exception");
            }

        }
    }
}
