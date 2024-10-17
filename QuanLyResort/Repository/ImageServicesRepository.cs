using Microsoft.Data.SqlClient;
using QuanLyResort.Connection;
using System.Data;
using QuanLyResort.DTOs.ImageAmenityDTOs;

namespace QuanLyResort.Repository
{
    public class ImageServicesRepository
    {
        private readonly SqlConnectionFactory _connectionFactory;
        private readonly string _imageFolderPath;

        public ImageServicesRepository(SqlConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
            _imageFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "src");
            Directory.CreateDirectory(_imageFolderPath); // Tạo thư mục nếu không tồn tại
        }

        public async Task<UploadImageResponseDTO> UploadImageForAmenityAsync(UploadImageDTO uploadImageDTO)
        {
            UploadImageResponseDTO responseDTO = new UploadImageResponseDTO();

            if (uploadImageDTO.ImageFile.Length > 0)
            {
                var fileName = Guid.NewGuid() + Path.GetExtension(uploadImageDTO.ImageFile.FileName);
                var filePath = Path.Combine(_imageFolderPath, fileName);

                // Lưu hình ảnh vào thư mục
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await uploadImageDTO.ImageFile.CopyToAsync(stream);
                }

                // Tạo URL cho hình ảnh đã lưu
                var imageUrl = $"/src/{fileName}";

                // Lưu vào cơ sở dữ liệu
                using var connection = _connectionFactory.CreateConnection();
                using var command = new SqlCommand("spUploadImageForServices", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.AddWithValue("@ServicesID", uploadImageDTO.ServicesID);
                command.Parameters.AddWithValue("@ImageURL", imageUrl);

                await connection.OpenAsync();
                var result = await command.ExecuteScalarAsync();

                if (result != null)
                {
                    responseDTO.Message = result.ToString();
                    responseDTO.IsSuccess = true;
                }
                else
                {
                    responseDTO.Message = "Tải hình ảnh không thành công.";
                    responseDTO.IsSuccess = false;
                }
            }
            else
            {
                responseDTO.Message = "Không có tệp nào được tải lên.";
                responseDTO.IsSuccess = false;
            }

            return responseDTO;
        }

        public async Task<IEnumerable<ImageDTO>> GetAllImagesAsync()
        {
            var images = new List<ImageDTO>();

            using var connection = _connectionFactory.CreateConnection();
            using var command = new SqlCommand("spGetAllImagesServices", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                images.Add(new ImageDTO
                {
                    ImageID = reader.GetInt32(0), // ID của hình ảnh
                    ServicesID = reader.GetInt32(1), // ID của sản phẩm liên quan
                    ImageURL = reader.GetString(2),
                    ServicesName = reader.GetString(3)
                });
            }

            return images;
        }


        //public async Task<DeleteImageResponseDTO> DeleteImageAsync(int imageID)
        //{
        //    DeleteImageResponseDTO responseDTO = new DeleteImageResponseDTO();

        //    using var connection = _connectionFactory.CreateConnection();
        //    using var command = new SqlCommand("spDeleteImage", connection)
        //    {
        //        CommandType = CommandType.StoredProcedure
        //    };

        //    command.Parameters.AddWithValue("@ImageID", imageID);

        //    await connection.OpenAsync();
        //    var result = await command.ExecuteScalarAsync(); // Sử dụng ExecuteScalar để lấy thông điệp kết quả

        //    if (result != null)
        //    {
        //        responseDTO.Message = result.ToString();
        //        responseDTO.IsDeleted = true;
        //    }
        //    else
        //    {
        //        responseDTO.Message = "Hình ảnh không tồn tại.";
        //        responseDTO.IsDeleted = false;
        //    }

        //    return responseDTO;
        //}
    }
}
