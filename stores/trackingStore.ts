import { create } from 'zustand';
import { Ride, RideLocation } from '@/types/ride';
import { RideHistoryService } from '@/services/RideHistoryService';

interface TrackingState {
  isTracking: boolean;
  isPaused: boolean;
  currentDistance: number;
  currentDuration: number;
  currentLocation: RideLocation | null;
  startTime: Date | null;
  locations: RideLocation[];
  lastRide: Ride | null;
  todayDistance: number;
  
  startTracking: () => void;
  pauseTracking: () => void;
  resumeTracking: () => void;
  stopTracking: () => void;
  updateCurrentDistance: (distance: number) => void;
  updateCurrentDuration: (seconds: number) => void;
  updateCurrentLocation: (location: RideLocation) => void;
  finalizeRide: (locations: RideLocation[]) => void;
}

export const useTrackingStore = create<TrackingState>((set, get) => ({
  isTracking: false,
  isPaused: false,
  currentDistance: 0,
  currentDuration: 0,
  currentLocation: null,
  startTime: null,
  locations: [],
  lastRide: null,
  todayDistance: 0,
  
  startTracking: () => {
    set({
      isTracking: true,
      isPaused: false,
      currentDistance: 0,
      currentDuration: 0,
      startTime: new Date(),
      locations: [],
    });
  },
  
  pauseTracking: () => {
    set({ isPaused: true });
  },
  
  resumeTracking: () => {
    set({ isPaused: false });
  },
  
  stopTracking: () => {
    set({
      isTracking: false,
      isPaused: false,
    });
  },
  
  updateCurrentDistance: (distance: number) => {
    set(state => ({
      currentDistance: state.currentDistance + distance,
      todayDistance: state.todayDistance + distance,
    }));
  },
  
  updateCurrentDuration: (seconds: number) => {
    set(state => ({
      currentDuration: state.currentDuration + seconds,
    }));
  },
  
  updateCurrentLocation: (location: RideLocation) => {
    set(state => ({
      currentLocation: location,
      locations: [...state.locations, location],
    }));
  },
  
  finalizeRide: async (locations: RideLocation[]) => {
    const { currentDistance, currentDuration, startTime } = get();
    
    if (!startTime || currentDistance === 0 || locations.length < 2) {
      // Don't save if there's no meaningful data
      return;
    }
    
    const endTime = new Date();
    const averageSpeed = currentDistance / (currentDuration > 0 ? currentDuration : 1);
    
    // Calculate elevation and other metrics if available
    // This would require additional processing of location data
    
    const ride: Ride = {
      id: `ride-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      date: new Date(),
      startTime: startTime,
      endTime: endTime,
      duration: currentDuration,
      distance: currentDistance,
      startLocation: 'Starting point', // Would need reverse geocoding
      endLocation: 'Ending point', // Would need reverse geocoding
      locations: locations,
      averageSpeed: averageSpeed,
    };
    
    try {
      const rideHistoryService = new RideHistoryService();
      await rideHistoryService.saveRide(ride);
      
      set({
        lastRide: ride,
        currentDistance: 0,
        currentDuration: 0,
        locations: [],
        startTime: null,
      });
    } catch (error) {
      console.error('Failed to save ride:', error);
    }
  },
}));