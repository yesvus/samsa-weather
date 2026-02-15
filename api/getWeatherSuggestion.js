export default async function handler(req, res) {
    // This endpoint accepts only POST requests.
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }
  
    // Retrieve weatherData and language from the request body.
    const { weatherData, lang } = req.body;
    if (!weatherData) {
      res.status(400).json({ error: "Missing weatherData in request body" });
      return;
    }
    
    // Validate weatherData structure
    if (!weatherData.main || !weatherData.weather || !weatherData.wind || !weatherData.clouds || !weatherData.sys) {
      console.error("Invalid weatherData structure:", JSON.stringify(weatherData, null, 2));
      const fallbackMessage = lang === "tr"
        ? "Geçersiz hava durumu verisi."
        : "Invalid weather data.";
      return res.status(400).json({ suggestion: fallbackMessage });
    }
    
    // Check for GEMINI_API_KEY
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set");
      const fallbackMessage = lang === "tr"
        ? "API anahtarı yapılandırılmamış."
        : "API key not configured.";
      return res.status(500).json({ suggestion: fallbackMessage });
    }                         
  
    // Wrap data processing in try-catch to handle any unexpected errors
    try {
      // --- determineClothing logic ---
      const temp = Math.round(weatherData.main.temp);
    const windSpeed = weatherData.wind.speed;
    const humidity = weatherData.main.humidity;
    
    let clothingSuggestionEN = "";
    let clothingSuggestionTR = "";
    
    if (temp <= 5) {
      clothingSuggestionEN = "T-shirt, thick sweatshirt, jeans or sweatpants, and a puffer jacket.";
      clothingSuggestionTR = "Tişört, kalın sweatshirt, jeans (veya eşofman altı) ve şişme mont giyin.";
    } else if (temp >= 6 && temp <= 10) {
      clothingSuggestionEN = "Wear a T-shirt, light sweatshirt, jeans or sweatpants, and a puffer jacket.";
      clothingSuggestionTR = "Tişört, ince sweatshirt, jeans (veya eşofman altı) ve şişme mont giyin.";
    } else if (temp >= 11 && temp <= 15) {
      clothingSuggestionEN = "Wear a T-shirt, light sweatshirt, jeans or sweatpants, and a light jacket.";
      clothingSuggestionTR = "Tişört, ince sweatshirt, jeans (veya eşofman altı) ve ince ceket giyin.";
    } else if (temp >= 16 && temp <= 20) {
      clothingSuggestionEN = "Wear a T-shirt, hoodie, jeans or sweatpants, no jacket needed.";
      clothingSuggestionTR = "Tişört, kapüşonlu, jeans (veya eşofman altı) giyin, ceket gerekli değil.";
    } else if (temp >= 21 && temp <= 25) {
      clothingSuggestionEN = "Wear a T-shirt, jorts, and a light jacket.";
      clothingSuggestionTR = "Tişört, şort ve ince ceket giyin.";
    } else {
      clothingSuggestionEN = "Wear a T-shirt and jorts, no jacket needed.";
      clothingSuggestionTR = "Tişört ve şort giyin, ceket gerekli değil.";
    }
    
    let windAdviceEN = "";
    let windAdviceTR = "";
    if (windSpeed > 15) {
      windAdviceEN = "Due to strong winds, consider layering more.";
      windAdviceTR = "Güçlü rüzgar nedeniyle daha kalın giyinmeyi düşünün.";
    }
    
    let humidityAdviceEN = "";
    let humidityAdviceTR = "";
    if (humidity > 90 && temp > 15) {
      humidityAdviceEN = " The humidity is high, so avoid excessive layering.";
      humidityAdviceTR = " Nem yüksek, bu yüzden kat kat giyinmekten kaçının.";
    }
    
    // Choose the language
    const clothingSuggestion = lang === "tr"
      ? `${clothingSuggestionTR} ${windAdviceTR}${humidityAdviceTR}`
      : `${clothingSuggestionEN} ${windAdviceEN}${humidityAdviceEN}`;

  
    // Prepare an object with the weather details.
    const extractedData = {
      location: weatherData.name,
      temperature: Math.round(weatherData.main.temp),
      feels_like: Math.round(weatherData.main.feels_like),
      min_temp: Math.round(weatherData.main.temp_min),
      max_temp: Math.round(weatherData.main.temp_max),
      humidity: weatherData.main.humidity,
      pressure: weatherData.main.pressure,
      wind_speed: Math.round(weatherData.wind.speed),
      wind_direction: weatherData.wind.deg,
      weather_condition: weatherData.weather[0].main,
      weather_description:
        weatherData.weather[0].description.charAt(0).toUpperCase() +
        weatherData.weather[0].description.slice(1),
      visibility: weatherData.visibility,
      cloudiness: weatherData.clouds.all,
      sunrise: new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString(),
      sunset: new Date(weatherData.sys.sunset * 1000).toLocaleTimeString(),
    };
  
    // Simple algorithm for umbrella recommendation.
    let umbrellaRecommendation = "";
    const rainConditionsEN = ["Rain", "Drizzle", "Thunderstorm", "Yağmur", "Çiseleme", "Gök gürültülü fırtına"];
    if (
      rainConditionsEN.includes(extractedData.weather_condition) ||
      extractedData.cloudiness > 80 ||
      extractedData.humidity > 90
    ) {
      umbrellaRecommendation = "Rain is likely, so recommend carrying an umbrella.";
    } else {
      umbrellaRecommendation = "An umbrella is unnecessary as there is no rain forecasted.";
    }
  
    // Build the combined prompt for Gemini API.
    const prompt = `
You are a professional meteorologist providing accurate weather insights.
Your goal is to deliver precise, concise, and expert-level weather analyses.
- Use professional meteorological language while giving the explanation friendly and simple.
- Give your response in the language ${lang}.
- Your response should be 20-30 words long.
Include:
- A one-sentence summary of the weather conditions.
- Clothing advice based on: ${clothingSuggestion}
- A one-sentence statement on umbrella necessity.

Weather data for ${extractedData.location}:
- Temperature: ${extractedData.temperature}°C (Feels like: ${extractedData.feels_like}°C)
- Min/Max: ${extractedData.min_temp}°C / ${extractedData.max_temp}°C
- Humidity: ${extractedData.humidity}%
- Pressure: ${extractedData.pressure} hPa
- Wind: ${extractedData.wind_speed} m/s at ${extractedData.wind_direction}°
- Condition: ${extractedData.weather_condition} (${extractedData.weather_description})
- Visibility: ${extractedData.visibility} meters
- Cloudiness: ${extractedData.cloudiness}%
- Sunrise: ${extractedData.sunrise}, Sunset: ${extractedData.sunset}

Suggestions:
- Clothing: ${clothingSuggestion}
- Umbrella: ${umbrellaRecommendation}
    `;
    } catch (error) {
      console.error("Error processing weather data:", error);
      console.error("Weather data received:", JSON.stringify(weatherData, null, 2));
      const fallbackMessage = lang === "tr"
        ? "Hava durumu verisi işlenirken hata oluştu."
        : "Error processing weather data.";
      return res.status(500).json({ suggestion: fallbackMessage });
    }
  
    // Call the Google Gemini API with a retry mechanism.
    const maxRetries = 3;
    let attempts = 0;
  
    while (attempts < maxRetries) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": GEMINI_API_KEY,
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }],
            generationConfig: {
              temperature: 0.8,
              maxOutputTokens: 100,
              topP: 0.95,
              topK: 40,
            }
          }),
        });
  
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
  
        const data = await response.json();
        console.log("prompt:", prompt);
        console.log("Gemini API Full Response:", JSON.stringify(data, null, 2));
  
        // Validate the response structure more thoroughly
        if (!data.candidates || data.candidates.length === 0) {
          throw new Error("No candidates in API response.");
        }
        
        const candidate = data.candidates[0];
        if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
          throw new Error("Invalid content structure in API response.");
        }
        
        const text = candidate.content.parts[0].text;
        if (!text || typeof text !== 'string' || text.trim() === "") {
          throw new Error("Empty or invalid text in API response.");
        }
  
        // Return the suggestion as JSON.
        return res.status(200).json({ suggestion: text });
      } catch (error) {
        console.error(`Attempt ${attempts + 1} - Error:`, error);
        console.error(`Error details:`, error.message);
        if (error.response) {
          console.error(`Response status:`, error.response.status);
          console.error(`Response data:`, error.response.data);
        }
        attempts++;
        if (attempts >= maxRetries) {
          const fallbackMessage =
            lang === "tr"
              ? "Şu anda yanıt oluşturamıyorum, lütfen bir dakika bekleyin."
              : "Could not generate an AI overview, please wait a minute.";
          return res.status(500).json({ suggestion: fallbackMessage });
        }
        // Add 1-second delay between retries
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  