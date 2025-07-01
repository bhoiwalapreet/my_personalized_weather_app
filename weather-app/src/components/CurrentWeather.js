import React from "react";
import "../animations.css";

const getCuteIcon = (weatherType) => {
    switch(weatherType) {
      case "rain":
        return <span role="img" aria-label="rain">🌧️</span>;
      case "clouds":
        return <span role="img" aria-label="cloud">☁️</span>;
      case "clear":
        return <span role="img" aria-label="sun">☀️</span>;
      case "snow":
        return <span role="img" aria-label="snow">❄️</span>;
      default:
        return <span role="img" aria-label="weather">🌤️</span>;
    }
  };

  export default function CurrentWeather({ weather, selectedCity }) {
    if (!weather) return null;
  
    return (
      <div>
        <h3>
          Weather in {selectedCity ? selectedCity.displayName : weather.name}
        </h3>
        <p>Temperature: {weather.main.temp}°F</p>
        <p>Description: {weather.weather[0].description}</p>
        <p>Humidity: {weather.main.humidity}%</p>
        <p>Wind: {weather.wind.speed} mph</p>
  
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(50px, 1fr))",
            gap: "10px",
            justifyItems: "center",
            padding: "20px",
            marginTop: "20px",
          }}
        >
          {Array(30)
            .fill()
            .map((_, i) => (
              <div key={i} className="bounce">
                {getCuteIcon(weather.weather[0].main.toLowerCase())}
              </div>
            ))}
        </div>
      </div>
    );
  }