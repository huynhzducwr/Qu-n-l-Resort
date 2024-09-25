using System.ComponentModel.DataAnnotations;

namespace QuanLyResort.DTOs.RoomAmenityDTOs
{
    public class RoomAmenitiesBulkInsertUpdateDTO
    {
        [Required]
        public int RoomTypeID { get; set; }
        [Required]
        public List<int> AmenityIDs { get; set; }
    }
}