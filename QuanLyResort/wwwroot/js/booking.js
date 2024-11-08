

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
async function increaseGuestCount(guestType) {
    const input = document.getElementById(guestType);
    let currentValue = parseInt(input.value);

    // Set a maximum limit if needed, e.g., 5 for each type
    if (currentValue < 5) {
        input.value = currentValue + 1;
    }
}

async function decreaseGuestCount(guestType) {
    const input = document.getElementById(guestType);
    let currentValue = parseInt(input.value);

    // Prevent the count from going below 0
    if (currentValue > 0) {
        input.value = currentValue - 1;
    }
}


async function fetchRoom(viewType = '', sortPrice = '', minPrice = '', maxPrice = '') {
    const localStorageKey = 'roomsData'; // Key for storing rooms in localStorage
    let rooms;

    // Check if rooms data already exists in localStorage
    const storedRooms = localStorage.getItem(localStorageKey);
    if (storedRooms) {
        rooms = JSON.parse(storedRooms);
        console.log('Loaded rooms from localStorage:', rooms);
    } else {
        let url = '/api/Room/All';

        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                rooms = data.data;
                console.log('Fetched rooms:', rooms);

                // Store fetched rooms in localStorage
                localStorage.setItem(localStorageKey, JSON.stringify(rooms));

                console.log('Available room view types:', rooms.map(room => room.viewType));
            } else {
                console.error("Error fetching rooms:", response.statusText);
                return; // Exit the function if there is an error
            }
        } catch (error) {
            console.error("Network error:", error);
            return; // Exit the function if there is a network error
        }
    }

    // Apply filters
    if (viewType) {
        const normalizedViewType = viewType.toLowerCase();
        rooms = rooms.filter(room => room.viewType.toLowerCase() === normalizedViewType);
        console.log('Filtered by viewType:', rooms);
    }
    if (minPrice) {
        rooms = rooms.filter(room => room.price >= parseInt(minPrice));
        console.log('Filtered by minPrice:', rooms);
    }
    if (maxPrice) {
        rooms = rooms.filter(room => room.price <= parseInt(maxPrice));
        console.log('Filtered by maxPrice:', rooms);
    }

    // Sort rooms by price
    if (sortPrice === 'low-high') {
        rooms.sort((a, b) => a.price - b.price);
        console.log('Sorted by low-high:', rooms);
    } else if (sortPrice === 'high-low') {
        rooms.sort((a, b) => b.price - a.price);
        console.log('Sorted by high-low:', rooms);
    }

    const roomTypeData = await fetchRoomType();
    const imageRoom = await fetchImageRoom();

    const roomTypes = roomTypeData.data;
    renderRoom(rooms, roomTypes, imageRoom); // Render rooms with filtered data
}
async function CreateReservation() {
    let url = '/api/Reservation/CreateReservation';

    // Lấy thông tin từ localStorage và frontend
    const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
    const checkInDate = localStorage.getItem('checkin');
    const checkOutDate = localStorage.getItem('checkout');
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
    const totalAmount = localStorage.getItem('totalAmount');
    console.log('total amount:', totalAmount);
    const adults = parseInt(document.getElementById('adults').value);
    const children = parseInt(document.getElementById('children').value);
    const infants = parseInt(document.getElementById('infants').value);
    console.log("Check-in Date:", checkInDate);
    console.log("Check-out Date:", checkOutDate);
    const totalPeople = rooms.reduce((total, room) => total + (room.people || 0), 0);

    if (rooms.length === 0) {
        showAlert(`Vui lòng chọn phòng bạn muốn đặt cho chuyến đi này.`);
        return;
    }

    if (!checkInDate) {
        showAlert(`Vui lòng chọn ngày đặt phòng.`);
        return;
    }

    if (!checkOutDate) {
        showAlert(`Vui lòng chọn ngày trả phòng.`);
        return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Đặt giờ phút giây về 0 để chỉ lấy ngày hiện tại
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    checkIn.setHours(0, 0, 0, 0);
    checkOut.setHours(0, 0, 0, 0);



    if (checkIn <= today) {
        showAlert(`Ngày check-in phải lớn hơn ngày hôm nay.`);
        console.log("Điều kiện thất bại: Ngày check-in phải lớn hơn ngày hôm nay.");
        return;
    }

    if (checkOut <= checkIn) {
        showAlert(`Ngày check-out phải lớn hơn ngày check-in.`);

        return;
    }

    if (!userInfo.userId) {
        showAlert(`Vui lòng đăng nhập trước khi đặt phòng.`);
        return;
    }

    // Check if at least one guest is selected
    if (adults + children + infants === 0) {
        showAlert(`Vui lòng chọn số lượng khách.`);
        return;
    }

    if (parseInt(adults + children + infants) > totalPeople) {
        showAlert(`Số lượng khách không được vượt quá ${totalPeople} người.`);
        return;
    }

    const roomIDs = rooms.map(room => room.roomID);

    // Chuẩn bị dữ liệu API theo định dạng yêu cầu
    const params = {
        userID: userInfo.userId,
        roomIDs: roomIDs,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        adult: parseInt(adults),
        child: parseInt(children),
        infant: parseInt(infants)
    };

    try {
        // Gửi request POST tới API để tạo đặt phòng
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(params)
        });

        const data = await response.json();

        if (response.ok && data.success) {
            showSuccessAlert('Đặt phòng thành công');
            console.log("Đặt phòng thành công:", data);

            // Update room status to "Occupied" after successful reservation
            const allRooms = JSON.parse(localStorage.getItem('roomsData')) || [];
            rooms.forEach(room => {
                const roomToUpdate = allRooms.find(r => r.roomID === room.roomID);
                if (roomToUpdate && roomToUpdate.status === "Available") {
                    roomToUpdate.status = "Occupied";
                }
            });

            localStorage.setItem('reservationID', data.data.reservationID);

            window.location.href = `payment.html?reservationID=${data.data.reservationID}&totalAmount=${totalAmount}`;
            localStorage.setItem('roomsData', JSON.stringify(allRooms));
            fetchRoom();

            return data;
        } else {
            console.error("Lỗi khi tạo đặt phòng:", response.status, response.statusText);
            const errorMessage = data.message || 'Đặt phòng không thành công';
            console.error("Chi tiết lỗi:", errorMessage);
            showAlert('Phòng này đã được đặt');
            return null;
        }
    } catch (error) {
        console.error("Lỗi mạng:", error);
        return null;
    }
}


