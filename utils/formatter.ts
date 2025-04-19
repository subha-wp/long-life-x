import { format } from 'date-fns';
import { useSettings } from '@/hooks/useSettings';

export const formatDistance = (distanceInMeters: number): string => {
  const { settings } = useSettings.getState();
  
  if (settings.useMetricSystem) {
    if (distanceInMeters < 1000) {
      return `${Math.round(distanceInMeters)} m`;
    } else {
      return `${(distanceInMeters / 1000).toFixed(2)} km`;
    }
  } else {
    // Convert to miles
    const distanceInMiles = distanceInMeters / 1609.34;
    if (distanceInMiles < 0.1) {
      return `${Math.round(distanceInMiles * 5280)} ft`;
    } else {
      return `${distanceInMiles.toFixed(2)} mi`;
    }
  }
};

export const formatDuration = (durationInSeconds: number): string => {
  if (durationInSeconds < 60) {
    return `${durationInSeconds}s`;
  }
  
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const seconds = Math.floor(durationInSeconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
};

export const formatDate = (date: Date): string => {
  return format(date, 'MMM d, yyyy');
};

export const formatTime = (date: Date): string => {
  return format(date, 'h:mm a');
};

export const formatSpeed = (speedInMetersPerSecond: number): string => {
  const { settings } = useSettings.getState();
  
  if (settings.useMetricSystem) {
    // Convert to km/h
    const speedInKmh = speedInMetersPerSecond * 3.6;
    return `${speedInKmh.toFixed(1)} km/h`;
  } else {
    // Convert to mph
    const speedInMph = speedInMetersPerSecond * 2.23694;
    return `${speedInMph.toFixed(1)} mph`;
  }
};