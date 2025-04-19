import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Calendar, Trophy } from "lucide-react-native";

import { formatDistance } from "@/utils/formatter";
import { Theme } from "@/constants/Colors";

interface DailyStatsCardProps {
  todayDistance: number;
  ridesCount: number;
  loyaltyPoints: number;
}

const DailyStatsCard = ({
  todayDistance,
  ridesCount,
  loyaltyPoints,
}: DailyStatsCardProps) => {
  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Calculate progress towards daily goal (110km)
  const progressPercentage = Math.min((todayDistance / 110000) * 100, 100);
  const pointsToEarn = todayDistance >= 110000 ? 50 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Calendar color={Theme.colors.primary} size={20} />
        <Text style={styles.headerText}>Today's Stats</Text>
      </View>

      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{todayDate}</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${progressPercentage}%` }]}
          />
        </View>
        <Text style={styles.progressText}>
          {formatDistance(todayDistance)} / 110 km
        </Text>
        {todayDistance < 110000 && (
          <Text style={styles.pointsInfo}>
            Ride {formatDistance(110000 - todayDistance)} more to earn 50
            points!
          </Text>
        )}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{ridesCount}</Text>
          <Text style={styles.statLabel}>Rides Today</Text>
        </View>

        <View style={[styles.statItem, styles.pointsItem]}>
          <View style={styles.pointsHeader}>
            <Trophy color={Theme.colors.primary} size={16} />
            <Text style={styles.pointsTitle}>Points</Text>
          </View>
          <Text style={styles.statValue}>{pointsToEarn}</Text>
          <Text style={styles.statLabel}>Available</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    ...Theme.shadow.sm,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Theme.spacing.sm,
  },
  headerText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: Theme.colors.text,
    marginLeft: Theme.spacing.sm,
  },
  dateContainer: {
    marginBottom: Theme.spacing.md,
  },
  dateText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: Theme.colors.textSecondary,
  },
  progressContainer: {
    marginBottom: Theme.spacing.lg,
  },
  progressBar: {
    height: 8,
    backgroundColor: Theme.colors.backgroundSecondary,
    borderRadius: Theme.borderRadius.round,
    marginBottom: Theme.spacing.xs,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.round,
  },
  progressText: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: Theme.colors.textSecondary,
    textAlign: "right",
  },
  pointsInfo: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: Theme.spacing.xs,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Theme.colors.backgroundSecondary,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginHorizontal: Theme.spacing.xs,
  },
  pointsItem: {
    backgroundColor: Theme.colors.backgroundSecondary,
  },
  pointsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Theme.spacing.xs,
  },
  pointsTitle: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: Theme.colors.textSecondary,
    marginLeft: Theme.spacing.xs,
  },
  statValue: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: Theme.colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: Theme.colors.textSecondary,
    textAlign: "center",
  },
});

export default DailyStatsCard;
