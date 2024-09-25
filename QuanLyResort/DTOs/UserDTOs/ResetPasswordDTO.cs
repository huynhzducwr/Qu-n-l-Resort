using System.ComponentModel.DataAnnotations;

namespace QuanLyResort.DTOs.UserDTOs
{
    public class ResetPasswordDTO
    {
        [Required(ErrorMessage = "Token is required")]
        public string Token { get; set; }

        [Required(ErrorMessage = "New password is required")]
        public string NewPassword { get; set; }
    }
}