async function CalculateRoomCost() {
    // Define API URL
    let url = '/api/Reservation/CalculateRoomCosts';


    // Get rooms, check-in, and check-out data from local storage
    const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
    const checkInDate = localStorage.getItem('checkin');
    const checkOutDate = localStorage.getItem('checkout');

    // Ensure check-in and check-out dates are in the format 'YYYY-MM-DD'
    if (!checkInDate || !checkOutDate) {
        console.error("Check-in or Check-out date is missing");
        return;
    }

    // Extract roomIDs from the rooms array
    const roomIDs = rooms.map(room => room.roomID);

    // Prepare API parameters in the expected format
    const params = {
        roomIDs: roomIDs,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate
    };

    try {
        // Send POST request with parameters
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/plain' // Match the 'accept' header in your API example
            },
            body: JSON.stringify(params)
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Calculate: ", data);
            localStorage.setItem('gst', data.data.gst);
            localStorage.setItem('totalAmount', data.data.totalAmount);
            displayCartRooms(); // This will now use the updated data
            return data;
        } else {
            console.error("Error calculate:", response.status, response.statusText);
            const errorText = await response.text(); // Retrieve error details from the response
            console.error("Response Error Details:", errorText);
            return []; // Return an empty array if there is an error
        }
    } catch (error) {
        console.error("Network error:", error);
        return [];
    }
}


function renderRoom(rooms, roomTypes, imageRoom) {
    const containerRoom = document.querySelector('.room-info');
    containerRoom.innerHTML = ''; // Clear the container before rendering

    if (!Array.isArray(rooms) || rooms.length === 0) {
        containerRoom.innerHTML = '<p>No rooms available to display.</p>';
        return;
    }

    const displayedTypes = new Set();
    const roomTypeCounts = {}; // Object to keep track of room counts

    // First pass: Count the number of available rooms for each type
    rooms.forEach(room => {
        const roomType = roomTypes.find(type => type.roomTypeID === room.roomTypeID);
        if (roomType && room.status === "Available") {
            // Increment the count for this room type only if it's available
            roomTypeCounts[roomType.typeName] = (roomTypeCounts[roomType.typeName] || 0) + 1;
        }
    });

    // Second pass: Render rooms
    rooms.forEach(room => {
        const roomType = roomTypes.find(type => type.roomTypeID === room.roomTypeID);
        if (!roomType || displayedTypes.has(roomType.typeName)) return;

        displayedTypes.add(roomType.typeName);

        const imageData = imageRoom.find(image => image.roomID === room.roomID);
        const availableCount = roomTypeCounts[roomType.typeName] || 0; // Get the available count (default to 0)

        const roomHTML = `
            <div class="room-container">
                <div class="room-image">
                    <img src="${imageData ? imageData.imageURL : '/src/default-image.png'}" alt="${roomType.typeName}" style="width: 100%; height: auto;">
                </div>
                <div class="room-detail">
                    <h3 class="title-room">${roomType.typeName}</h3>
                    <div class="additional-info">
                        <p>${room.people || '1'} <strong> Người</strong></p>
                        <p>${room.roomSize || 'N/A'}</p>
                    </div>
                    <p style="margin-left: auto;">Còn lại ${availableCount} phòng</p> <!-- Display available count -->
                    <p style="margin-left: auto;">Giá: ${room.price}đ / đêm</p>
                    <button class="select-button" data-room='${JSON.stringify(room)}'>Chọn</button>
                </div>
            </div>
        `;

        containerRoom.insertAdjacentHTML('beforeend', roomHTML);
    });

    // Add event listeners to each "Select" button
    containerRoom.querySelectorAll('.select-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const roomData = JSON.parse(e.target.getAttribute('data-room'));
            const roomType = roomTypes.find(type => type.roomTypeID === roomData.roomTypeID);
            addRoomToCart(roomData,roomType);
        });
    });
}


