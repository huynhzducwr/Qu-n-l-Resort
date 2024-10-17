using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace QuanLyResort.Controllers
{
    [Route("room")]
    [ApiController]
    public class AllRoomController : ControllerBase
    {
        [HttpGet]
        public IActionResult Index()
        {
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "html", "room.html"), "text/html");
        }
    }
}
