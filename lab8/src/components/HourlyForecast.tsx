import React from 'react';
import type { WeatherData } from '../types';
import { formatTime } from '../utils/helpers';

interface HourlyForecastProps {
  forecast: WeatherData[];
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ forecast }) => {
  const nextHours = forecast.slice(0, 5);

  return (
    <div className="hourly-forecast">
      {nextHours.map((item) => (
        <div key={item.dt} className="hour-item">
          <span className="time">{formatTime(item.dt_txt)}</span>
          <img 
            src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`} 
            alt="icon" 
          />
          <span className="hour-temp">{Math.round(item.main.temp)}°</span>
        </div>
      ))}
    </div>
  );
};