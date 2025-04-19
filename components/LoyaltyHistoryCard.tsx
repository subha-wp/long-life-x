import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { formatDistance, formatDate } from "@/utils/formatter";
import { LoyaltyHistory } from "@/types/loyalty";
import { Theme } from "@/constants/Colors";
import { Trophy } from "lucide-react-native";

interface LoyaltyHistoryCardProps {
  history: LoyaltyHistory[];
}

const LoyaltyHistoryCard = ({ history }: LoyaltyHistoryCardProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Trophy color={Theme.colors.primary} size={24} />
        <Text style={styles.title}>Loyalty Points History</Text>
      </View>

      <ScrollView style={styles.historyList}>
        {history.map((day) => (
          <View key={day.date} style={styles.dayContainer}>
            <View style={styles.dayHeader}>
              <Text style={styles.dateText}>
                {formatDate(new Date(day.date))}
              </Text>
              <Text style={styles.pointsText}>{day.points} points</Text>
            </View>

            {day.rides.map((ride, index) => (
              <View key={ride.rideId} style={styles.rideItem}>
                <Text style={styles.rideDistance}>
                  {formatDistance(ride.distance)}
                </Text>
                <Text style={styles.ridePoints}>+{ride.points} pts</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    ...Theme.shadow.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Theme.spacing.md,
  },
  title: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: Theme.colors.text,
    marginLeft: Theme.spacing.sm,
  },
  historyList: {
    maxHeight: 300,
  },
  dayContainer: {
    marginBottom: Theme.spacing.md,
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Theme.spacing.sm,
  },
  dateText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: Theme.colors.text,
  },
  pointsText: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    color: Theme.colors.primary,
  },
  rideItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    backgroundColor: Theme.colors.backgroundSecondary,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.xs,
  },
  rideDistance: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: Theme.colors.textSecondary,
  },
  ridePoints: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: Theme.colors.success,
  },
});

export default LoyaltyHistoryCard;
