// @ts-nocheck
import * as Location from 'expo-location';
import { Platform } from 'react-native';
import { RideLocation } from '@/types/ride';
import { useSettings } from '@/hooks/useSettings';

export class LocationService {
  private isTracking: boolean = false;
  private isPaused: boolean = false;
  private locationSubscription: Location.LocationSubscription | null = null;
  private locations: RideLocation[] = [];
  private lastLocation: Location.LocationObject | null = null;
  private onLocationUpdate: ((location: RideLocation) => void) | null = null;

  constructor() {}

  async startLocationTracking(): Promise<void> {
    if (this.isTracking) return;

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission not granted');
      }

      // Get settings
      const { settings } = useSettings.getState();

      // Request background permissions if needed and available
      if (Platform.OS !== 'web' && settings.backgroundTracking) {
        const { status: backgroundStatus } =
          await Location.requestBackgroundPermissionsAsync();
        console.log('Background location permission:', backgroundStatus);
      }

      // Set accuracy to highest
      await Location.setGoogleDistanceIntervalAsync(1); // 1 meter

      // Start watching position
      this.locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 1, // minimum change (in meters) to trigger an update
          timeInterval: settings.trackingInterval,
        },
        this.handleLocationUpdate
      );

      this.isTracking = true;
      this.isPaused = false;
      this.locations = [];
    } catch (error) {
      console.error('Error starting location tracking:', error);
      throw error;
    }
  }

  async pauseLocationTracking(): Promise<void> {
    this.isPaused = true;
  }

  async resumeLocationTracking(): Promise<void> {
    this.isPaused = false;
  }

  async stopLocationTracking(): Promise<RideLocation[]> {
    if (!this.isTracking) return this.locations;

    if (this.locationSubscription) {
      this.locationSubscription.remove();
      this.locationSubscription = null;
    }

    this.isTracking = false;
    this.isPaused = false;
    const locations = [...this.locations];
    this.locations = [];
    this.lastLocation = null;

    return locations;
  }

  setLocationUpdateCallback(callback: (location: RideLocation) => void): void {
    this.onLocationUpdate = callback;
  }

  getLastLocation(): Location.LocationObject | null {
    return this.lastLocation;
  }

  getLocations(): RideLocation[] {
    return this.locations;
  }

  private handleLocationUpdate = (location: Location.LocationObject): void => {
    if (this.isPaused) return;

    this.lastLocation = location;

    const rideLocation: RideLocation = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      timestamp: location.timestamp,
    };

    this.locations.push(rideLocation);

    if (this.onLocationUpdate) {
      this.onLocationUpdate(rideLocation);
    }
  };
}
