"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWeatherIcon } from "@/lib/api/weather-service";
import type { ForecastData } from "@/types/weather";

interface HourlyForecastProps {
  forecast: ForecastData | null;
  loading: boolean;
}

export function HourlyForecast({ forecast, loading }: HourlyForecastProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hourly Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex overflow-x-auto gap-2 pb-2">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center min-w-[80px] p-3 bg-slate-50 rounded-lg animate-pulse"
              >
                <div className="h-4 w-12 bg-slate-200 rounded mb-2"></div>
                <div className="w-10 h-10 bg-slate-200 rounded-full mb-2"></div>
                <div className="h-5 w-8 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!forecast || !forecast.list) {
    return null;
  }

  const hourlyData = forecast.list.slice(0, 8);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hourly Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex overflow-x-auto gap-2 pb-2">
          {hourlyData.map((item, index) => {
            const time = new Date(item.dt * 1000);
            const hours = time.getHours();
            const minutes = time.getMinutes();
            const timeString = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
            const iconCode = item.weather[0]?.icon || "01d";
            const iconPath = `/assets/icons/static/${getWeatherIcon(iconCode)}`;

            return (
              <div
                key={index}
                className="flex flex-col items-center justify-center min-w-[80px] p-3 bg-slate-50 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="text-sm text-slate-600 mb-2">{timeString}</p>
                <img
                  src={iconPath}
                  alt="Weather icon"
                  className="w-10 h-10 mb-2"
                />
                <p className="font-semibold">{Math.round(item.main.temp)}°</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
