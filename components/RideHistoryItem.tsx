import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Calendar, MapPin, Clock } from "lucide-react-native";

import { formatDate, formatDistance, formatDuration } from "@/utils/formatter";
import { Ride } from "@/types/ride";
import { Theme } from "@/constants/Colors";

interface RideHistoryItemProps {
  ride: Ride;
}

const RideHistoryItem = ({ ride }: RideHistoryItemProps) => {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: "https://images.pexels.com/photos/5466263/pexels-photo-5466263.jpeg?auto=compress&cs=tinysrgb&w=600",
            }}
            style={styles.mapImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.titleText}>{formatDate(ride.date)}</Text>

          <View style={styles.infoRow}>
            <MapPin size={16} color={Theme.colors.textSecondary} />
            <Text style={styles.infoText} numberOfLines={1}>
              {ride.startLocation || "Unknown location"}
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {formatDistance(ride.distance)}
              </Text>
              <Text style={styles.statLabel}>Distance</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {formatDuration(ride.duration)}
              </Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.borderRadius.lg,
    marginBottom: Theme.spacing.md,
    ...Theme.shadow.sm,
    overflow: "hidden",
  },
  content: {
    flexDirection: "row",
  },
  imageContainer: {
    width: 100,
    height: "100%",
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
  detailsContainer: {
    flex: 1,
    padding: Theme.spacing.md,
  },
  titleText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Theme.spacing.sm,
  },
  infoText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: Theme.colors.textSecondary,
    marginLeft: Theme.spacing.xs,
    flex: 1,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Theme.spacing.xs,
  },
  statItem: {
    marginRight: Theme.spacing.md,
  },
  statValue: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: Theme.colors.primary,
  },
  statLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: Theme.colors.textSecondary,
  },
});

export default RideHistoryItem;
