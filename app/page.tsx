"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/weather/header";
import { CityLinks } from "@/components/weather/city-links";
import { MainWeatherCard } from "@/components/weather/main-weather-card";
import { HourlyForecast } from "@/components/weather/hourly-forecast";
import { WeatherMetrics } from "@/components/weather/weather-metrics";
import { AIOverview } from "@/components/weather/ai-overview";
import { Footer } from "@/components/weather/footer";
import { useToast } from "@/hooks/use-toast";
import {
  fetchWeather,
  fetchForecast,
  fetchAirQuality,
  fetchUV,
  fetchCoordinates,
  fetchAISuggestion,
} from "@/lib/api/weather-service";
import type {
  WeatherData,
  ForecastData,
  AirQualityData,
  UVData,
} from "@/types/weather";

export default function Home() {
  const [language, setLanguage] = useState("en");
  const [searchCity, setSearchCity] = useState("");
  const [currentCity, setCurrentCity] = useState("Istanbul");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [uvIndex, setUVIndex] = useState<UVData | null>(null);
  const [aiSuggestion, setAISuggestion] = useState(
    "Loading..."
  );
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAILoading] = useState(false);
  const { toast } = useToast();

  const loadWeatherData = async (city: string) => {
    setLoading(true);
    setAISuggestion(
      language === "en"
        ? `No summary generated for ${city}. Tap the button to generate one...`
        : `${city} için özet oluşturulmadı. Oluşturmak için butona tıklayın...`
    );

    try {
      // Fetch main weather data
      const weatherData = await fetchWeather(city, language);
      setWeather(weatherData);
      setCurrentCity(city);

      // Fetch forecast
      const forecastData = await fetchForecast(city);
      setForecast(forecastData);

      // Fetch coordinates for air quality and UV
      const coords = await fetchCoordinates(city);

      // Fetch air quality and UV index in parallel
      const [aq, uv] = await Promise.all([
        fetchAirQuality(coords.lat, coords.lon),
        fetchUV(coords.lat, coords.lon),
      ]);

      setAirQuality(aq);
      setUVIndex(uv);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      toast({
        title: language === "en" ? "Error" : "Hata",
        description:
          language === "en"
            ? "City not found. Please make sure the city name is correct."
            : "Şehir bulunamadı. Lütfen şehir adının doğru olduğundan emin olun.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchCity.trim()) {
      loadWeatherData(searchCity);
      setSearchCity("");
    }
  };

  const handleCityClick = (city: string) => {
    loadWeatherData(city);
  };

  const handleGenerateAI = async () => {
    if (!weather) {
      toast({
        title: language === "en" ? "Error" : "Hata",
        description:
          language === "en"
            ? "Please search for a city first"
            : "Önce bir şehir arayın",
        variant: "destructive",
      });
      return;
    }

    setAILoading(true);
    try {
      const suggestion = await fetchAISuggestion(weather, language);
      setAISuggestion(suggestion);
    } catch (error) {
      console.error("Error generating AI suggestion:", error);
      setAISuggestion(
        language === "en"
          ? "Could not generate an AI overview, please wait a minute."
          : "Şu anda yanıt oluşturamıyorum, lütfen bir dakika bekleyin."
      );
    } finally {
      setAILoading(false);
    }
  };

  // Load default city on mount
  useEffect(() => {
    loadWeatherData(currentCity);
  }, []);

  // Update AI suggestion message when language changes
  useEffect(() => {
    if (weather && aiSuggestion.includes("No summary generated")) {
      setAISuggestion(
        language === "en"
          ? `No summary generated for ${weather.name}. Tap the button to generate one...`
          : `${weather.name} için özet oluşturulmadı. Oluşturmak için butona tıklayın...`
      );
    }
  }, [language]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        language={language}
        setLanguage={setLanguage}
        searchCity={searchCity}
        setSearchCity={setSearchCity}
        onSearch={handleSearch}
      />
      <CityLinks onCityClick={handleCityClick} />

      <main className="flex-1 bg-slate-50">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              <MainWeatherCard weather={weather} loading={loading} />
              <HourlyForecast forecast={forecast} loading={loading} />
              <WeatherMetrics
                airQuality={airQuality}
                uvIndex={uvIndex}
                humidity={weather?.main.humidity || null}
                loading={loading}
                language={language}
              />
            </div>

            {/* AI Overview sidebar - 1/3 width */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-[136px]">
                <AIOverview
                  onGenerate={handleGenerateAI}
                  suggestion={aiSuggestion}
                  loading={aiLoading}
                  language={language}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
