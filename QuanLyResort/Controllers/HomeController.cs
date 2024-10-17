using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace QuanLyResort.Controllers
{
    [Route("home")]
    public class HomeController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "html", "home.html"), "text/html");
        }
    }
}
