using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuanLyResort.Repository;

namespace QuanLyResort.Controllers
{
    [Route("roomdetail/{id}")]
    [ApiController]
    public class RoomDetailController : ControllerBase
    {
        private readonly RoomRepository _productService; // Giả sử bạn đã định nghĩa IProductService

        public RoomDetailController(RoomRepository productService)
        {
            _productService = productService; // Khởi tạo dịch vụ sản phẩm
        }
        [HttpGet]
        public IActionResult Index(int id)
        {
            var product = _productService.GetRoomByIdAsync(id);
            if (product == null)
            {
                return NotFound("Room not found");
            }
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "html", "roomdetail.html"), "text/html");
        }
    }
}
