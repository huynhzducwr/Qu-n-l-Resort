async function fetchAllRoomType(isActive = null) {
    let url = '/api/RoomType/AllRoomTypes';
    if (isActive !== null) {
        url += `?isActive=${isActive}`;
    }

    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json(); // Parse JSON data from API
            console.log("Fetched Room Types:", data);

            // Select the room types list element
            const roomTypesList = document.querySelector('.room-types');
            roomTypesList.innerHTML = ''; // Clear existing items

            // Loop through the fetched room types and create list items
            data.data.forEach(roomType => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<a href="#">${roomType.typeName}</a>`; // Assuming typeName contains the room type name
                roomTypesList.appendChild(listItem); // Append the list item to the room types list
            });

            return data; // Return room type data
        } else {
            console.error("Error fetching Room Types:", response.statusText);
            return []; // Return an empty array if there is an error
        }
    } catch (error) {
        console.error("Network error:", error);
        return []; // Return an empty array if there is a network error
    }
}


async function fetchImageRoom(roomID) {
    const url = `/api/Image/all`;
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            console.log("Fetched Image Room:", data);

            // Filter images by roomID
            const roomImages = data.filter(image => image.roomID === roomID);
            console.log("Filtered Images for roomID", roomID, ":", roomImages);

            // Check if images are available
            if (roomImages.length > 0) {
                // Set the main image to the first filtered image
                document.getElementById('main-image').src = roomImages[0].imageURL;
                console.log("Main image set to:", roomImages[0].imageURL);

                // Populate thumbnails
                const thumbnailContainer = document.querySelector('.thumbnail-container');
                thumbnailContainer.innerHTML = ''; // Clear existing thumbnails

                roomImages.forEach(image => {
                    const imgElement = document.createElement('img');
                    imgElement.classList.add('lengthh');
                    imgElement.src = image.imageURL;
                    imgElement.onclick = () => changeMainImage(imgElement);
                    thumbnailContainer.appendChild(imgElement);
                    console.log("Thumbnail added:", image.imageURL);
                });
            } else {
                console.log("No images found for the specified roomID.");
            }
            return roomImages;
        } else {
            console.error("Error fetching Image Amenity:", response.statusText);
            return [];
        }
    } catch (error) {
        console.error("Network error:", error);
        return [];
    }
}



async function fetchRoomType(roomID) {
    const url = `/api/RoomType/GetRoomType/${roomID}`;
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json(); // Parse JSON data from API
            console.log("Fetched Room Types:", data);

            document.getElementById('roomtypee').textContent = data.data.typeName; // Set room type name in header
            document.querySelector('.titlee').textContent = data.data.typeName; // Update title text


            return data;
        } else {
            console.error("Error fetching Room Types:", response.statusText);
            return [];
        }
    } catch (error) {
        console.error("Network error:", error);
        return [];
    }
}


async function fetchRoom(roomID) {
    const url = `/api/Room/${roomID}`; 



    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json(); // Parse JSON data from API
            console.log("Fetched Room:", data);
            fetchRoomType(data.data.roomTypeID);
            document.querySelector('.price-section .price').textContent = `$${data.data.price || "N/A"}`;
            const amenitiesSection = document.querySelector('.amenities-grid');
            amenitiesSection.innerHTML = ''; // Clear existing amenities

            const amenities = [
                { icon: 'fas fa-bed', name: 'Bed', description: data.data.bedType || 'N/A' },
                { icon: 'fas fa-users', name: 'People', description: data.data.people || 'N/A' },
                { icon: 'fas fa-expand', name: 'Room Size', description: data.data.roomSize || 'N/A' },
                { icon: 'fas fa-eye', name: 'View', description: data.data.viewType || 'N/A' },
                { icon: 'fas fa-wifi', name: 'Wifi', description: data.data.wifi || 'N/A' },
                { icon: 'fas fa-coffee', name: 'Breakfast', description: data.data.breakfast || 'N/A' },
                { icon: 'fas fa-tv', name: 'Cable TV', description: data.data.cableTV || 'N/A' },
                { icon: 'fas fa-car', name: 'Transit Car', description: data.data.transitCar || 'N/A' },
                { icon: 'fas fa-bath', name: 'Bathtub', description: data.data.bathtub || 'N/A' },
                { icon: 'fas fa-paw', name: 'Pets Allowed', description: data.data.petsAllowed || 'N/A' },
                { icon: 'fas fa-concierge-bell', name: 'Room Service', description: data.data.roomService || 'N/A' },
                { icon: 'fas fa-iron', name: 'Iron', description: data.data.iron || 'N/A' },
            ];
            amenities.forEach(amenity => {
                const amenityItem = document.createElement('div');
                amenityItem.classList.add('amenity-item');
                amenityItem.innerHTML = `
                    <i class="${amenity.icon}"></i>
                    <p><strong>${amenity.name}</strong><br>${amenity.description}</p>
                `;
                amenitiesSection.appendChild(amenityItem);
            });


            return data;
        } else {
            console.error("Error fetching rooms:", response.statusText);
        }
    } catch (error) {
        console.error("Network error:", error);
    }
}



window.onload = async function () {
    // Lấy productId từ URL (ví dụ như productdetail/5)
    const urlParts = window.location.pathname.split('/');
    const productId = parseInt(urlParts[urlParts.length - 1], 10);

    fetchImageRoom(productId);
    fetchRoom(productId);
    fetchAllRoomType();



};