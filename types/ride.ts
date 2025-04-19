export interface RideLocation {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface Ride {
  id: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  duration: number; // in seconds
  distance: number; // in meters
  startLocation?: string;
  endLocation?: string;
  locations: RideLocation[];
  averageSpeed: number; // in meters per second
  elevationGain?: number; // in meters
  caloriesBurned?: number;
}