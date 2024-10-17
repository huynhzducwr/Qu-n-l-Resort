namespace QuanLyResort.DTOs.UserDTOs
{
    public class UserResponseDTO
    {
        public int UserID { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }    
        public string RoleName {  get; set; }
        public bool IsActive { get; set; }
        public DateTime? LastLogin { get; set; }
        public int RoleID { get; set; }
    }
}

