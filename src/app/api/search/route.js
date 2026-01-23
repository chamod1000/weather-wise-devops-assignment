import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!query) {
    return NextResponse.json([]);
  }

  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`;

  try {
    const response = await axios.get(url);
    const suggestions = response.data.map(item => ({
      name: item.name,
      country: item.country,
      state: item.state,
      lat: item.lat,
      lon: item.lon
    }));
    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("Geocoding error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
