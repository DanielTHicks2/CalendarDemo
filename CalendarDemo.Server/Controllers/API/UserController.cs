using Microsoft.AspNetCore.Mvc;
using CalendarDemo.Server.Repo;
using Microsoft.AspNetCore.Authorization;

namespace CalendarDemo.Server.Controllers.API
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController(
        ILogger<UserController> logger, 
        IUserRepo userRepo) : ControllerBase
    {
        
        [HttpGet]
        public IActionResult Get()
        {
            try 
            {
                logger.LogDebug("Users retrieved!");
                return Ok(userRepo.GetAllUsers());
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return Problem("System exception");
            }
        }

    }
}
