import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!city && (!lat || !lon)) {
    return NextResponse.json({ error: 'City name or coordinates required' }, { status: 400 });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;

  let url = '';
  if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  } else {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  }

  try {
    const weatherResponse = await axios.get(url);
    const weatherData = weatherResponse.data;

    const { lon, lat } = weatherData.coord;
    const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    
    let aqiData = null;
    try {
        const aqiResponse = await axios.get(aqiUrl);
        aqiData = aqiResponse.data.list[0];
    } catch (err) {
        console.error("Failed to fetch AQI", err);
    }

    return NextResponse.json({ ...weatherData, aqi: aqiData });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
  }
}
