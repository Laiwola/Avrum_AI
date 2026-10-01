import axios from "axios";

interface WeatherResult {
  location: {
    latitude: number;
    longitude: number;
  };
  current: {
    temperature: number | null;
    humidity: number | null;
    precipitation: number | null;
  };
  forecast: Array<{
    date: string;
    temperatureMax: number | null;
    temperatureMin: number | null;
    humidity: number | null;
    rainfall: number | null;
    rain: number | null;
  }>;
}

export async function getFieldWeather(
  latitude: number,
  longitude: number
): Promise<WeatherResult> {
  const response = await axios.get(
    "https://api.open-meteo.com/v1/forecast",
    {
      params: {
        latitude,
        longitude,

        current:
          "temperature_2m,relative_humidity_2m,precipitation",

        daily:
          "temperature_2m_max,temperature_2m_min,relative_humidity_2m_mean,precipitation_sum,rain_sum",

        forecast_days: 7,

        timezone: "auto",

        temperature_unit: "celsius",

        precipitation_unit: "mm",
      },
      timeout: 10000,
    }
  );

  const data = response.data;

  return {
    location: {
      latitude,
      longitude,
    },

    current: {
      temperature:
        data.current?.temperature_2m ?? null,

      humidity:
        data.current?.relative_humidity_2m ?? null,

      precipitation:
        data.current?.precipitation ?? null,
    },

    forecast: (data.daily?.time || []).map(
      (date: string, index: number) => ({
        date,

        temperatureMax:
          data.daily.temperature_2m_max?.[index] ?? null,

        temperatureMin:
          data.daily.temperature_2m_min?.[index] ?? null,

        humidity:
          data.daily.relative_humidity_2m_mean?.[index] ?? null,

        rainfall:
          data.daily.precipitation_sum?.[index] ?? null,

        rain:
          data.daily.rain_sum?.[index] ?? null,
      })
    ),
  };
}

export async function getFieldSoilMoisture(
  latitude: number,
  longitude: number
) {
  const response = await axios.get(
    "https://api.open-meteo.com/v1/forecast",
    {
      params: {
        latitude,
        longitude,

        current:
          "soil_moisture_0_to_1cm,soil_moisture_1_to_3cm,soil_moisture_3_to_9cm,soil_moisture_9_to_27cm",

        timezone: "auto",
      },

      timeout: 10000,
    }
  );

  const current = response.data.current;

  return {
    timestamp: current?.time ?? null,

    moisture: {
      "0_1cm":
        current?.soil_moisture_0_to_1cm ?? null,

      "1_3cm":
        current?.soil_moisture_1_to_3cm ?? null,

      "3_9cm":
        current?.soil_moisture_3_to_9cm ?? null,

      "9_27cm":
        current?.soil_moisture_9_to_27cm ?? null,
    },
  };
}