import { getForecast } from './weatherService.js';

export default async function handler(req, res) {
    const { city } = req.query;
    if (!city) {
      res.status(400).json({ error: "Missing city parameter" });
      return;
    }
  
    try {
      const data = await getForecast({ city });
      res.status(200).json(data);
    } catch (error) {
      // Handle specific error cases based on status code
      if (error.statusCode === 404) {
        return res.status(404).json({ error: "City not found" });
      }
      res.status(500).json({ error: error.message });
    }
  }
  