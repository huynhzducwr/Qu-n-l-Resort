using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuanLyResort.Repository;

namespace QuanLyResort.Controllers
{
    [Route("servicedetail/{id}")]
    [ApiController]
    public class ServiceDetailsController : ControllerBase
    {
        private readonly ServicesRepository _productService; // Giả sử bạn đã định nghĩa IProductService

        public ServiceDetailsController(ServicesRepository productService)
        {
            _productService = productService; // Khởi tạo dịch vụ sản phẩm
        }
        [HttpGet]
        public IActionResult Index(int id)
        {
            var product = _productService.RetrieveServicesByIdAsync(id);
            if (product == null)
            {
                return NotFound("Room not found");
            }
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "html", "servicedetail.html"), "text/html");
        }
    }
}
