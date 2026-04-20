import React from 'react';
import type { WeatherData, AirPollution } from '../types';
import { getAqiDescription } from '../utils/helpers';

interface CurrentWeatherProps {
  city: string;
  current: WeatherData;
  pollution: AirPollution | null;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ city, current, pollution }) => {
  const iconUrl = `https://openweathermap.org/img/wn/${current.weather[0].icon}@4x.png`;
  
  // Math.round округляет температуру (27.4 -> 27)
  const temp = Math.round(current.main.temp);

  return (
    <div className="current-weather">
      <h2>{city}</h2>
      <div className="main-info">
        <h1 className="temp">{temp > 0 ? `+${temp}` : temp}°</h1>
        <div className="weather-icon-wrapper">
          <img src={iconUrl} alt="Погода" className="main-icon" />
          <p>{current.weather[0].description}</p>
        </div>
      </div>
      
      <div className="details-row">
        <div className="detail">
          <span>Влажность</span>
          <strong>{current.main.humidity}%</strong>
        </div>
        <div className="detail">
          <span>Ветер</span>
          <strong>{Math.round(current.wind.speed)} м/с</strong>
        </div>
        <div className="detail">
          <span>Воздух (AQI)</span>
          <strong>{pollution ? getAqiDescription(pollution.main.aqi) : '...'}</strong>
        </div>
      </div>
    </div>
  );
};