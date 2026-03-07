// ===== WEATHER =====
const API_KEY = "ccd90b7ec2d70525bd2eaa1e13154fcc";
const CITY = "Redbank Plains";
const UNITS = "metric";

const weatherIcons = {
  "01d": "☀️",
  "01n": "🌙",
  "02d": "⛅",
  "02n": "⛅",
  "03d": "☁️",
  "03n": "☁️",
  "04d": "☁️",
  "04n": "☁️",
  "09d": "🌧️",
  "09n": "🌧️",
  "10d": "🌦️",
  "10n": "🌧️",
  "11d": "⛈️",
  "11n": "⛈️",
  "13d": "❄️",
  "13n": "❄️",
  "50d": "🌫️",
  "50n": "🌫️",
};

async function fetchWeather() {
  try {
    // Current weather
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=${UNITS}`,
    );
    if (!currentRes.ok) throw new Error("Weather data not available");
    const current = await currentRes.json();

    // 5 day forecast
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&appid=${API_KEY}&units=${UNITS}`,
    );
    if (!forecastRes.ok) throw new Error("Forecast data not available");
    const forecast = await forecastRes.json();

    // Current weather data
    const icon = weatherIcons[current.weather[0].icon] || "🌡️";
    const temp = Math.round(current.main.temp);
    const feelsLike = Math.round(current.main.feels_like);
    const description = current.weather[0].description;
    const humidity = current.main.humidity;
    const windSpeed = Math.round(current.wind.speed * 3.6);
    const city = current.name;

    // Process forecast - get one entry per day at midday
    const dailyForecasts = {};
    forecast.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toLocaleDateString("en-AU", {
        weekday: "short",
        day: "numeric",
      });
      const hour = date.getHours();

      // Pick the forecast closest to midday for each day
      if (
        !dailyForecasts[dayKey] ||
        Math.abs(hour - 12) <
          Math.abs(new Date(dailyForecasts[dayKey].dt * 1000).getHours() - 12)
      ) {
        dailyForecasts[dayKey] = item;
      }
    });

    // Get next 5 days excluding today
    const today = new Date().toLocaleDateString("en-AU", {
      weekday: "short",
      day: "numeric",
    });
    const forecastDays = Object.entries(dailyForecasts)
      .filter(([day]) => day !== today)
      .slice(0, 5);

    const forecastHTML = forecastDays
      .map(([day, data]) => {
        const fIcon = weatherIcons[data.weather[0].icon] || "🌡️";
        const fMax = Math.round(data.main.temp_max);
        const fMin = Math.round(data.main.temp_min);
        const fDesc = data.weather[0].description;
        return `
                <div class="forecast-day">
                    <div class="forecast-date">${day}</div>
                    <div class="forecast-icon">${fIcon}</div>
                    <div class="forecast-desc">${fDesc}</div>
                    <div class="forecast-temps">
                        <span class="forecast-max">${fMax}°</span>
                        <span class="forecast-min">${fMin}°</span>
                    </div>
                </div>
            `;
      })
      .join("");

    document.getElementById("weather-content").innerHTML = `
            <div class="weather-main">
                <div class="weather-icon">${icon}</div>
                <div>
                    <div class="weather-temp">${temp}°C</div>
                    <div class="weather-desc">${description}</div>
                </div>
            </div>
            <div class="weather-details">
                <div class="weather-detail-item">
                    <div class="label">Feels Like</div>
                    <div class="value">${feelsLike}°C</div>
                </div>
                <div class="weather-detail-item">
                    <div class="label">Humidity</div>
                    <div class="value">${humidity}%</div>
                </div>
                <div class="weather-detail-item">
                    <div class="label">Wind</div>
                    <div class="value">${windSpeed} km/h</div>
                </div>
                <div class="weather-detail-item">
                    <div class="label">Condition</div>
                    <div class="value">${description}</div>
                </div>
            </div>
            <div class="weather-city">📍 ${city}</div>
                        <button class="forecast-toggle" onclick="toggleForecast()">
                            <i class="fas fa-chevron-down" id="forecast-chevron"></i> 5 Day Forecast
                        </button>
                        <div class="forecast-container" id="forecast-container" style="display:none;">
                            <div class="forecast-grid">
                                ${forecastHTML}
                            </div>
                        </div>
        `;
  } catch (error) {
    document.getElementById("weather-content").innerHTML = `
            <p style="color: rgba(255,255,255,0.5);">
                Unable to load weather. Please check your API key.
            </p>
        `;
    console.error("Weather error:", error);
  }
}

fetchWeather();
setInterval(fetchWeather, 10 * 60 * 1000);
window.toggleForecast = function () {
  const container = document.getElementById("forecast-container");
  const chevron = document.getElementById("forecast-chevron");
  const isHidden = container.style.display === "none";
  container.style.display = isHidden ? "block" : "none";
  chevron.style.transform = isHidden ? "rotate(180deg)" : "rotate(0deg)";
};
