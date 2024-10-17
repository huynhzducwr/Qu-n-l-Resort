using System.ComponentModel.DataAnnotations;

namespace QuanLyResort.DTOs.ImageDTOs
{
    public class UploadImageDTO
    {
        [Required]
        public int RoomID { get; set; }

        public string RoomNumber { get; set; }
    
        [Required]
        public IFormFile ImageFile { get; set; } // Tệp hình ảnh
    }
}
