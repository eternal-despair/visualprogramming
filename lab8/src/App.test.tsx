// @vitest-environment jsdom
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App';
import * as api from './api/weatherApi';

// 1. мокаем весь наш файл с функциями запросов
vi.mock('./api/weatherApi');

describe('Weather App Testing', () => {
  it('Должно рендерить данные погоды из моков (без реальных запросов к API)', async () => {
    
    // 2. ПОДГОТОВКА ФЕЙКОВЫХ ДАННЫХ
    // Когда App попытается узнать город, отдаем ему "MockCity"
    vi.mocked(api.getCityCoordinates).mockResolvedValue({
      name: 'MockCity', lat: 55, lon: 37, country: 'RU'
    });

    // Когда App запросит погоду, отдаем ему температуру +25° и ясное небо
    vi.mocked(api.getWeatherForecast).mockResolvedValue([
      {
        dt: 123456789,
        main: { temp: 25, humidity: 50, pressure: 1000 },
        weather: [{ id: 800, main: 'Clear', description: 'ясно', icon: '01d' }],
        wind: { speed: 5 },
        dt_txt: '2023-10-25 15:00:00'
      }
    ]);

    // Когда App запросит загрязнение воздуха, отдаем AQI = 1
    vi.mocked(api.getAirPollution).mockResolvedValue({
      main: { aqi: 1 }
    });

    // 3. ЗАПУСК КОМПОНЕНТА В ВИРТУАЛЬНОМ БРАУЗЕРЕ
    render(<App />);

    // Сначала на экране должен быть текст загрузки
    expect(screen.getByText(/Загрузка погоды/i)).toBeInTheDocument();

    // 4. ПРОВЕРКА РЕЗУЛЬТАТА
    // Ждем, пока асинхронные фейковые запросы "выполнятся" и интерфейс обновится
    await waitFor(() => {
      // Проверяем, появился ли наш фейковый город на экране
      expect(screen.getByText('MockCity')).toBeInTheDocument();
      // Проверяем, появилась ли фейковая температура (+25)
      expect(screen.getByText('+25°')).toBeInTheDocument();
    });
  });
});