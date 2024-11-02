async function fetchAmenity(serviceID) {
    const url = `/api/Services/GetServiceByID/${serviceID}`;

    try {
        const response = await fetch(url);
        if (response.ok) {
            const result = await response.json(); // Parse JSON data from API
            console.log(result); // Log the fetched data for verification

            // Check if the data contains a success flag and then access the serviceName
            if (result.success && result.data) {
                document.querySelector('.section-title').textContent = result.data.serviceName;
                document.querySelector('.restaurant-card').textContent = result.data.description1;
                document.querySelector('.restaurant-card1').textContent = result.data.description2;
                document.querySelector('.restaurant-card2').textContent = result.data.description3;
            } else {
                console.error("Service data not found or not successful:", result.message);
            }

        } else {
            console.error("Error fetching amenities:", response.statusText);
        }
    } catch (error) {
        console.error("Network error:", error);
    }
}

async function fetchImageAmenity(serviceID) {
    const url = `/api/ImageServices/all`;
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            console.log("Fetched Image Services:", data);

            // Filter images by serviceID
            const serviceImages = data.filter(image => image.servicesID === serviceID);
            console.log("Filtered Images for serviceID", serviceID, ":", serviceImages);

            // Skip the first image by slicing the array (from index 1 onward)
            const imagesToDisplay = serviceImages.slice(1); // Take images from index 1 onward
            console.log("Images to display:", imagesToDisplay);

            // Check if images are available and populate photos-grid container
            const photosGrid = document.querySelector('.photos-grid');
            photosGrid.innerHTML = ''; // Clear any existing images

            if (imagesToDisplay.length > 0) {
                imagesToDisplay.forEach(image => {
                    const imgElement = document.createElement('img');
                    imgElement.src = image.imageURL;
                    imgElement.alt = `Service Image for serviceID ${serviceID}`;
                    photosGrid.appendChild(imgElement);
                    console.log("Image added to grid:", image.imageURL);
                });
            } else {
                console.log("No images found for the specified serviceID.");
            }
        } else {
            console.error("Error fetching Image Amenity:", response.statusText);
        }
    } catch (error) {
        console.error("Network error:", error);
    }
}



window.onload = function () {
    const urlParts = window.location.pathname.split('/');
    const productId = parseInt(urlParts[urlParts.length - 1], 10);
    fetchImageAmenity(productId);
    fetchAmenity(productId);
}


