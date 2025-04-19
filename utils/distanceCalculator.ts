export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  // Implementation of the Haversine formula to calculate distance between two coordinates
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

export const calculateTotalDistance = (locations: { latitude: number; longitude: number }[]): number => {
  if (locations.length < 2) return 0;

  let totalDistance = 0;
  for (let i = 1; i < locations.length; i++) {
    const prevLocation = locations[i - 1];
    const currentLocation = locations[i];
    
    totalDistance += calculateDistance(
      prevLocation.latitude,
      prevLocation.longitude,
      currentLocation.latitude,
      currentLocation.longitude
    );
  }

  return totalDistance;
};