using System.ComponentModel.DataAnnotations;

namespace QuanLyResort.DTOs.RoomAmenityDTOs
{
    public class RoomAmenitiesBulkInsertUpdateDTO
    {
        [Required]
        public int RoomID { get; set; }
        [Required]
        public List<int> AmenityIDs { get; set; }
    }
}