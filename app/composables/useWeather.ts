const API_BASE = 'https://api.meteoci.chalenge14.com/api/weather'
const CACHE_KEY = 'meteoci_cache'
const CACHE_DURATION = 30 * 60 * 1000

interface ForecastDay {
  date: string
  temperature_max: number
  temperature_min: number
}

interface CityWeather {
  city: string
  country: string
  current: {
    temperature: number
    feels_like: number
    humidity: number
    wind_speed: number
    uv_index: number
  }
  forecast_7_days: ForecastDay[]
}

interface CacheEntry {
  data: CityWeather
  timestamp: number
}

interface Cache {
  [city: string]: CacheEntry
}

type CityData = {
  name: string
  country: string
  temp: number
  feels: number
  humidity: number
  wind: number
  uv: number
  weather: string
  forecast: number[]
  forecastMin: number[]
  forecastW: string[]
}

export const useWeather = () => {

  const weatherTypes: Record<string, { label: string; icon: string; bg: string }> = {
    sunny:        { label: 'Ensoleillé',            icon: '☀️',  bg: 'linear-gradient(135deg, #FF8C00, #FFB347, #FFD700)' },
    cloudy:       { label: 'Nuageux',               icon: '☁️',  bg: 'linear-gradient(135deg, #8E9EAB, #B0BEC5, #CFD8DC)' },
    rainy:        { label: 'Pluvieux',              icon: '🌧️', bg: 'linear-gradient(135deg, #2C3E50, #4CA1AF, #536976)' },
    stormy:       { label: 'Orageux',               icon: '⛈️', bg: 'linear-gradient(135deg, #1A1A2E, #16213E, #0F3460)' },
    partlyCloudy: { label: 'Partiellement nuageux', icon: '⛅',  bg: 'linear-gradient(135deg, #74b9ff, #a29bfe, #dfe6e9)' },
    clear:        { label: 'Dégagé',                icon: '🌙',  bg: 'linear-gradient(135deg, #0c0c2e, #1a1a4e, #2d2d7e)' },
  }

  const staticCities: CityData[] = [
    { name: 'Abidjan',      country: "Côte d'Ivoire", temp: 31, feels: 34, humidity: 78, wind: 12, uv: 9,  weather: 'sunny',        forecast: [32,30,29,33,31,30,28], forecastMin: [24,23,22,25,24,23,22], forecastW: ['sunny','partlyCloudy','rainy','sunny','sunny','partlyCloudy','rainy'] },
    { name: 'Yamoussoukro', country: "Côte d'Ivoire", temp: 29, feels: 32, humidity: 72, wind: 8,  uv: 8,  weather: 'partlyCloudy', forecast: [29,28,27,30,31,29,28], forecastMin: [22,21,20,23,24,22,21], forecastW: ['partlyCloudy','cloudy','rainy','sunny','sunny','partlyCloudy','cloudy'] },
    { name: 'Bouaké',       country: "Côte d'Ivoire", temp: 33, feels: 36, humidity: 65, wind: 10, uv: 10, weather: 'sunny',        forecast: [33,34,32,31,30,33,34], forecastMin: [25,26,24,23,22,25,26], forecastW: ['sunny','sunny','partlyCloudy','cloudy','rainy','sunny','sunny'] },
    { name: 'Dakar',        country: 'Sénégal',        temp: 26, feels: 28, humidity: 60, wind: 18, uv: 7,  weather: 'partlyCloudy', forecast: [26,25,27,28,26,25,24], forecastMin: [19,18,20,21,19,18,17], forecastW: ['partlyCloudy','cloudy','sunny','sunny','partlyCloudy','cloudy','rainy'] },
    { name: 'Lagos',        country: 'Nigéria',         temp: 30, feels: 33, humidity: 80, wind: 14, uv: 8,  weather: 'rainy',        forecast: [30,29,28,31,30,29,27], forecastMin: [23,22,21,24,23,22,20], forecastW: ['rainy','rainy','stormy','partlyCloudy','sunny','rainy','rainy'] },
    { name: 'Nairobi',      country: 'Kenya',           temp: 22, feels: 21, humidity: 55, wind: 16, uv: 6,  weather: 'cloudy',       forecast: [22,21,20,23,24,22,21], forecastMin: [15,14,13,16,17,15,14], forecastW: ['cloudy','rainy','rainy','partlyCloudy','sunny','cloudy','rainy'] },
    { name: 'Paris',        country: 'France',          temp: 14, feels: 11, humidity: 70, wind: 22, uv: 3,  weather: 'cloudy',       forecast: [14,12,13,15,16,14,13], forecastMin: [8,6,7,9,10,8,7],     forecastW: ['cloudy','rainy','rainy','partlyCloudy','sunny','cloudy','rainy'] },
    { name: 'New York',     country: 'États-Unis',      temp: 8,  feels: 4,  humidity: 50, wind: 28, uv: 2,  weather: 'clear',        forecast: [8,6,5,9,11,10,7],      forecastMin: [2,0,-1,3,5,4,1],     forecastW: ['clear','cloudy','rainy','partlyCloudy','sunny','clear','cloudy'] },
  ]

  const defaultCity: CityData = {
    name: 'Abidjan',
    country: "Côte d'Ivoire",
    temp: 31,
    feels: 34,
    humidity: 78,
    wind: 12,
    uv: 9,
    weather: 'sunny',
    forecast: [32,30,29,33,31,30,28],
    forecastMin: [24,23,22,25,24,23,22],
    forecastW: ['sunny','partlyCloudy','rainy','sunny','sunny','partlyCloudy','rainy']
  }

  const selectedCity = useState<CityData>('selectedCity', () => defaultCity)
  const city = computed<CityData>(() => selectedCity.value ?? defaultCity)
  const isLoading = useState<boolean>('isLoading', () => true)
  const apiSuccess = useState<boolean>('apiSuccess', () => false)
  const error = useState<string | null>('error', () => null)

  const getCache = (): Cache => {
    if (import.meta.client) {
      try {
        const raw = localStorage.getItem(CACHE_KEY)
        return raw ? JSON.parse(raw) : {}
      } catch { return {} }
    }
    return {}
  }

  const setCache = (cityName: string, data: CityWeather): void => {
    if (import.meta.client) {
      const cache = getCache()
      cache[cityName] = { data, timestamp: Date.now() }
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
    }
  }

  const getCached = (cityName: string): CityWeather | null => {
    const cache = getCache()
    const entry = cache[cityName]
    if (!entry) return null
    if (Date.now() - entry.timestamp > CACHE_DURATION) return null
    return entry.data
  }

  const getWeatherType = (temp: number, uv: number): string => {
    const hour = new Date().getHours()
    const isNight = hour < 6 || hour >= 20
    if (isNight) return 'clear'
    if (uv === 0) return 'cloudy'
    if (temp >= 30 && uv >= 7) return 'sunny'
    if (temp >= 25) return 'partlyCloudy'
    if (temp < 20) return 'rainy'
    return 'partlyCloudy'
  }

  const apiToCity = (data: CityWeather): CityData => ({
    name: data.city.replace(':', '').trim(),
    country: data.country,
    temp: Math.round(data.current.temperature),
    feels: Math.round(data.current.feels_like),
    humidity: data.current.humidity,
    wind: Math.round(data.current.wind_speed),
    uv: data.current.uv_index,
    weather: getWeatherType(data.current.temperature, data.current.uv_index),
    forecast: data.forecast_7_days.map(f => Math.round(f.temperature_max)),
    forecastMin: data.forecast_7_days.map(f => Math.round(f.temperature_min)),
    forecastW: data.forecast_7_days.map(f => getWeatherType(f.temperature_max, 5)),
  })

  const fetchCity = async (cityName: string): Promise<void> => {
    isLoading.value = true
    error.value = null

    const cached = getCached(cityName)
    if (cached) {
      selectedCity.value = apiToCity(cached)
      isLoading.value = false
      apiSuccess.value = true
      return
    }

    try {
      const data = await $fetch<CityWeather>(`${API_BASE}/${cityName}`)
      setCache(cityName, data)
      selectedCity.value = apiToCity(data)
      apiSuccess.value = true
    } catch (err) {
      error.value = 'Impossible de récupérer les données météo'
      const fallback = staticCities.find(c => c.name.toLowerCase() === cityName.toLowerCase())
      if (fallback) selectedCity.value = fallback
      apiSuccess.value = false
    } finally {
      isLoading.value = false
    }
  }

  return {
    weatherTypes,
    cities: staticCities,
    selectedCity,
    city,
    isLoading,
    apiSuccess,
    error,
    fetchCity,
  }
}