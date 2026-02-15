"use client";

import Link from "next/link";
import { Mail, MapPin, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Samsa Weather</h3>
            <p className="text-sm">
              Samsa weather is an AI app which shows the weather by searching. 
              Also gives a unique AI suggestion.
            </p>
          </div>

          <div className="md:px-8">
            <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Today
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Hourly
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Contact</h3>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a
                  href="mailto:yusufemirsamsa@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  yusufemirsamsa@gmail.com
                </a>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 shrink-0" />
                <span>İTÜ Ayazağa Kampüsü Maslak, 34485 Sarıyer/İstanbul</span>
              </p>
              <p className="flex items-center gap-2">
                <Github className="w-4 h-4" />
                <a
                  href="https://github.com/yesvus/samsa-weather"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Check this repo
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="container mx-auto px-4 py-4 text-center text-sm">
          <p>© Samsa Weather</p>
        </div>
      </div>
    </footer>
  );
}
