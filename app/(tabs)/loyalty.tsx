// @ts-nocheck
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoyaltyService } from "@/services/LoyaltyService";
import { Theme } from "@/constants/Colors";
import LoyaltyHistoryCard from "@/components/LoyaltyHistoryCard";
import { Trophy, Award } from "lucide-react-native";

export default function Loyalty() {
  const [selectedFilterIndex, setSelectedFilterIndex] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loyaltyHistory, setLoyaltyHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const filters = ["All Time", "This Week", "This Month"];

  useEffect(() => {
    loadLoyaltyData();
  }, [selectedFilterIndex]);

  const loadLoyaltyData = async () => {
    setIsLoading(true);
    try {
      const loyaltyService = LoyaltyService.getInstance();
      const history = await loyaltyService.getLoyaltyHistory();
      const total = await loyaltyService.getTotalPoints();

      setLoyaltyHistory(history);
      setTotalPoints(total);
    } catch (error) {
      console.error("Failed to load loyalty data:", error);
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
      <View style={styles.header}>
        <Trophy color={Theme.colors.primary} size={40} />
        <Text style={styles.totalPoints}>{totalPoints}</Text>
        <Text style={styles.totalPointsLabel}>Total Points</Text>
      </View>

      <View style={styles.infoCard}>
        <Award color={Theme.colors.primary} size={24} />
        <Text style={styles.infoText}>
          Earn 50 points for every ride over 110km in a single day!
        </Text>
      </View>

      <View style={styles.filtersContainer}>
        {filters.map(renderFilterOption)}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading loyalty data...</Text>
        </View>
      ) : (
        <LoyaltyHistoryCard history={loyaltyHistory} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    alignItems: "center",
    padding: Theme.spacing.xl,
    backgroundColor: Theme.colors.card,
    marginBottom: Theme.spacing.md,
    ...Theme.shadow.sm,
  },
  totalPoints: {
    fontFamily: "Inter-Bold",
    fontSize: 48,
    color: Theme.colors.primary,
    marginTop: Theme.spacing.md,
  },
  totalPointsLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: Theme.colors.textSecondary,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.colors.backgroundSecondary,
    marginHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
  },
  infoText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: Theme.colors.text,
    marginLeft: Theme.spacing.md,
    flex: 1,
  },
  filtersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    backgroundColor: Theme.colors.backgroundSecondary,
    marginHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
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
