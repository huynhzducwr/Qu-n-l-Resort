async function fetchAmenity(isActive = null) {
    let url = '/api/Services/AllServices';
    if (isActive !== null) {
        url += `?isActive=${isActive}`;
    }

    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json(); // Parse JSON data from API
            console.log(data);
            const amenities = data.data;
            const amenityImages = await fetchImageAmenity(); // Fetch the corresponding images

            renderServices(amenities, amenityImages); // Call render function to display amenities with images
        } else {
            console.error("Error fetching amenities:", response.statusText);
        }
    } catch (error) {
        console.error("Network error:", error);
    }
}


async function fetchImageAmenity() {
    let url = '/api/ImageServices/all'; // API endpoint to fetch images
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json(); // Parse JSON data from API
            console.log("Fetched Image Services:", data); // Log fetched image data for verification
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


function renderServices(amenities, amenityImages) {
    const containerAmenity = document.querySelector('.rooms'); // Select the amenities container

    // Clear the container before rendering
    containerAmenity.innerHTML = '';

    // Check if amenities data exists
    if (!Array.isArray(amenities) || amenities.length === 0) {
        containerAmenity.innerHTML = '<p>No amenities available to display.</p>';
        return;
    }

    // Render amenities along with their corresponding images
    amenities.forEach(amenity => {
        // Find the corresponding image for the amenity
        const imageData = amenityImages.find(image => image.servicesID === amenity.servicesID);

        // Create the HTML for each amenity
        const amenityHTML = `
        <div class="container-img1">
            <a href="/servicedetail/${amenity.servicesID}"> <!-- Include amenities in URL -->
                   <img src="${imageData ? imageData.imageURL : '/src/default-image.png'}" alt="${amenity.serviceName}">
            </a>

            <p class="room-title1">${amenity.serviceName}</p>
            <p class="description">${amenity.description1}</p>
        </div>
        `;

        // Append the amenity HTML to the container
        containerAmenity.insertAdjacentHTML('beforeend', amenityHTML);
    });
}




document.addEventListener('DOMContentLoaded', () => {
    fetchAmenity(); // Lấy và hiển thị sản phẩm khi trang tải
});
