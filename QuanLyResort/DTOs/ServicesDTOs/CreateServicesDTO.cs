using System.ComponentModel.DataAnnotations;

namespace QuanLyResort.DTOs.ServicesDTOs
{
    public class CreateServicesDTO
    {
        [Required]
        public string ServiceName { get; set; }
        public string Description1 {  get; set; }
        public string Description2 { get; set; }
        public string Description3 {  get; set; }
    }
}
