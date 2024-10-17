using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuanLyResort.DTOs.ServicesDTOs;
using QuanLyResort.Models;
using QuanLyResort.Repository;
using System.Net;

namespace QuanLyResort.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServicesController : ControllerBase
    {
        private readonly ServicesRepository _roomTypeRepository;
        private readonly ILogger<ServicesController> _logger;

        public ServicesController(ServicesRepository roomTypeRepository, ILogger<ServicesController> logger)
        {
            _roomTypeRepository = roomTypeRepository;
            _logger = logger;
        }

        [HttpGet("AllServices")]
        public async Task<APIResponse<List<ServicesDTO>>> GetAllSerivces(bool? IsActive = null)
        {
            _logger.LogInformation($"Request Received for GetAllRoomTypes, IsActive: {IsActive}");
            try
            {
                var users = await _roomTypeRepository.RetrieveAllServicesAsync(IsActive);

                return new APIResponse<List<ServicesDTO>>(users, "Retrieved all Room Types Successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error Retriving all Room Types");
                return new APIResponse<List<ServicesDTO>>(HttpStatusCode.InternalServerError, "Internal server error: " + ex.Message);
            }
        }

        [HttpGet("GetServicesByID/{ServicesID}")]
        public async Task<APIResponse<ServicesDTO>> GetServicesById(int RoomTypeID)
        {
            _logger.LogInformation($"Request Received for GetRoomTypeById, RoomTypeID: {RoomTypeID}");
            try
            {
                var roomType = await _roomTypeRepository.RetrieveServicesByIdAsync(RoomTypeID);
                if (roomType == null)
                {
                    return new APIResponse<ServicesDTO>(HttpStatusCode.NotFound, "RoomTypeID not found.");
                }

                return new APIResponse<ServicesDTO>(roomType, "RoomType fetched successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting Room Type by ID {RoomTypeID}", RoomTypeID);
                return new APIResponse<ServicesDTO>(HttpStatusCode.BadRequest, "Error fetching Room Type .", ex.Message);
            }
        }

        [HttpPost("AddServices")]
        public async Task<APIResponse<CreateServicesResponseDTO>> CreateServices([FromBody] CreateServicesDTO request)
        {
            _logger.LogInformation("Request Received for CreateRoomType: {@CreateRoomTypeDTO}", request);

            if (!ModelState.IsValid)
            {
                _logger.LogInformation("Invalid Data in the Request Body");
                return new APIResponse<CreateServicesResponseDTO>(HttpStatusCode.BadRequest, "Invalid Data in the Requrest Body");
            }

            try
            {
                var response = await _roomTypeRepository.CreateServices(request);
                _logger.LogInformation("CreateRoomType Response From Repository: {@CreateRoomTypeResponseDTO}", response);

                if (response.IsCreated)
                {
                    return new APIResponse<CreateServicesResponseDTO>(response, response.Message);
                }
                return new APIResponse<CreateServicesResponseDTO>(HttpStatusCode.BadRequest, response.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding new Room Type with Name {TypeName}", request.ServiceName);
                return new APIResponse<CreateServicesResponseDTO>(HttpStatusCode.InternalServerError, "Room Type Creation Failed.", ex.Message);
            }
        }

        [HttpPut("Update/{RoomTypeId}")]
        public async Task<APIResponse<UpdateServicesResponseDTO>> UpdateRoomType(int RoomTypeId, [FromBody] UpdateServicesDTO request)
        {
            _logger.LogInformation("Request Received for UpdateRoomType {@UpdateRoomTypeDTO}", request);
            if (!ModelState.IsValid)
            {
                _logger.LogInformation("UpdateRoomType Invalid Request Body");
                return new APIResponse<UpdateServicesResponseDTO>(HttpStatusCode.BadRequest, "Invalid Request Body");
            }
            if (RoomTypeId != request.ServicesID)
            {
                _logger.LogInformation("UpdateRoomType Mismatched Room Type ID");
                return new APIResponse<UpdateServicesResponseDTO>(HttpStatusCode.BadRequest, "Mismatched Room Type ID.");
            }
            try
            {
                var response = await _roomTypeRepository.UpdateServices(request);

                if (response.IsUpdated)
                {
                    return new APIResponse<UpdateServicesResponseDTO>(response, response.Message);
                }
                return new APIResponse<UpdateServicesResponseDTO>(HttpStatusCode.BadRequest, response.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error Updating Room Type {RoomTypeId}", RoomTypeId);
                return new APIResponse<UpdateServicesResponseDTO>(HttpStatusCode.InternalServerError, "Update Room Type Failed.", ex.Message);
            }
        }

        [HttpDelete("Delete/{RoomTypeId}")]
        public async Task<APIResponse<DeleteServicesResponseDTO>> DeleteRoomType(int RoomTypeId)
        {
            _logger.LogInformation($"Request Received for DeleteRoomType, RoomTypeId: {RoomTypeId}");
            try
            {
                var roomType = await _roomTypeRepository.RetrieveServicesByIdAsync(RoomTypeId);
                if (roomType == null)
                {
                    return new APIResponse<DeleteServicesResponseDTO>(HttpStatusCode.NotFound, "RoomType not found.");
                }

                var response = await _roomTypeRepository.DeleteServices(RoomTypeId);
                if (response.IsDeleted)
                {
                    return new APIResponse<DeleteServicesResponseDTO>(response, response.Message);
                }
                return new APIResponse<DeleteServicesResponseDTO>(HttpStatusCode.BadRequest, response.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting RoomType {RoomTypeId}", RoomTypeId);
                return new APIResponse<DeleteServicesResponseDTO>(HttpStatusCode.InternalServerError, "Internal server error: " + ex.Message);
            }
        }



        [HttpPost("ActiveInActive")]
        public async Task<IActionResult> ToggleActive(int RoomTypeId, bool IsActive)
        {
            try
            {
                var result = await _roomTypeRepository.ToggleServicesActiveAsync(RoomTypeId, IsActive);
                if (result.Success)
                    return Ok(new { Message = "RoomType activation status updated successfully." });
                else
                    return BadRequest(new { Message = result.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error toggling active status for RoomTypeId {RoomTypeId}", RoomTypeId);
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }


    }
}
