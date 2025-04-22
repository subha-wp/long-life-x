import { LocationService } from "./LocationService";
import { NotificationService } from "./NotificationService";
import { useTrackingStore } from "@/stores/trackingStore";
import { useSettings } from "@/hooks/useSettings";
import { calculateDistance } from "@/utils/distanceCalculator";
import { formatDistance, formatDuration } from "@/utils/formatter";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export class RideDetectionService {
  private locationService: LocationService | null = null;
  private notificationService: NotificationService;
  private detectionIntervalId: NodeJS.Timeout | null = null;
  private lastDetectionTime: number = 0;
  private isRiding: boolean = false;
  private lastLocation: any = null;
  private isPaused: boolean = false;
  private idleStartTime: number | null = null;
  private updateInterval: number = 1000; // Update every second

  constructor() {
    this.locationService = new LocationService();
    this.notificationService = NotificationService.getInstance();
    if (Platform.OS !== "web") {
      this.setupNotificationListeners();
    }
  }

  private setupNotificationListeners() {
    Notifications.addNotificationResponseReceivedListener((response) => {
      const actionId = response.actionIdentifier;
      const { pauseTracking, stopTracking } = useTrackingStore.getState();

      switch (actionId) {
        case "PAUSE_RIDE":
          this.isPaused = true;
          pauseTracking();
          break;
        case "STOP_RIDE":
          this.stopRideDetection();
          break;
      }
    });
  }

  async startRideDetection(): Promise<void> {
    if (this.detectionIntervalId) return;

    try {
      await this.locationService?.startLocationTracking();
      this.lastDetectionTime = Date.now();
      this.isRiding = true;
      this.isPaused = false;
      this.idleStartTime = null;

      // Get settings
      const { settings } = useSettings.getState();

      // Set up detection interval
      this.detectionIntervalId = setInterval(
        () => this.detectRide(),
        this.updateInterval
      );

      // Set up location update callback
      this.locationService?.setLocationUpdateCallback(
        this.handleLocationUpdate
      );
    } catch (error) {
      console.error("Error starting ride detection:", error);
      throw error;
    }
  }

  async stopRideDetection(): Promise<void> {
    if (!this.detectionIntervalId) return;

    clearInterval(this.detectionIntervalId);
    this.detectionIntervalId = null;

    const locations =
      (await this.locationService?.stopLocationTracking()) || [];
    const { finalizeRide } = useTrackingStore.getState();

    await this.notificationService.clearRideNotification();

    if (locations.length > 0) {
      finalizeRide(locations);
    }
  }

  private handleLocationUpdate = (location: any): void => {
    const { updateCurrentLocation } = useTrackingStore.getState();
    updateCurrentLocation(location);

    if (this.lastLocation) {
      const distance = calculateDistance(
        this.lastLocation.latitude,
        this.lastLocation.longitude,
        location.latitude,
        location.longitude
      );

      const timeDiff =
        (location.timestamp - this.lastLocation.timestamp) / 1000; // in seconds
      if (timeDiff > 0) {
        const speed = distance / timeDiff; // in meters per second
        this.detectSpeedChange(speed);
      }

      if (distance > 0) {
        const { updateCurrentDistance } = useTrackingStore.getState();
        updateCurrentDistance(distance);
      }
    }

    this.lastLocation = location;
  };

  private detectRide(): void {
    const currentTime = Date.now();
    const { settings } = useSettings.getState();
    const { currentDistance, currentDuration, updateCurrentDuration } =
      useTrackingStore.getState();

    // Update duration if not paused
    if (this.isRiding && !this.isPaused) {
      const elapsed = Math.floor((currentTime - this.lastDetectionTime) / 1000);
      updateCurrentDuration(1); // Increment by 1 second
    }

    // Update notification with current stats
    if (!this.isPaused) {
      this.notificationService.updateRideNotification(
        formatDistance(currentDistance),
        formatDuration(currentDuration)
      );
    }

    this.lastDetectionTime = currentTime;

    // Auto-pause if idle for too long
    if (
      settings.autoPause &&
      this.isRiding &&
      !this.isPaused &&
      this.idleStartTime
    ) {
      const idleTime = currentTime - this.idleStartTime;
      if (idleTime > settings.maxIdleTime) {
        this.isPaused = true;
        const { pauseTracking } = useTrackingStore.getState();
        pauseTracking();
      }
    }
  }

  private detectSpeedChange(speed: number): void {
    const { settings } = useSettings.getState();
    const { isTracking, isPaused, resumeTracking, pauseTracking } =
      useTrackingStore.getState();

    if (!isTracking) return;

    // Auto-pause functionality
    if (settings.autoPause) {
      if (speed < settings.minSpeedThreshold) {
        // If we're moving slow, possibly stopped
        if (!this.idleStartTime) {
          this.idleStartTime = Date.now();
        }
      } else {
        // We're moving fast enough to be considered riding
        this.idleStartTime = null;

        // If we were paused, resume tracking
        if (isPaused) {
          this.isPaused = false;
          resumeTracking();
        }
      }
    }
  }
}
