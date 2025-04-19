import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { CalendarDays, MapPin } from "lucide-react-native";

import { formatDate, formatDistance, formatDuration } from "@/utils/formatter";
import { useTrackingStore } from "@/stores/trackingStore";
import { Theme } from "@/constants/Colors";

const RideSummaryCard = () => {
  const { lastRide } = useTrackingStore();

  if (!lastRide) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Last Ride</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No rides yet. Start tracking to see your stats here!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Last Ride</Text>

      <View style={styles.content}>
        <View style={styles.mapContainer}>
          <Image
            source={{
              uri: "https://img.freepik.com/premium-vector/electric-car-charging-station-vector-illustration-green-glowing-ev-filling-up-battery_261737-686.jpg",
            }}
            style={styles.mapImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.dateContainer}>
            <CalendarDays color={Theme.colors.textSecondary} size={16} />
            <Text style={styles.dateText}>{formatDate(lastRide.date)}</Text>
          </View>

          <View style={styles.locationContainer}>
            <MapPin color={Theme.colors.textSecondary} size={16} />
            <Text style={styles.locationText} numberOfLines={1}>
              {lastRide.startLocation || "Unknown location"}
            </Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {formatDistance(lastRide.distance)}
              </Text>
              <Text style={styles.statLabel}>Distance</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {formatDuration(lastRide.duration)}
              </Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
          </View>
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
    marginBottom: Theme.spacing.md,
    ...Theme.shadow.sm,
  },
  title: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
  },
  content: {
    flexDirection: "column",
  },
  mapContainer: {
    height: 120,
    borderRadius: Theme.borderRadius.md,
    overflow: "hidden",
    marginBottom: Theme.spacing.md,
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
  detailsContainer: {
    flex: 1,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Theme.spacing.sm,
  },
  dateText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: Theme.colors.textSecondary,
    marginLeft: Theme.spacing.sm,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Theme.spacing.md,
  },
  locationText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: Theme.colors.textSecondary,
    marginLeft: Theme.spacing.sm,
    flex: 1,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontFamily: "Inter-Bold",
    fontSize: 22,
    color: Theme.colors.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: Theme.colors.textSecondary,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: Theme.colors.border,
    marginHorizontal: Theme.spacing.md,
  },
  emptyState: {
    padding: Theme.spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: Theme.colors.textSecondary,
    textAlign: "center",
  },
});

export default RideSummaryCard;
