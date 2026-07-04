// DOM Elements
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const weatherCard = document.getElementById('weather-card');
const loadingSpinner = document.getElementById('loading-spinner');
const errorMessage = document.getElementById('error-message');

const locationName = document.getElementById('location-name');
const tempVal = document.getElementById('temp-val');
const humidityVal = document.getElementById('humidity-val');
const windVal = document.getElementById('wind-val');

// Event Listener
searchForm.addEventListener('submit', handleSearch);

async function handleSearch(event) {
    event.preventDefault();
    const cityName = cityInput.value.trim();
    if (!cityName) return;

    resetUI();
    showLoading(true);

    try {
        // Step 1: Geocode city name to get Latitude and Longitude
        const geoData = await fetchCoordinates(cityName);
        
        // Step 2: Fetch weather data using coordinates
        const weatherData = await fetchWeatherData(geoData.latitude, geoData.longitude);
        
        // Step 3: Render the nested JSON data to the DOM
        renderWeather(cityName, geoData.country, weatherData);
    } catch (error) {
        showError(error.message);
    } finally {
        showLoading(false);
    }
}

// Fetch Coordinates (Geocoding API)
async function fetchCoordinates(city) {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    
    const response = await fetch(geoUrl);
    
    if (!response.ok) {
        throw new Error(`Geocoding server error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check if results array exists and has at least one city
    if (!data.results || data.results.length === 0) {
        throw new Error(`City "${city}" not found. Please try another name.`);
    }
    
    return {
        latitude: data.results[0].latitude,
        longitude: data.results[0].longitude,
        country: data.results[0].country
    };
}

// Fetch Weather Metrics (Weather API)
async function fetchWeatherData(lat, lon) {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`;
    
    const response = await fetch(weatherUrl);
    
    if (!response.ok) {
        throw new Error(`Weather service error: ${response.status}`);
    }
    
    return await response.json();
}

// Render dynamic data
function renderWeather(city, country, data) {
    // Accessing complex, nested JSON structure safely
    const currentMetrics = data.current;
    const units = data.current_units;

    if (!currentMetrics) {
        throw new Error("Weather data format is invalid.");
    }

    locationName.textContent = `${city}, ${country}`;
    tempVal.textContent = `${currentMetrics.temperature_2m}${units.temperature_2m}`;
    humidityVal.textContent = `${currentMetrics.relative_humidity_2m}${units.relative_humidity_2m}`;
    windVal.textContent = `${currentMetrics.wind_speed_10m} ${units.wind_speed_10m}`;

    weatherCard.classList.remove('hidden');
}

// UI Helper Functions
function showLoading(isLoading) {
    if (isLoading) {
        loadingSpinner.classList.remove('hidden');
    } else {
        loadingSpinner.classList.add('hidden');
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

function resetUI() {
    errorMessage.classList.add('hidden');
    weatherCard.classList.add('hidden');
}
