import { getCurrentWeather } from './weatherService.js';

export default async function handler(req, res) {
  const { city, lang } = req.query; // Extract the lang parameter
  if (!city) {
    return res.status(400).json({ error: "Missing city parameter" });
  }
  // Use the provided lang parameter or default to English if not set
  const language = lang || "en";
  
  try {
    const data = await getCurrentWeather({ city, lang: language });
    res.status(200).json(data);
  } catch (error) {
    // Handle specific error cases based on status code
    if (error.statusCode === 404) {
      return res.status(404).json({ error: "City not found" });
    }
    res.status(500).json({ error: error.message });
  }
}
