import type { City, WeatherData, AirPollution } from '../types';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// 1. Функция поиска города по названию
export const getCityCoordinates = async (cityName: string): Promise<City> => {
  // Делаем запрос к Geocoding API
  const response = await fetch(`${GEO_URL}/direct?q=${cityName}&limit=1&appid=${API_KEY}`);
  if (!response.ok) throw new Error('Ошибка при поиске города');
  
  const data = await response.json();
  if (data.length === 0) throw new Error('Город не найден');
  
  return data[0]; // Возвращаем первый найденный город
};

// 2. Функция получения прогноза погоды по координатам
export const getWeatherForecast = async (lat: number, lon: number): Promise<WeatherData[]> => {
  const response = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
  if (!response.ok) throw new Error('Ошибка загрузки погоды');
  
  const data = await response.json();
  return data.list; // API возвращает массив list с прогнозами
};

// 3. Функция получения данных о загрязнении воздуха
export const getAirPollution = async (lat: number, lon: number): Promise<AirPollution> => {
  const response = await fetch(`${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
  if (!response.ok) throw new Error('Ошибка загрузки данных о воздухе');
  
  const data = await response.json();
  return data.list[0]; // Берем текущее загрязнение
};

console.log('update');