using Microsoft.Data.SqlClient;
using QuanLyResort.Connection;
using QuanLyResort.DTOs.ServicesDTOs;
using System.Data;

namespace QuanLyResort.Repository
{
    public class ServicesRepository
    {
        private readonly SqlConnectionFactory _connectionFactory;

        public ServicesRepository(SqlConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<List<ServicesDTO>> RetrieveAllServicesAsync(bool? IsActive)
        {
            using var connection = _connectionFactory.CreateConnection();

            var command = new SqlCommand("spGetAllServices", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@IsActive", (object)IsActive ?? DBNull.Value);

            await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();

            var roomTypes = new List<ServicesDTO>();

            while (reader.Read())
            {
                roomTypes.Add(new ServicesDTO
                {
                    ServicesID = reader.GetInt32("ServicesID"),
                    ServiceName = reader.GetString("ServiceName"),
      
                    Description1 = reader.GetString("Description1"),
                    Description2 = reader.GetString("Description2"),
                    Description3 = reader.GetString("Description3"),
                    IsActive = reader.GetBoolean("IsActive")
                });
            }

            return roomTypes;
        }

        public async Task<ServicesDTO> RetrieveServicesByIdAsync(int RoomTypeID)
        {
            using var connection = _connectionFactory.CreateConnection();

            var command = new SqlCommand("spGetServiceById", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@ServicesID", RoomTypeID);

            await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();


            if (!reader.Read())
            {
                return null;
            }

            var roomType = new ServicesDTO
            {
                ServicesID = reader.GetInt32("ServicesID"),
                ServiceName = reader.GetString("ServiceName"),

                Description1 = reader.GetString("Description1"),
                Description2 = reader.GetString("Description2"),
                Description3 = reader.GetString("Description3"),
                IsActive = reader.GetBoolean("IsActive")
            };

            return roomType;
        }

        public async Task<CreateServicesResponseDTO> CreateServices(CreateServicesDTO request)
        {
            CreateServicesResponseDTO createRoomTypeResponseDTO = new CreateServicesResponseDTO();

            using var connection = _connectionFactory.CreateConnection();
            var command = new SqlCommand("spCreateServices", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.Add(new SqlParameter("@ServiceName", request.ServiceName));
            command.Parameters.Add(new SqlParameter("@Description1", request.Description1));
            command.Parameters.Add(new SqlParameter("@Description2", request.Description2));
            command.Parameters.Add(new SqlParameter("@Description3", request.Description3));

            command.Parameters.Add(new SqlParameter("@CreatedBy", "System"));
            var outputId = new SqlParameter("@ServicesID", SqlDbType.Int) { Direction = ParameterDirection.Output };
            var statusCode = new SqlParameter("@StatusCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
            var message = new SqlParameter("@Message", SqlDbType.NVarChar, 255) { Direction = ParameterDirection.Output };

            command.Parameters.Add(outputId);
            command.Parameters.Add(statusCode);
            command.Parameters.Add(message);

            try
            {
                await connection.OpenAsync();
                await command.ExecuteNonQueryAsync();

                if ((int)statusCode.Value == 0)
                {
                    createRoomTypeResponseDTO.Message = message.Value.ToString();
                    createRoomTypeResponseDTO.IsCreated = true;
                    createRoomTypeResponseDTO.ServicesID = (int)outputId.Value;
                    return createRoomTypeResponseDTO;
                }

                createRoomTypeResponseDTO.Message = message.Value.ToString();
                createRoomTypeResponseDTO.IsCreated = false;

                return createRoomTypeResponseDTO;
            }
            catch (SqlException ex)
            {
                createRoomTypeResponseDTO.Message = ex.Message;
                createRoomTypeResponseDTO.IsCreated = false;
                return createRoomTypeResponseDTO;
            }
        }

        public async Task<UpdateServicesResponseDTO> UpdateServices(UpdateServicesDTO request)
        {
            UpdateServicesResponseDTO updateRoomTypeResponseDTO = new UpdateServicesResponseDTO()
            {
                ServicesID = request.ServicesID
            };

            using var connection = _connectionFactory.CreateConnection();
            var command = new SqlCommand("spUpdateRoomType", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.Add(new SqlParameter("@ServicesID", request.ServicesID));
            command.Parameters.Add(new SqlParameter("@ServiceName", request.ServiceName));
            command.Parameters.Add(new SqlParameter("@Description1", request.Description1));
            command.Parameters.Add(new SqlParameter("@Description2", request.Description2));
            command.Parameters.Add(new SqlParameter("@Description3", request.Description3));


            var statusCode = new SqlParameter("@StatusCode", SqlDbType.Int)
            {
                Direction = ParameterDirection.Output
            };
            var message = new SqlParameter("@Message", SqlDbType.NVarChar, 255)
            {
                Direction = ParameterDirection.Output
            };
            command.Parameters.Add(statusCode);
            command.Parameters.Add(message);

            try
            {
                await connection.OpenAsync();
                await command.ExecuteNonQueryAsync();
                updateRoomTypeResponseDTO.Message = message.Value.ToString();
                updateRoomTypeResponseDTO.IsUpdated = (int)statusCode.Value == 0;

                return updateRoomTypeResponseDTO;
            }
            catch (SqlException ex)
            {
                updateRoomTypeResponseDTO.Message = ex.Message;
                updateRoomTypeResponseDTO.IsUpdated = false;

                return updateRoomTypeResponseDTO;
            }
        }

        public async Task<DeleteServicesResponseDTO> DeleteServices(int RoomTypeID)
        {
            DeleteServicesResponseDTO deleteRoomTypeResponseDTO = new DeleteServicesResponseDTO();

            using var connection = _connectionFactory.CreateConnection();
            var command = new SqlCommand("spDeleteService", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.Add(new SqlParameter("@ServicesID", RoomTypeID));

            // Thêm các tham số đầu ra cho StatusCode và Message
            var statusCode = new SqlParameter("@StatusCode", SqlDbType.Int)
            {
                Direction = ParameterDirection.Output
            };
            var message = new SqlParameter("@Message", SqlDbType.NVarChar, 255)
            {
                Direction = ParameterDirection.Output
            };

            command.Parameters.Add(statusCode);
            command.Parameters.Add(message);

            try
            {
                await connection.OpenAsync();
                await command.ExecuteNonQueryAsync();

                deleteRoomTypeResponseDTO.Message = message.Value.ToString();
                deleteRoomTypeResponseDTO.IsDeleted = (int)statusCode.Value == 0;

                return deleteRoomTypeResponseDTO;
            }
            catch (SqlException ex)
            {
                deleteRoomTypeResponseDTO.Message = ex.Message;
                deleteRoomTypeResponseDTO.IsDeleted = false;

                return deleteRoomTypeResponseDTO;
            }
        }



        public async Task<(bool Success, string Message)> ToggleServicesActiveAsync(int RoomTypeID, bool IsActive)
        {
            using var connection = _connectionFactory.CreateConnection();
            using var command = new SqlCommand("spToggleServicesActive", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.Add(new SqlParameter("@ServicesID", RoomTypeID));
            command.Parameters.AddWithValue("@IsActive", IsActive);
            var statusCode = new SqlParameter("@StatusCode", SqlDbType.Int)
            {
                Direction = ParameterDirection.Output
            };
            var message = new SqlParameter("@Message", SqlDbType.NVarChar, 255)
            {
                Direction = ParameterDirection.Output
            };

            command.Parameters.Add(statusCode);
            command.Parameters.Add(message);

            await connection.OpenAsync();
            await command.ExecuteNonQueryAsync();

            var ResponseMessage = message.Value.ToString();
            var success = (int)statusCode.Value == 0;

            return (success, ResponseMessage);
        }
    }
}
