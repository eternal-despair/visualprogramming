export interface City {
  name: string;
  lat: number;
  lon: number;
  country: string;
}

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
    icon: string;
  }[];
  wind: {
    speed: number;
  };
  dt_txt: string;
}

export interface AirPollution {
  main: {
    aqi: number;
  }
}