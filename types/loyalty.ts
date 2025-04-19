export interface LoyaltyPoints {
  id: string;
  date: Date;
  points: number;
  distance: number;
  rideId: string;
}

export interface LoyaltyHistory {
  date: string;
  points: number;
  rides: {
    distance: number;
    points: number;
    rideId: string;
  }[];
}
