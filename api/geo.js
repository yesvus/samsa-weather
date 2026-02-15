import { getGeocode } from './weatherService.js';

export default async function handler(req, res) {
    const { city } = req.query;
    if (!city) {
      res.status(400).json({ error: "Missing city parameter" });
      return;
    }
  
    try {
      const data = await getGeocode({ city });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  