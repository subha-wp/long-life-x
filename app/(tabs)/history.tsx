import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RideHistoryService } from "@/services/RideHistoryService";
import { Ride } from "@/types/ride";
import RideHistoryItem from "@/components/RideHistoryItem";
import EmptyState from "@/components/EmptyState";
import { Theme } from "@/constants/Colors";

export default function History() {
  const [rideHistory, setRideHistory] = useState<Ride[]>([]);
  const [selectedFilterIndex, setSelectedFilterIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const filters = ["All", "This Week", "This Month"];

  useEffect(() => {
    loadRideHistory();
  }, [selectedFilterIndex]);

  const loadRideHistory = async () => {
    setIsLoading(true);
    try {
      const historyService = new RideHistoryService();
      let rides: Ride[];

      switch (selectedFilterIndex) {
        case 1: // This Week
          rides = await historyService.getThisWeekRides();
          break;
        case 2: // This Month
          rides = await historyService.getThisMonthRides();
          break;
        default: // All
          rides = await historyService.getAllRides();
      }

      setRideHistory(rides);
    } catch (error) {
      console.error("Failed to load ride history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFilterOption = (option: string, index: number) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.filterOption,
        selectedFilterIndex === index && styles.filterOptionSelected,
      ]}
      onPress={() => setSelectedFilterIndex(index)}
    >
      <Text
        style={[
          styles.filterOptionText,
          selectedFilterIndex === index && styles.filterOptionTextSelected,
        ]}
      >
        {option}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.filtersContainer}>
        {filters.map(renderFilterOption)}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading ride history...</Text>
        </View>
      ) : rideHistory.length > 0 ? (
        <FlatList
          data={rideHistory}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RideHistoryItem ride={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          icon="history"
          title="No Rides Found"
          message="Start tracking your rides to see them listed here."
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  filtersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    backgroundColor: Theme.colors.backgroundSecondary,
    marginHorizontal: Theme.spacing.md,
    marginTop: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
  },
  filterOption: {
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
  },
  filterOptionSelected: {
    backgroundColor: Theme.colors.primary,
  },
  filterOptionText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: Theme.colors.textSecondary,
  },
  filterOptionTextSelected: {
    color: "#fff",
    fontFamily: "Inter-SemiBold",
  },
  listContent: {
    padding: Theme.spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: Theme.colors.textSecondary,
  },
});
