// Unified Weather Service with In-Memory Caching
// This service consolidates all OpenWeatherMap API calls with caching to:
// 1. Reduce duplicate API requests
// 2. Improve response times
// 3. Save API quota
// 4. Prevent rate limiting issues

// Cache configuration
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes in milliseconds (configurable)

// In-memory cache structure: { key: { data, timestamp } }
const cache = {};

/**
 * Generates a cache key based on endpoint type and parameters
 * @param {string} type - Type of API call (weather, forecast, air-quality, uv, geo)
 * @param {Object} params - Query parameters (city, lat, lon, lang)
 * @returns {string} Cache key
 */
function getCacheKey(type, params) {
  const { city, lat, lon, lang } = params;
  if (city) {
    return `${type}:city:${city}:${lang || 'en'}`;
  }
  if (lat && lon) {
    return `${type}:coords:${lat}:${lon}`;
  }
  return null;
}

/**
 * Checks if cached data is still valid
 * @param {Object} cachedEntry - Cache entry with data and timestamp
 * @returns {boolean} True if cache is valid, false otherwise
 */
function isCacheValid(cachedEntry) {
  if (!cachedEntry || !cachedEntry.timestamp) {
    return false;
  }
  const age = Date.now() - cachedEntry.timestamp;
  return age < CACHE_TTL;
}

/**
 * Retrieves data from cache if valid
 * @param {string} cacheKey - The cache key
 * @returns {Object|null} Cached data or null if not found/expired
 */
function getFromCache(cacheKey) {
  if (!cacheKey) return null;
  
  const cachedEntry = cache[cacheKey];
  if (isCacheValid(cachedEntry)) {
    return cachedEntry.data;
  }
  
  // Remove expired cache entry
  if (cachedEntry) {
    delete cache[cacheKey];
  }
  
  return null;
}

/**
 * Stores data in cache with current timestamp
 * @param {string} cacheKey - The cache key
 * @param {Object} data - Data to cache
 */
function setCache(cacheKey, data) {
  if (!cacheKey) return;
  
  cache[cacheKey] = {
    data,
    timestamp: Date.now()
  };
}

/**
 * Makes an API call to OpenWeatherMap with caching
 * @param {string} url - Full API URL
 * @param {string} cacheKey - Cache key for this request
 * @returns {Promise<Object>} API response data
 */
async function fetchWithCache(url, cacheKey) {
  // Check cache first
  const cachedData = getFromCache(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  
  // Make API call
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // Store in cache
  setCache(cacheKey, data);
  
  return data;
}

/**
 * Fetches current weather data
 * @param {Object} params - { city?, lat?, lon?, lang? }
 * @returns {Promise<Object>} Weather data
 */
export async function getCurrentWeather(params) {
  const { city, lat, lon, lang = 'en' } = params;
  const apiKey = process.env.OW_API_KEY;
  
  if (!apiKey) {
    throw new Error('Missing OW_API_KEY');
  }
  
  let url;
  if (city) {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}&lang=${lang}`;
  } else if (lat && lon) {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=${lang}`;
  } else {
    throw new Error('Either city or lat/lon coordinates required');
  }
  
  const cacheKey = getCacheKey('weather', params);
  return fetchWithCache(url, cacheKey);
}

/**
 * Fetches forecast data
 * @param {Object} params - { city?, lat?, lon? }
 * @returns {Promise<Object>} Forecast data
 */
export async function getForecast(params) {
  const { city, lat, lon } = params;
  const apiKey = process.env.OW_API_KEY;
  
  if (!apiKey) {
    throw new Error('Missing OW_API_KEY');
  }
  
  let url;
  if (city) {
    url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
  } else if (lat && lon) {
    url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  } else {
    throw new Error('Either city or lat/lon coordinates required');
  }
  
  const cacheKey = getCacheKey('forecast', params);
  return fetchWithCache(url, cacheKey);
}

/**
 * Fetches air quality data
 * @param {Object} params - { lat, lon }
 * @returns {Promise<Object>} Air quality data
 */
export async function getAirQuality(params) {
  const { lat, lon } = params;
  const apiKey = process.env.OW_API_KEY;
  
  if (!apiKey) {
    throw new Error('Missing OW_API_KEY');
  }
  
  if (!lat || !lon) {
    throw new Error('Latitude and longitude required for air quality');
  }
  
  const url = `https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  const cacheKey = getCacheKey('air-quality', params);
  return fetchWithCache(url, cacheKey);
}

/**
 * Fetches UV index data
 * @param {Object} params - { lat, lon }
 * @returns {Promise<Object>} UV index data
 */
export async function getUVIndex(params) {
  const { lat, lon } = params;
  const apiKey = process.env.OW_API_KEY;
  
  if (!apiKey) {
    throw new Error('Missing OW_API_KEY');
  }
  
  if (!lat || !lon) {
    throw new Error('Latitude and longitude required for UV index');
  }
  
  const url = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  const cacheKey = getCacheKey('uv', params);
  return fetchWithCache(url, cacheKey);
}

/**
 * Fetches geocoding data (coordinates for a city name)
 * @param {Object} params - { city }
 * @returns {Promise<Object>} Geocoding data
 */
export async function getGeocode(params) {
  const { city } = params;
  const apiKey = process.env.OW_API_KEY;
  
  if (!apiKey) {
    throw new Error('Missing OW_API_KEY');
  }
  
  if (!city) {
    throw new Error('City name required for geocoding');
  }
  
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`;
  const cacheKey = getCacheKey('geo', params);
  return fetchWithCache(url, cacheKey);
}

// Export cache management functions for testing/debugging
export function clearCache() {
  Object.keys(cache).forEach(key => delete cache[key]);
}

export function getCacheStats() {
  const now = Date.now();
  const entries = Object.keys(cache).map(key => ({
    key,
    age: now - cache[key].timestamp,
    valid: isCacheValid(cache[key])
  }));
  return {
    totalEntries: entries.length,
    validEntries: entries.filter(e => e.valid).length,
    entries
  };
}
