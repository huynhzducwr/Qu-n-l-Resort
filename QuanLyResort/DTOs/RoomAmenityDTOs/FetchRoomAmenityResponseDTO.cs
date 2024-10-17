namespace QuanLyResort.DTOs.RoomAmenityDTOs
{
    public class FetchRoomAmenityResponseDTO
    {
        public int RoomID { get; set; }
        public string RoomNumber { get; set; }
        public string Description { get; set; }
        public string AccessibilityFeatures { get; set; }
        public bool IsActive { get; set; }
    }
}