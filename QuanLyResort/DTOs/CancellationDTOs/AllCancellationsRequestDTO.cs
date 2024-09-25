using System.ComponentModel.DataAnnotations;

namespace QuanLyResort.DTOs.CancellationDTOs
{
    public class AllCancellationsRequestDTO
    {
        [StringLength(50, ErrorMessage = "Status length cannot exceed 50 characters.")]
        public string? Status { get; set; }

        [DataType(DataType.Date)]
        public DateTime? DateFrom { get; set; }

        [DataType(DataType.Date)]
        public DateTime? DateTo { get; set; }
    }
}