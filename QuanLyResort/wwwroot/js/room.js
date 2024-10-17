async function fetchImageRoom() {
    let url = '/api/Image/all'; // API endpoint to fetch images
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json(); // Parse JSON data from API
            console.log("Fetched Image Room:", data); // Log fetched image data for verification
            return data; // Return the fetched image data
        } else {
            console.error("Error fetching Image Amenity:", response.statusText);
            return []; // Return an empty array if there is an error
        }
    } catch (error) {
        console.error("Network error:", error);
        return []; // Return an empty array if there is a network error
    }
}



async function fetchRoomType(isActive = null) {
    let url = '/api/RoomType/AllRoomTypes';
    if (isActive !== null) {
        url += `?isActive=${isActive}`;
    }

    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json(); // Parse JSON data from API
            console.log("Fetched Room Types:", data);
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

async function fetchRoom(isActive = null) {
    let url = '/api/Room/All';
    if (isActive !== null) {
        url += `?isActive=${isActive}`;
    }

    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json(); // Parse JSON data from API
            console.log("Fetched Rooms:", data);
            const rooms = data.data;

            const roomTypeData = await fetchRoomType(); // Fetch room types
            const imageRoom = await fetchImageRoom(); // Fetch images

            const roomTypes = roomTypeData.data; // Ensure you're getting the right array

            renderRoom(rooms, roomTypes, imageRoom); // Call render function with correct data
        } else {
            console.error("Error fetching rooms:", response.statusText);
        }
    } catch (error) {
        console.error("Network error:", error);
    }
}




function renderRoom(rooms, roomTypes, imageRoom) {
    const containerRoom = document.querySelector('.rooms'); // Select the room container

    // Clear the container before rendering
    containerRoom.innerHTML = '';

    // Check if room data exists
    if (!Array.isArray(rooms) || rooms.length === 0) {
        containerRoom.innerHTML = '<p>No rooms available to display.</p>';
        return;
    }

    // Render rooms along with their corresponding room type and images
    rooms.forEach(room => {
        // Find the corresponding room type for the room
        const roomType = roomTypes.find(type => type.roomTypeID === room.roomTypeID);

        // Find the corresponding image for the room
        const imageData = imageRoom.find(image => image.roomID === room.roomID);

        // Create the HTML for each room
        const roomHTML = `
        <div class="container-img1">
            <img src="${imageData ? imageData.imageURL : '/src/default-image.png'}" alt="${roomType ? roomType.typeName : 'Room'}">
            <p class="room-title1">${roomType ? roomType.typeName : 'Unknown Room Type'}</p>
            <p class="description">${roomType ? roomType.description : 'No description available'}</p>
            <span class="price">$${room.price} From/Per Night</span>
        </div>
        `;

        // Append the room HTML to the container
        containerRoom.insertAdjacentHTML('beforeend', roomHTML);
    });
}


document.addEventListener('DOMContentLoaded', () => {

    fetchRoom();
});
