
using QuanLyResort.CustomValidator;
using System.ComponentModel.DataAnnotations;

namespace QuanLyResort.DTOs.HotelSearchDTOs
{
    public class CustomHotelSearchCriteriaDTO
    {
        [Range(0, double.MaxValue, ErrorMessage = "Minimum price must be greater than or equal to 0.")]
        public decimal? MinPrice { get; set; }
        [PriceRangeValidation("MinPrice", "MaxPrice")]
        public decimal? MaxPrice { get; set; }

        [StringLength(50, ErrorMessage = "Room type name length cannot exceed 50 characters.")]
        public string? RoomTypeName { get; set; }


        [StringLength(50, ErrorMessage = "View type name length cannot exceed 50 characters.")]
        public string? ViewType { get; set; }
    }
}