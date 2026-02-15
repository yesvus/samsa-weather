import type { WeatherData, ForecastData, AirQualityData, UVData, AIWeatherSuggestion } from "@/types/weather";

export async function fetchWeather(city: string, lang: string = "en"): Promise<WeatherData> {
  const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}&lang=${lang}`);
  if (!response.ok) {
    throw new Error("City not found");
  }
  return response.json();
}

export async function fetchForecast(city: string): Promise<ForecastData> {
  const response = await fetch(`/api/forecast?city=${encodeURIComponent(city)}`);
  if (!response.ok) {
    throw new Error("Failed to fetch forecast");
  }
  return response.json();
}

export async function fetchAirQuality(lat: number, lon: number): Promise<AirQualityData> {
  const response = await fetch(`/api/air-quality?lat=${lat}&lon=${lon}`);
  if (!response.ok) {
    throw new Error("Failed to fetch air quality");
  }
  return response.json();
}

export async function fetchUV(lat: number, lon: number): Promise<UVData> {
  const response = await fetch(`/api/uv?lat=${lat}&lon=${lon}`);
  if (!response.ok) {
    throw new Error("Failed to fetch UV index");
  }
  return response.json();
}

export async function fetchCoordinates(city: string): Promise<{ lat: number; lon: number }> {
  const response = await fetch(`/api/geo?city=${encodeURIComponent(city)}`);
  if (!response.ok) {
    throw new Error("Failed to fetch coordinates");
  }
  const data = await response.json();
  if (data.length === 0) {
    throw new Error("City not found");
  }
  return { lat: data[0].lat, lon: data[0].lon };
}

export async function fetchAISuggestion(weatherData: WeatherData, lang: string = "en"): Promise<string> {
  const response = await fetch("/api/getWeatherSuggestion", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ weatherData, lang }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch AI suggestion");
  }

  const result: AIWeatherSuggestion = await response.json();
  return result.suggestion;
}

export function getWeatherIcon(iconCode: string): string {
  const iconMapping: Record<string, string> = {
    "01d": "clear-day.svg",
    "01n": "clear-night.svg",
    "02d": "partly-cloudy-day.svg",
    "02n": "partly-cloudy-night.svg",
    "03d": "cloudy.svg",
    "03n": "cloudy.svg",
    "04d": "overcast.svg",
    "04n": "overcast.svg",
    "09d": "rain.svg",
    "09n": "rain.svg",
    "10d": "rain.svg",
    "10n": "rain.svg",
    "11d": "thunderstorms.svg",
    "11n": "thunderstorms.svg",
    "13d": "snow.svg",
    "13n": "snow.svg",
    "50d": "mist.svg",
    "50n": "mist.svg",
  };

  return iconMapping[iconCode] || "default.svg";
}
