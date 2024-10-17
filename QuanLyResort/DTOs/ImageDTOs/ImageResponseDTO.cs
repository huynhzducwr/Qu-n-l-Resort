using System.ComponentModel.DataAnnotations;

namespace QuanLyResort.DTOs.ImageDTOs
{
    public class ImageResponseDTO
    {

        [Required]
        public int ImageID { get; set; }

        [Required]
        public int RoomID { get; set; }

        [Required]
        public string ImageURL { get; set; } // Use string for the image URL

        public string RoomNumber { get; set; }

    }
}
