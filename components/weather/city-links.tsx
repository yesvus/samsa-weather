"use client";

interface CityLinksProps {
  onCityClick: (city: string) => void;
}

const cities = [
  "Istanbul",
  "Küçükçekmece",
  "Sarıyer",
  "Ankara",
  "İzmir",
  "Antalya",
  "London",
  "Paris",
  "New York",
  "Seoul",
  "Beijing",
];

export function CityLinks({ onCityClick }: CityLinksProps) {
  return (
    <div className="bg-slate-50 border-b sticky top-[72px] z-40">
      <div className="container mx-auto px-4">
        <nav className="flex overflow-x-auto py-3 gap-1 scrollbar-hide">
          {cities.map((city, index) => (
            <span key={city} className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => onCityClick(city)}
                className="px-3 py-1 text-sm text-slate-700 hover:text-primary hover:bg-slate-100 rounded-md transition-colors whitespace-nowrap"
              >
                {city}
              </button>
              {index < cities.length - 1 && (
                <span className="text-slate-300">·</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </div>
  );
}
