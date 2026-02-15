# Weather App with AI Suggestion

A modern weather application built with Next.js, React, Tailwind CSS, and shadcn/ui that provides real-time weather data and AI-powered clothing and umbrella recommendations.

## 🌟 Check It Live

Visit the live demo at: [samsaw.vercel.app](https://samsaw.vercel.app)

## ✨ Features

- **Live Weather Data**: Fetches real-time weather data from the OpenWeatherMap API for any city around the world
- **AI-Powered Suggestions**: Uses Google's "Gemini Flash 1.5" model via the OpenRouter API to provide AI-generated suggestions for clothing and umbrella recommendations based on the weather
- **Multilanguage Support**: Choose your preferred language (English and Turkish) using the navbar button
- **Hourly Forecast**: View detailed hourly weather forecasts
- **Weather Metrics**: Display air quality, humidity, and UV index with visual indicators
- **Responsive Design**: Built with Tailwind CSS to ensure a sleek, responsive user interface on both desktop and mobile devices
- **Modern UI**: Built with shadcn/ui components for a clean, accessible interface
- **Dark Mode Support**: Automatic dark mode based on system preferences

## 🛠️ Technologies Used

### Frontend

- **Next.js 16** with App Router
- **React 19** with TypeScript
- **Tailwind CSS v3** for styling
- **shadcn/ui** component library
- **Lucide React** for icons

### Backend & Serverless Functions

- **Node.js & Vercel Serverless Functions**: API calls to OpenWeatherMap and OpenRouter are handled by serverless functions (found in the `api/` directory) to securely hide API keys
- **Secure API Integration**: Environment variables store the API keys, ensuring they remain secret
- **AI Overview Generation**: The `/api/getWeatherSuggestion.js` endpoint generates clothing and umbrella recommendations through a custom algorithm and then uses the AI model to generate the final overview

## 🚀 Getting Started

### Prerequisites

- Node.js 18.18.0 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yesvus/samsa-weather.git
cd samsa-weather
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your API keys:
```env
OW_API_KEY=your_openweathermap_api_key
OR_API_KEY=your_openrouter_api_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

### Building for Production

```bash
npm run build
npm start
```

## 🌍 Environment Variables

This project uses environment variables to securely manage API keys. Set the following in your deployment settings or local `.env.local` file:

- **OW_API_KEY**: Your OpenWeatherMap API key ([Get one here](https://openweathermap.org/api))
- **OR_API_KEY**: Your OpenRouter API key ([Get one here](https://openrouter.ai/))

## 📂 Project Structure

```
samsa-weather/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles with Tailwind
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── weather/          # Weather-specific components
├── lib/                  # Utility functions
│   └── api/             # API service functions
├── types/               # TypeScript type definitions
├── hooks/               # Custom React hooks
├── api/                 # Vercel serverless functions
└── public/              # Static assets
```

## 🎨 Components

- **Header**: Navigation with search and language toggle
- **MainWeatherCard**: Primary weather display with temperature and conditions
- **HourlyForecast**: Scrollable hourly weather forecast
- **WeatherMetrics**: Air quality, humidity, and UV index cards
- **AIOverview**: AI-generated weather suggestions
- **CityLinks**: Quick access to popular cities
- **Footer**: Contact information and links

## 📱 Responsive Design

The app is fully responsive and optimized for:
- Mobile devices (320px and up)
- Tablets (768px and up)
- Desktops (1024px and up)
- Large screens (1280px and up)

## ♿ Accessibility

- Semantic HTML5 elements
- ARIA labels for screen readers
- Keyboard navigation support
- High contrast ratios for text
- Focus indicators for interactive elements

## 🔒 License

This project is licensed under the [GPL-3.0 license](https://github.com/yesvus/samsa-weather?tab=GPL-3.0-1-ov-file#)

## 📧 Contact

- **Email**: yusufemirsamsa@gmail.com
- **GitHub**: [yesvus/samsa-weather](https://github.com/yesvus/samsa-weather)

## 🙏 Credits

- Weather icons provided by the [weather-icons repository](https://github.com/basmilius/weather-icons)
- Favicons generated using [RealFaviconGenerator](https://realfavicongenerator.net/)
- AI powered by Google's Gemini Flash 1.5 via [OpenRouter](https://openrouter.ai/)
- Weather data from [OpenWeatherMap](https://openweathermap.org/)
