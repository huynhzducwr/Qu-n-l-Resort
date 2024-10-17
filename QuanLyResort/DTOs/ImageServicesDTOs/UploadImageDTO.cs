using System.ComponentModel.DataAnnotations;

namespace QuanLyResort.DTOs.ImageAmenityDTOs
{
    public class UploadImageDTO
    {
        [Required]
        public int ServicesID { get; set; }

        public string ServicesName { get; set; }

        [Required]
        public IFormFile ImageFile { get; set; } // Tệp hình ảnh
    }
}
