﻿using System.ComponentModel.DataAnnotations;

namespace QuanLyResort.DTOs.RoomAmenityDTOs
{
    public class RoomAmenityDTO
    {
        [Required]
        public int RoomID { get; set; }
        [Required]
        public int AmenityID { get; set; }
    }
}