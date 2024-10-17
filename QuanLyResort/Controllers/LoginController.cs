using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace QuanLyResort.Controllers
{
    [Route("Account")]
    [ApiController]
    public class LoginController : ControllerBase
    {

        [HttpGet]
        public IActionResult Index()
        {
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "html", "login.html"), "text/html");
        }
    }
}
