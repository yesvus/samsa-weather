"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AirQualityData, UVData } from "@/types/weather";

interface WeatherMetricsProps {
  airQuality: AirQualityData | null;
  uvIndex: UVData | null;
  humidity: number | null;
  loading: boolean;
  language: string;
}

function getAQIInfo(aqi: number) {
  const levels = [
    { level: "Good", color: "bg-green-500", textColor: "text-green-600" },
    { level: "Fair", color: "bg-yellow-500", textColor: "text-yellow-600" },
    { level: "Moderate", color: "bg-orange-500", textColor: "text-orange-600" },
    { level: "Poor", color: "bg-red-500", textColor: "text-red-600" },
    { level: "Very Poor", color: "bg-purple-500", textColor: "text-purple-600" },
  ];
  return levels[aqi - 1] || levels[0];
}

function getHumidityInfo(humidity: number) {
  if (humidity <= 30) {
    return { level: "Low", color: "bg-green-500", textColor: "text-green-600" };
  } else if (humidity <= 60) {
    return { level: "Moderate", color: "bg-yellow-500", textColor: "text-yellow-600" };
  } else {
    return { level: "High", color: "bg-red-500", textColor: "text-red-600" };
  }
}

function getUVInfo(uv: number) {
  if (uv <= 2) {
    return { level: "Low", color: "bg-green-500", textColor: "text-green-600" };
  } else if (uv <= 5) {
    return { level: "Moderate", color: "bg-yellow-500", textColor: "text-yellow-600" };
  } else if (uv <= 7) {
    return { level: "High", color: "bg-orange-500", textColor: "text-orange-600" };
  } else if (uv <= 10) {
    return { level: "Very High", color: "bg-red-500", textColor: "text-red-600" };
  } else {
    return { level: "Extreme", color: "bg-purple-500", textColor: "text-purple-600" };
  }
}

export function WeatherMetrics({
  airQuality,
  uvIndex,
  humidity,
  loading,
  language,
}: WeatherMetricsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-16 bg-slate-200 rounded mb-3"></div>
              <div className="h-5 bg-slate-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const aqiInfo = airQuality ? getAQIInfo(airQuality.main.aqi) : null;
  const humidityInfo = humidity !== null ? getHumidityInfo(humidity) : null;
  const uvInfo = uvIndex ? getUVInfo(uvIndex.value) : null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      {/* Air Quality */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            {language === "en" ? "Air Quality" : "Hava Kalitesi"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-3">
            <div className="text-4xl font-bold mb-1">
              {airQuality ? airQuality.main.aqi : "-"}
            </div>
            {aqiInfo && (
              <p className={`font-semibold ${aqiInfo.textColor}`}>
                {aqiInfo.level}
              </p>
            )}
          </div>
          {aqiInfo && (
            <div className="w-full h-5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${aqiInfo.color}`}
                style={{ width: `${(airQuality?.main.aqi || 0) * 20}%` }}
              ></div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Humidity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            {language === "en" ? "Humidity" : "Nem"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-3">
            <div className="text-4xl font-bold mb-1">
              {humidity !== null ? `${humidity}%` : "-"}
            </div>
            {humidityInfo && (
              <p className={`font-semibold ${humidityInfo.textColor}`}>
                {humidityInfo.level}
              </p>
            )}
          </div>
          {humidityInfo && humidity !== null && (
            <div className="w-full h-5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${humidityInfo.color}`}
                style={{ width: `${humidity}%` }}
              ></div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* UV Index */}
      <Card className="col-span-2 lg:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            {language === "en" ? "UV Index" : "UV İndeksi"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-3">
            <div className="text-4xl font-bold mb-1">
              {uvIndex ? uvIndex.value.toFixed(1) : "-"}
            </div>
            {uvInfo && (
              <p className={`font-semibold ${uvInfo.textColor}`}>
                {uvInfo.level}
              </p>
            )}
          </div>
          {uvInfo && uvIndex && (
            <div className="w-full h-5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${uvInfo.color}`}
                style={{ width: `${Math.min((uvIndex.value / 11) * 100, 100)}%` }}
              ></div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