function addRoomToCart(room, roomType) {
    const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
    const allRooms = JSON.parse(localStorage.getItem('roomsData')) || [];

    // Create a new object to store room and roomType together
    const roomWithType = { ...room, roomType }; // Combine room data with roomType

    // Filter for available rooms of the same roomTypeID and matching roomType properties
    const availableRooms = allRooms.filter(r =>
        r.roomTypeID === roomType.roomTypeID && // Match roomTypeID
        r.status === "Available" // Ensure the room is available
    );

    console.log(availableRooms); // Log available rooms for debugging

    if (availableRooms.length === 0) {
        showAlert('No available rooms of this type.');
        return;
    }

    // Select a random room from the available rooms
    const randomRoom = availableRooms[Math.floor(Math.random() * availableRooms.length)];

    // Include roomType in the selected room
    const roomToAdd = { ...randomRoom, roomType }; // Include the roomType in the selected room object

    // Check if the room is already in the cart based on a unique identifier, e.g., roomID
    const existingRoom = rooms.find(r => r.roomID === roomToAdd.roomID);
    if (!existingRoom) {
        rooms.push(roomToAdd); // Add the combined room object if it doesn't already exist
    } else {
        alert('Room already added to cart.'); // Alert if the room is already in the cart
    }

    // Save the updated rooms to localStorage
    localStorage.setItem('rooms', JSON.stringify(rooms)); // Save cart to localStorage
    CalculateRoomCost();
    displayCartRooms(); // Re-render the cart
}



function removeRoomFromCart(roomID) {
    // Get the current cart from localStorage
    const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
    console.log("Stored Room IDs:", rooms.map(r => r.roomID)); // Log all stored room IDs

    // Find the index of the room to be removed
    const roomIndex = rooms.findIndex(r => String(r.roomID).trim() === String(roomID).trim());
    console.log(`Room ID to remove: ${roomID}`);
    console.log(`Room index found: ${roomIndex}`);

    if (roomIndex === -1) {
        showAlert('Room not found in cart.'); // Call showAlert function
        return;
    }

    // Remove the room from the cart
    const removedRoom = rooms[roomIndex]; // Store the removed room information
    rooms.splice(roomIndex, 1); // Remove the room from the array

    // Update localStorage
    localStorage.setItem('rooms', JSON.stringify(rooms));

    // Update the total price and other UI elements (optional)
    updateTotalAmountAndGST(rooms); // Call a new function to update total and GST
    displayCartRooms(); // Re-render the cart to reflect changes

    // Restore the room status to available in local storage
    const allRooms = JSON.parse(localStorage.getItem('roomsData')) || [];
    const roomToRestore = allRooms.find(room => room.roomID === removedRoom.roomID);

    if (roomToRestore) {
        roomToRestore.status = "Occupied"; // Change status back to available
        localStorage.setItem('roomsData', JSON.stringify(allRooms)); // Save the updated room data back to localStorage
    }
}

// New function to update totalAmount and gst
function updateTotalAmountAndGST(rooms) {
    // Calculate total price from the remaining rooms
    let totalPrice = 0;
    rooms.forEach(room => {
        totalPrice += parseInt(room.price);
    });

    // Assuming a GST rate of 10%. Adjust as necessary.
    const gstRate = 0.1;
    const gst = totalPrice * gstRate;
    const totalAmount = totalPrice + gst;

    // Update the localStorage with new gst and totalAmount
    localStorage.setItem('gst', gst.toFixed(2)); // Save GST rounded to 2 decimal places
    localStorage.setItem('totalAmount', totalAmount.toFixed(2)); // Save Total amount with GST included
}



