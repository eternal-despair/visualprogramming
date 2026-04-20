// Получаем красивый цвет фона в зависимости от погоды
export const getWeatherTheme = (iconCode: string) => {
  if (iconCode.includes('d')) { // 'd' значит day (день)
    if (iconCode === '01d' || iconCode === '02d') return 'theme-sunny'; // Ясно
    if (iconCode.includes('09') || iconCode.includes('10')) return 'theme-rainy'; // Дождь
    return 'theme-cloudy'; // Облачно
  } else {
    return 'theme-night'; // 'n' значит night (ночь)
  }
};

// Форматируем время из "2023-10-25 15:00:00" в "15:00"
export const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
};

// Превращаем УФ-индекс загрязнения воздуха во что-то понятное
export const getAqiDescription = (aqi: number) => {
  switch (aqi) {
    case 1: return 'Отлично (1)';
    case 2: return 'Хорошо (2)';
    case 3: return 'Умеренно (3)';
    case 4: return 'Плохо (4)';
    case 5: return 'Очень плохо (5)';
    default: return 'Неизвестно';
  }
};