import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ride } from '@/types/ride';
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
} from 'date-fns';

export class RideHistoryService {
  private readonly RIDES_STORAGE_KEY = 'bike_tracker_rides';

  constructor() {}

  async getAllRides(): Promise<Ride[]> {
    try {
      const ridesJson = await AsyncStorage.getItem(this.RIDES_STORAGE_KEY);
      if (!ridesJson) return [];

      const ridesData = JSON.parse(ridesJson);
      const rides: Ride[] = ridesData.map(this.parseRideData);

      // Sort by date, newest first
      return rides.sort((a, b) => b.date.getTime() - a.date.getTime());
    } catch (error) {
      console.error('Failed to get rides:', error);
      return [];
    }
  }

  async getThisWeekRides(): Promise<Ride[]> {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    const rides = await this.getAllRides();
    return rides.filter((ride) =>
      isWithinInterval(ride.date, { start: weekStart, end: weekEnd })
    );
  }

  async getThisMonthRides(): Promise<Ride[]> {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const rides = await this.getAllRides();
    return rides.filter((ride) =>
      isWithinInterval(ride.date, { start: monthStart, end: monthEnd })
    );
  }

  async saveRide(ride: Ride): Promise<void> {
    try {
      // Get existing rides
      const existingRides = await this.getAllRides();

      // Add new ride
      existingRides.push(ride);

      // Save back to storage
      const ridesData = existingRides.map(this.serializeRideData);
      await AsyncStorage.setItem(
        this.RIDES_STORAGE_KEY,
        JSON.stringify(ridesData)
      );
    } catch (error) {
      console.error('Failed to save ride:', error);
      throw error;
    }
  }

  async deleteRide(rideId: string): Promise<void> {
    try {
      const rides = await this.getAllRides();
      const updatedRides = rides.filter((ride) => ride.id !== rideId);

      const ridesData = updatedRides.map(this.serializeRideData);
      await AsyncStorage.setItem(
        this.RIDES_STORAGE_KEY,
        JSON.stringify(ridesData)
      );
    } catch (error) {
      console.error('Failed to delete ride:', error);
      throw error;
    }
  }

  async clearAllRides(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.RIDES_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear rides:', error);
      throw error;
    }
  }

  private parseRideData(data: any): Ride {
    return {
      ...data,
      date: new Date(data.date),
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
    };
  }

  private serializeRideData(ride: Ride): any {
    return {
      ...ride,
      date: ride.date.toISOString(),
      startTime: ride.startTime.toISOString(),
      endTime: ride.endTime.toISOString(),
    };
  }
}
