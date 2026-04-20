import { useState, useEffect } from 'react';
import { getCityCoordinates, getWeatherForecast, getAirPollution } from './api/weatherApi';
import type { WeatherData, AirPollution } from './types';
import { getWeatherTheme } from './utils/helpers';
import { SearchBar } from './components/SearchBar';
import { CurrentWeather } from './components/CurrentWeather';
import { HourlyForecast } from './components/HourlyForecast';
import './App.css';

function App() {
  const [city, setCity] = useState<string>('Novosibirsk'); // По умолчанию Москва
  const [forecast, setForecast] = useState<WeatherData[]>([]);
  const [pollution, setPollution] = useState<AirPollution | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Функция загрузки всех данных
  const fetchData = async (cityName: string) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Ищем город
      const cityData = await getCityCoordinates(cityName);
      setCity(cityData.name);

      // 2. Получаем прогноз
      const weatherData = await getWeatherForecast(cityData.lat, cityData.lon);
      setForecast(weatherData);

      // 3. Получаем загрязнение
      const pollutionData = await getAirPollution(cityData.lat, cityData.lon);
      setPollution(pollutionData);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  // Вызывается при первом запуске и при смене города
  useEffect(() => {
    fetchData(city);

    //Обновление каждые 3 часа
    const interval = setInterval(() => {
      fetchData(city);
    }, 10800000);

    // Очистка таймера при размонтировании (правило хорошего тона в React)
    return () => clearInterval(interval);
  }, [city]); // Зависимость от city (если юзер ввел другой город, таймер перезапустится)

  const handleSearch = (newCity: string) => {
    setCity(newCity);
  };

  // Узнаем текущую погоду
  const currentWeather = forecast.length > 0 ? forecast[0] : null;
  
  // Получаем класс цвета фона (солнечно, дождь, ночь)
  const themeClass = currentWeather 
    ? getWeatherTheme(currentWeather.weather[0].icon) 
    : 'theme-sunny';

  return (
    <div className={`app-container ${themeClass}`}>
      <div className="weather-widget">
        <SearchBar onSearch={handleSearch} />

        {loading && <p className="status-text">Загрузка погоды...</p>}
        {error && <p className="status-text error">{error}</p>}

        {!loading && !error && currentWeather && (
          <>
            <CurrentWeather 
              city={city} 
              current={currentWeather} 
              pollution={pollution} 
            />
            <HourlyForecast forecast={forecast} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;