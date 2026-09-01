export const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

export type LandmarkQuery = {
  title: string;
  query: string;
  current: boolean;
  completed: boolean;
};

export function placeEmbedUrl(query: string) {
  const q = query.trim();
  if (!q) return '';
  if (GOOGLE_MAPS_KEY) {
    return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(GOOGLE_MAPS_KEY)}&q=${encodeURIComponent(q)}`;
  }
  return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=8&hl=en&output=embed`;
}

export function directionsEmbedUrl(queries: string[]) {
  const places = queries.map((item) => item.trim()).filter(Boolean);
  if (!places.length) return '';
  if (places.length === 1) return placeEmbedUrl(places[0]);
  if (GOOGLE_MAPS_KEY) {
    const origin = encodeURIComponent(places[0]);
    const destination = encodeURIComponent(places[places.length - 1]);
    const waypoints = places.slice(1, -1).map(encodeURIComponent).join('|');
    return `https://www.google.com/maps/embed/v1/directions?key=${encodeURIComponent(GOOGLE_MAPS_KEY)}&origin=${origin}&destination=${destination}${
      waypoints ? `&waypoints=${waypoints}` : ''
    }`;
  }
  const origin = encodeURIComponent(places[0]);
  const rest = places.slice(1).map(encodeURIComponent).join('+to:');
  return `https://maps.google.com/maps?saddr=${origin}&daddr=${rest}&hl=en&output=embed`;
}

export function mapsSearchUrl(query: string) {
  const q = query.trim();
  if (!q) return '';
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

export function mapsDirUrl(queries: string[]) {
  const places = queries.map((item) => item.trim()).filter(Boolean);
  if (!places.length) return '';
  if (places.length === 1) return mapsSearchUrl(places[0]);
  const origin = encodeURIComponent(places[0]);
  const destination = encodeURIComponent(places[places.length - 1]);
  const waypoints = places.slice(1, -1).map(encodeURIComponent).join('|');
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${
    waypoints ? `&waypoints=${waypoints}` : ''
  }`;
}
