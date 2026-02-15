"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getWeatherIcon } from "@/lib/api/weather-service";
import type { WeatherData } from "@/types/weather";

interface MainWeatherCardProps {
  weather: WeatherData | null;
  loading: boolean;
}

export function MainWeatherCard({ weather, loading }: MainWeatherCardProps) {
  if (loading) {
    return (
      <Card className="bg-primary text-white border-0 shadow-lg">
        <CardHeader className="bg-slate-900/75">
          <h5 className="text-lg font-semibold">Loading...</h5>
        </CardHeader>
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <div className="text-6xl md:text-7xl font-bold mb-2 animate-pulse">
              --°
            </div>
            <p className="text-lg mb-1 animate-pulse">Loading...</p>
            <p className="text-sm opacity-75 animate-pulse">-- / --°</p>
            <p className="text-sm opacity-75 animate-pulse">Feels like --°</p>
          </div>
          <div className="w-28 h-28 md:w-36 md:h-36 bg-white/10 rounded-full animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card className="bg-primary text-white border-0 shadow-lg">
        <CardHeader className="bg-slate-900/75">
          <h5 className="text-lg font-semibold">Welcome</h5>
        </CardHeader>
        <CardContent className="p-6">
          <p>Search for a city to see the weather</p>
        </CardContent>
      </Card>
    );
  }

  const iconCode = weather.weather[0]?.icon || "01d";
  const iconPath = `/assets/icons/${getWeatherIcon(iconCode)}`;

  return (
    <Card className="bg-primary text-white border-0 shadow-lg">
      <CardHeader className="bg-slate-900/75">
        <h5 className="text-lg font-semibold">
          {weather.name}, {weather.sys.country}
        </h5>
      </CardHeader>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <div className="text-6xl md:text-7xl font-bold mb-2">
            {Math.round(weather.main.temp)}°
          </div>
          <p className="text-lg mb-1 capitalize">
            {weather.weather[0]?.description}
          </p>
          <p className="text-sm opacity-75">
            {Math.round(weather.main.temp_max)}° / {Math.round(weather.main.temp_min)}°
          </p>
          <p className="text-sm opacity-75">
            Feels like {Math.round(weather.main.feels_like)}°
          </p>
        </div>
        <img
          src={iconPath}
          alt="Weather icon"
          className="w-28 h-28 md:w-36 md:h-36"
        />
      </CardContent>
    </Card>
  );
}
