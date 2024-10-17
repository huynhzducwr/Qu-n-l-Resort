using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace QuanLyResort.Controllers
{
    [Route("services")]
    [ApiController]
    public class ViewServicesController : ControllerBase
    {
        [HttpGet]
        public IActionResult Index()
        {
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "html", "services.html"), "text/html");
        }
    }
}




