using System.ComponentModel.DataAnnotations;

namespace QuanLyResort.DTOs.ImageAmenityDTOs
{
    public class ImageResponseDTO
    {

        [Required]
        public int ImageID { get; set; }

        [Required]
        public int ServicesID { get; set; }

        [Required]
        public string ImageURL { get; set; } // Use string for the image URL

        public string ServicesName { get; set; }
    }
}
