export interface Settings {
  autoPause: boolean;
  backgroundTracking: boolean;
  useMetricSystem: boolean;
  autoShareRides: boolean;
  trackingInterval: number; // in milliseconds
  minSpeedThreshold: number; // in meters per second
  maxIdleTime: number; // in milliseconds
}

export const defaultSettings: Settings = {
  autoPause: true,
  backgroundTracking: true,
  useMetricSystem: true,
  autoShareRides: false,
  trackingInterval: 3000, // 3 seconds
  minSpeedThreshold: 2.7, // ~ 10 km/h
  maxIdleTime: 60000, // 1 minute
};