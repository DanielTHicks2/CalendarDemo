using CalendarDemo.Server.Models;
using Microsoft.AspNetCore.Mvc;
using CalendarDemo.Server.Helpers;

namespace CalendarDemo.Server.Controllers.API
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController(
        ILogger<AuthenticationController> logger,
        IAuthenticationHelper authenticationHelper,
        IBusinessService businessService) : ControllerBase
    {

        [Route("login")]
        [HttpPost]
        public IActionResult Login([FromBody] UserLogin userCred)
        {
            try
            { 
                if (userCred != null)
                {
                    var userLoggedIn = businessService.GetUserByLogin(userCred);
                    if (userLoggedIn != null)
                    {
                        var token = authenticationHelper.GenerateToken(userLoggedIn);
                        HttpContext.Session.SetObject("CurrentUser", userLoggedIn);

                        logger.LogDebug($"{userLoggedIn.UserName} successfully logged in.");

                        return Ok(new { User = userLoggedIn, Token = token });
                    }
                }

                return NotFound();
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return Problem("System exception");
            }
        }

        [Route("logout")]
        [HttpGet]
        public IActionResult Logout()
        {
            HttpContext.Session.SetObject("CurrentUser", null);
            return Ok(true);
        }

    }
}
