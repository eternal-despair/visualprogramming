// Координаты города
export interface City {
  name: string;
  lat: number;
  lon: number;
  country: string;
}

// Погода в конкретный момент времени (из ответа API)
export interface WeatherData {
  dt: number;
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string; // ID иконки ('1d')
  }[];
  wind: {
    speed: number;
  };
  dt_txt: string;
}

// Загрязнение воздуха
export interface AirPollution {
  main: {
    aqi: number; // Индекс качества воздуха (1 - отлично, 5 - очень плохо)
  }
}