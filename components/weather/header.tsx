"use client";

import Link from "next/link";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  language: string;
  setLanguage: (lang: string) => void;
  searchCity: string;
  setSearchCity: (city: string) => void;
  onSearch: () => void;
}

export function Header({
  language,
  setLanguage,
  searchCity,
  setSearchCity,
  onSearch,
}: HeaderProps) {
  return (
    <>
      <div className="bg-slate-900 text-slate-300 py-2 hidden lg:block">
        <div className="container mx-auto px-4">
          <div className="flex justify-end">
            <Link
              href="https://github.com/yesvus/samsa-weather"
              target="_blank"
              className="flex items-center gap-2 hover:text-white transition-colors text-sm"
            >
              <small>Check this repo</small>
              <Github className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-50 bg-primary text-white shadow-md">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center justify-between gap-4">
            <div className="flex items-center">
              <img
                src="/assets/logo/png/logo-no-background.png"
                alt="Samsa Weather Logo"
                className="h-10 object-contain max-w-[200px]"
              />
            </div>

            <div className="flex items-center gap-2 flex-1 max-w-2xl">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setLanguage(language === "en" ? "tr" : "en")}
                className="min-w-[75px]"
              >
                {language === "en" ? "🇹🇷 TR" : "🇬🇧 EN"}
              </Button>
              <div className="flex gap-1 flex-1">
                <Input
                  type="search"
                  placeholder={language === "en" ? "Enter a city..." : "Bir şehir girin..."}
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onSearch()}
                  className="flex-1"
                />
                <Button onClick={onSearch} variant="secondary">
                  {language === "en" ? "Search" : "Ara"}
                </Button>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
