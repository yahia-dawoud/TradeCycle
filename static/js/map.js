// Simple map functionality for location selection
document.addEventListener('DOMContentLoaded', function() {
    // Initialize map if we're on the signup page
    if (document.getElementById('latitude') && document.getElementById('longitude')) {
        initializeMap();
    }
});

function initializeMap() {
    // Create a simple map container
    const mapContainer = document.createElement('div');
    mapContainer.id = 'location-map';
    mapContainer.style.cssText = `
        height: 300px;
        background: #f0f0f0;
        border: 2px solid #ddd;
        border-radius: 8px;
        margin: 10px 0;
        position: relative;
        cursor: crosshair;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666;
        font-size: 14px;
    `;
    mapContainer.innerHTML = `
        <div style="text-align: center;">
            <i class="fas fa-map-marked-alt" style="font-size: 48px; margin-bottom: 10px; display: block;"></i>
            Click anywhere on this area to set your location<br>
            <small>Current: <span id="current-coords">Not set</span></small>
        </div>
    `;

    // Insert the map after the coordinates input fields
    const coordinatesDiv = document.querySelector('input[name="latitude"]').closest('.input-div');
    coordinatesDiv.parentNode.insertBefore(mapContainer, coordinatesDiv.nextSibling);

    // Add click event to set coordinates
    mapContainer.addEventListener('click', function(e) {
        const rect = mapContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Convert click position to approximate lat/lng
        // This is a simple approximation - in production you'd use a real map API
        const latitude = (90 - (y / rect.height) * 180).toFixed(6);
        const longitude = ((x / rect.width) * 360 - 180).toFixed(6);
        
        // Update the input fields
        document.getElementById('latitude').value = latitude;
        document.getElementById('longitude').value = longitude;
        
        // Update display
        document.getElementById('current-coords').textContent = `${latitude}, ${longitude}`;
        
        // Add visual feedback
        mapContainer.style.background = '#e8f5e9';
        setTimeout(() => {
            mapContainer.style.background = '#f0f0f0';
        }, 500);
    });

    // Add current location button
    const locationButton = document.createElement('button');
    locationButton.type = 'button';
    locationButton.innerHTML = '<i class="fas fa-location-arrow"></i> Use My Current Location';
    locationButton.className = 'go-button';
    locationButton.style.cssText = `
        width: 100%;
        margin-top: 10px;
        background: #54A054;
        color: white;
        border: none;
        padding: 10px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 13px;
    `;
    
    mapContainer.parentNode.insertBefore(locationButton, mapContainer.nextSibling);

    // Geolocation functionality
    locationButton.addEventListener('click', function() {
        if (navigator.geolocation) {
            locationButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting location...';
            locationButton.disabled = true;
            
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const latitude = position.coords.latitude.toFixed(6);
                    const longitude = position.coords.longitude.toFixed(6);
                    
                    document.getElementById('latitude').value = latitude;
                    document.getElementById('longitude').value = longitude;
                    document.getElementById('current-coords').textContent = `${latitude}, ${longitude}`;
                    
                    locationButton.innerHTML = '<i class="fas fa-check"></i> Location set!';
                    mapContainer.style.background = '#e8f5e9';
                    
                    setTimeout(() => {
                        locationButton.innerHTML = '<i class="fas fa-location-arrow"></i> Use My Current Location';
                        locationButton.disabled = false;
                        mapContainer.style.background = '#f0f0f0';
                    }, 2000);
                },
                function(error) {
                    locationButton.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Location denied';
                    setTimeout(() => {
                        locationButton.innerHTML = '<i class="fas fa-location-arrow"></i> Use My Current Location';
                        locationButton.disabled = false;
                    }, 2000);
                }
            );
        } else {
            alert('Geolocation is not supported by your browser');
        }
    });
}