function displayCartRooms() {
    const roomCart = document.getElementById('room-cart');
    const rooms = JSON.parse(localStorage.getItem('rooms')) || [];


    if (rooms.length > 0) {
        roomCart.style.display = 'block';
        const cartWrapper = roomCart.querySelector('.cart-wrapper');
        cartWrapper.innerHTML = ''; // Clear existing items

        let totalPrice = 0; // Initialize total price

        rooms.forEach((room, index) => {
            const roomHTML = `
                <div class="cart-container">
                    <p class="title-room">Phòng ${index + 1}</p>
                    <p class="stay-dates">${localStorage.getItem('checkin') || 'Chọn ngày'} — ${localStorage.getItem('checkout') || 'Chọn ngày'}</p>

                    <div class="room-details">
                        <p>x1 ${room.roomType.typeName}  Giá: <span class="price-info">${room.price}đ</span></p>
                        <p>${room.people || '1 Người lớn'}  Người</p>
                    </div>
                    <div class="delete-order" onclick="removeRoomFromCart('${room.roomID}')"> 
        
       <i class="fas fa-trash"></i> <!-- For solid icons -->

                    </div>
                </div>
            `;

            // Append each room's HTML as a separate cart container
            cartWrapper.insertAdjacentHTML('beforeend', roomHTML);

            // Add room price to total
            totalPrice += parseInt(room.price); // Assuming price is a string, convert to integer
        });
        const gst = localStorage.getItem('gst') || 0;
        const totalAmount = localStorage.getItem('totalAmount') || totalPrice

        // Display the total price only once at the end
        const totalHTML = `
            <div class="total-info">
                <p class="total-price1">Thuế phí: <span class="price-info1">${gst}đ</span></p>
                <p class="total-price">Tổng cộng: <span class="price-info">${totalAmount}đ</span></p>
                <p class="tax-info">(Bao gồm thuế phí)</p>
            </div>
        `;

        cartWrapper.insertAdjacentHTML('beforeend', totalHTML); // Append total price info
    } else {
        roomCart.style.display = 'none';
    }

}

function showAlert(message) {
    const alertBox = document.getElementById('alert-box');
    const alertMessage = document.getElementById('alert-message');

    alertMessage.textContent = message; // Set the alert message
    alertBox.style.display = 'block'; // Show the alert box

    // Automatically hide the alert after 3 seconds
    setTimeout(() => {
        alertBox.classList.add('fade-out');
        setTimeout(() => {
            alertBox.style.display = 'none';
            alertBox.classList.remove('fade-out');
        }, 600); // Match the transition duration
    }, 800); // Show for 3 seconds
}
function closeAlert() {
    const alertBox = document.getElementById('alert-box');
    alertBox.style.display = 'none'; // Close the alert
}

function showSuccessAlert(message) {
    const successBox = document.getElementById('success-box');
    const successMessage = document.getElementById('success-message');

    successMessage.textContent = message; // Set the success message
    successBox.style.display = 'block'; // Show the success box

    // Automatically hide the success alert after 3 seconds
    setTimeout(() => {
        successBox.classList.add('fade-out');
        setTimeout(() => {
            successBox.style.display = 'none';
            successBox.classList.remove('fade-out');
        }, 600); // Match the transition duration
    }, 1000); // Show for 3 seconds
}

function closeSuccessAlert() {
    const successBox = document.getElementById('success-box');
    successBox.style.display = 'none'; // Close the success alert
}


function updateStayDates() {
    const checkinDate = document.getElementById('checkin').value;
    const checkoutDate = document.getElementById('checkout').value;

    if (checkinDate && checkoutDate) {
        const stayDatesElement = document.querySelector('.stay-dates');
        stayDatesElement.textContent = `${checkinDate} — ${checkoutDate}`;
    }
    CalculateRoomCost();
    displayCartRooms();

}

document.getElementById('reservationForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Ngừng hành động submit mặc định của form

  

    // Gọi hàm CreateReservation nếu các thông tin hợp lệ
    const reservationResult = await CreateReservation();

});


document.querySelector('.search-btn').addEventListener('click', () => {
    const viewType = document.getElementById('viewType').value;
    const sortPrice = document.getElementById('sortPrice').value;
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;

    console.log('Search parameters:', { viewType, sortPrice, minPrice, maxPrice });

    // Call fetchRoom with search parameters
    fetchRoom(viewType, sortPrice, minPrice, maxPrice);
});
document.getElementById('checkin').addEventListener('change', () => {
    const checkinDate = document.getElementById('checkin').value;
    localStorage.setItem('checkin', checkinDate);
    updateStayDates();

});

document.getElementById('checkout').addEventListener('change', () => {
    const checkoutDate = document.getElementById('checkout').value;
    localStorage.setItem('checkout', checkoutDate);
    updateStayDates();
});


window.addEventListener('load', () => {
    const storedCheckin = localStorage.getItem('checkin');
    const storedCheckout = localStorage.getItem('checkout');

    if (storedCheckin) {
        document.getElementById('checkin').value = storedCheckin;
    }
    if (storedCheckout) {
        document.getElementById('checkout').value = storedCheckout;
    }

    updateStayDates();
});

document.addEventListener('DOMContentLoaded', () => {

    fetchRoom();
    displayCartRooms();




});






///booking room to payment

