const apiKey = "YOUR_API_KEY";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const loading = document.getElementById("loading");
const error = document.getElementById("error");

const weatherCard = document.getElementById("weatherCard");

const cityName = document.getElementById("cityName");
const temp = document.getElementById("temp");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const condition = document.getElementById("condition");


// Fetch Weather Data
async function getWeather(city){

  try{

    loading.classList.remove("hidden");
    error.classList.add("hidden");
    weatherCard.classList.add("hidden");

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    // Error Handling
    if(!response.ok){
      throw new Error("City not found");
    }

    const data = await response.json();

    // Parse Nested JSON
    const cityData = data.name;
    const temperature = data.main.temp;
    const humidityData = data.main.humidity;
    const windSpeed = data.wind.speed;
    const weatherCondition = data.weather[0].description;

    // Render Data
    cityName.textContent = cityData;
    temp.textContent = temperature;
    humidity.textContent = humidityData;
    wind.textContent = windSpeed;
    condition.textContent = weatherCondition;

    weatherCard.classList.remove("hidden");

  }
  catch(err){

    error.textContent = err.message;
    error.classList.remove("hidden");

  }
  finally{

    loading.classList.add("hidden");

  }
}


// Search Button Event
searchBtn.addEventListener("click", () => {

  const city = cityInput.value.trim();

  if(city !== ""){
    getWeather(city);
  }

});


// Enter Key Support
cityInput.addEventListener("keypress", (e) => {

  if(e.key === "Enter"){

    const city = cityInput.value.trim();

    if(city !== ""){
      getWeather(city);
    }
  }

});
