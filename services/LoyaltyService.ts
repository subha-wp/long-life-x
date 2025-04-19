import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoyaltyPoints, LoyaltyHistory } from "@/types/loyalty";
import { format } from "date-fns";

export class LoyaltyService {
  private readonly LOYALTY_STORAGE_KEY = "bike_tracker_loyalty";
  private static instance: LoyaltyService;

  private constructor() {}

  static getInstance(): LoyaltyService {
    if (!LoyaltyService.instance) {
      LoyaltyService.instance = new LoyaltyService();
    }
    return LoyaltyService.instance;
  }

  async calculatePoints(distance: number): Promise<number> {
    // Convert distance from meters to kilometers
    const distanceInKm = distance / 1000;

    // Only award points if distance is >= 110km
    return distanceInKm >= 110 ? 50 : 0;
  }

  async addLoyaltyPoints(rideId: string, distance: number): Promise<void> {
    try {
      const points = await this.calculatePoints(distance);

      if (points === 0) return; // Don't store if no points earned

      const loyaltyPoints: LoyaltyPoints = {
        id: `loyalty-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        date: new Date(),
        points,
        distance,
        rideId,
      };

      const existingPointsJson = await AsyncStorage.getItem(
        this.LOYALTY_STORAGE_KEY
      );
      const existingPoints: LoyaltyPoints[] = existingPointsJson
        ? JSON.parse(existingPointsJson)
        : [];

      existingPoints.push(loyaltyPoints);

      await AsyncStorage.setItem(
        this.LOYALTY_STORAGE_KEY,
        JSON.stringify(existingPoints)
      );
    } catch (error) {
      console.error("Failed to add loyalty points:", error);
      throw error;
    }
  }

  async getLoyaltyHistory(): Promise<LoyaltyHistory[]> {
    try {
      const pointsJson = await AsyncStorage.getItem(this.LOYALTY_STORAGE_KEY);
      if (!pointsJson) return [];

      const points: LoyaltyPoints[] = JSON.parse(pointsJson);

      // Group by date
      const groupedPoints = points.reduce(
        (acc: { [key: string]: LoyaltyHistory }, point) => {
          const dateKey = format(new Date(point.date), "yyyy-MM-dd");

          if (!acc[dateKey]) {
            acc[dateKey] = {
              date: dateKey,
              points: 0,
              rides: [],
            };
          }

          acc[dateKey].points += point.points;
          acc[dateKey].rides.push({
            distance: point.distance,
            points: point.points,
            rideId: point.rideId,
          });

          return acc;
        },
        {}
      );

      return Object.values(groupedPoints).sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } catch (error) {
      console.error("Failed to get loyalty history:", error);
      return [];
    }
  }

  async getTotalPoints(): Promise<number> {
    try {
      const history = await this.getLoyaltyHistory();
      return history.reduce((total, day) => total + day.points, 0);
    } catch (error) {
      console.error("Failed to get total points:", error);
      return 0;
    }
  }
}
