namespace QuanLyResort.DTOs.RoomDTOs
{
    public class RoomDetailsResponseDTO
    {
        public int RoomID { get; set; }
        public string RoomNumber { get; set; }
        public int RoomTypeID { get; set; }
        public decimal Price { get; set; }
        public string BedType { get; set; }
        public string RoomSize { get; set; }
        public string ViewType { get; set; }
        public string Wifi {  get; set; }
        public string Breakfast {  get; set; }
        public string CableTV {  get; set; }
        public string TransitCar {  get; set; }
        public string Bathtub { get; set; }
        public string PetsAllowed {  get; set; }
        public string RoomService {  get; set; }
        public string Iron {  get; set; }
        public int People { get; set; }
        public string Status { get; set; }
        public bool IsActive { get; set; }
    }
}