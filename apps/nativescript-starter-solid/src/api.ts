// A pretend backend: every call resolves after a delay so the UI has real
// latency to render around. Nothing here knows about Solid.

export interface Region {
  id: string;
  name: string;
}

export interface City {
  id: string;
  name: string;
  country: string;
  population: number;
}

export interface Weather {
  temp: number;
  sky: string;
  icon: string;
}

export const regions: Region[] = [
  { id: 'europe', name: 'Europe' },
  { id: 'asia', name: 'Asia' },
  { id: 'americas', name: 'Americas' },
  { id: 'oceania', name: 'Oceania' },
];

const cities: Record<string, City[]> = {
  europe: [
    { id: 'lisbon', name: 'Lisbon', country: 'Portugal', population: 545000 },
    { id: 'paris', name: 'Paris', country: 'France', population: 2100000 },
    { id: 'oslo', name: 'Oslo', country: 'Norway', population: 709000 },
    { id: 'rome', name: 'Rome', country: 'Italy', population: 2750000 },
  ],
  asia: [
    { id: 'tokyo', name: 'Tokyo', country: 'Japan', population: 14000000 },
    { id: 'seoul', name: 'Seoul', country: 'South Korea', population: 9400000 },
    { id: 'hanoi', name: 'Hanoi', country: 'Vietnam', population: 8400000 },
  ],
  americas: [
    { id: 'portland', name: 'Portland', country: 'USA', population: 630000 },
    { id: 'mexico-city', name: 'Mexico City', country: 'Mexico', population: 9200000 },
    { id: 'lima', name: 'Lima', country: 'Peru', population: 10100000 },
  ],
  oceania: [
    { id: 'sydney', name: 'Sydney', country: 'Australia', population: 5300000 },
    { id: 'auckland', name: 'Auckland', country: 'New Zealand', population: 1700000 },
  ],
};

const weather: Record<string, Weather> = {
  lisbon: { temp: 22, sky: 'Sunny', icon: '☀️' },
  paris: { temp: 18, sky: 'Partly cloudy', icon: '⛅️' },
  oslo: { temp: 9, sky: 'Light rain', icon: '🌧️' },
  rome: { temp: 25, sky: 'Clear', icon: '☀️' },
  tokyo: { temp: 21, sky: 'Cloudy', icon: '☁️' },
  seoul: { temp: 17, sky: 'Breezy', icon: '🌬️' },
  hanoi: { temp: 31, sky: 'Humid', icon: '🌤️' },
  portland: { temp: 14, sky: 'Drizzle', icon: '🌦️' },
  'mexico-city': { temp: 23, sky: 'Sunny', icon: '☀️' },
  lima: { temp: 19, sky: 'Overcast', icon: '☁️' },
  sydney: { temp: 24, sky: 'Clear', icon: '☀️' },
  auckland: { temp: 16, sky: 'Showers', icon: '🌦️' },
};

const favorites = new Set<string>(['paris']);

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// Oceania fails on its first request so the error boundary has something to catch.
let oceaniaRequests = 0;

export async function fetchCities(regionId: string): Promise<City[]> {
  await wait(700);
  if (regionId === 'oceania' && oceaniaRequests++ === 0) {
    throw new Error('Oceania timed out.');
  }
  return cities[regionId];
}

export async function fetchWeather(cityId: string): Promise<Weather> {
  await wait(450);
  return weather[cityId];
}

export async function fetchFavorites(): Promise<string[]> {
  await wait(300);
  return [...favorites];
}

export async function saveFavorite(cityId: string, isFavorite: boolean): Promise<void> {
  await wait(900);
  if (isFavorite) favorites.add(cityId);
  else favorites.delete(cityId);
}
